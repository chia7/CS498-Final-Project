import json
from datetime import datetime

import redis
from redisgraph.util import stringify_param_value


def build_params_header(params):
    if not isinstance(params, dict):
        raise TypeError("'params' must be a dict")
    # Header starts with "CYPHER"
    params_header = "CYPHER "
    for key, value in params.items():
        params_header += str(key) + "=" + stringify_param_value(value) + " "
    return params_header


def exec(r, query, name='Twitter'):
    command = ["GRAPH.QUERY", name, query, "--compact"]
    try:
        response = r.execute_command(*command)
        return response
    except redis.exceptions.ResponseError as e:
        print( str(e) )
        raise e


r = redis.Redis(host='localhost', port=6379)

tw = 0
rp = 0
rt = 0
rtq = 0
total = 0

with open('./data/d5-partial.json', 'r') as json_file:
    for line in json_file:
        line = line.strip()

        if len(line) == 0:
            continue

        try:
            data = json.loads(line)


            # Dirty data
            if not data.get('limit') is None:
                continue


            # Reply
            if not data.get('in_reply_to_status_id') is None:

                # User a replies to User b
                params = {
                    'uid_a': data['user']['id'],
                    'screen_name_a': data['user']['screen_name'],
                    'verified_a': data['user']['verified'],
                    'tid_a': data['id'],
                    'text_a': data['text'],
                    'timestamp_a': int(data['timestamp_ms']) // 1000,
                    'uid_b': data['in_reply_to_user_id'],
                    'tid_b': data['in_reply_to_status_id'],
                }

                query = """MERGE (a:User { id: $uid_a }) \
                        SET a = { id: $uid_a, screen_name: $screen_name_a, verified: $verified_a } \
                        MERGE (b:User { id: $uid_b }) \
                        MERGE (t_a:Tweet { id: $tid_a }) \
                        SET t_a = { id: $tid_a, type:"reply", text: $text_a, timestamp: $timestamp_a } \
                        MERGE (t_b:Tweet { id: $tid_b }) \
                        MERGE (a)-[:Post]->(t_a)-[:Reply]->(t_b)<-[:Post]-(b) """

                if len(data['entities']['hashtags']) > 0:
                    for i, h in enumerate(data['entities']['hashtags']):
                        params['hashtag_a_' + str(i)] = h['text']
                        query += "MERGE (h_a_{}:Hashtag {{ text: $hashtag_a_{} }}) \
                                  MERGE (h_a_{})<-[:Tag]-(t_a) ".format(i, i, i)

                if not data.get('place') is None:
                    params['country_a'] = data['place']['country']
                    query += """MERGE (c_a:Country { text: $country_a }) \
                              MERGE (c_a)<-[:At]-(t_a) """

                query = build_params_header(params) + query
                resp = exec(r, query)
                
                rp += 1

            # Retweet with quote
            elif not data.get('quoted_status') is None:

                # User a retweet with quote to User b
                params = {
                    'uid_a': data['user']['id'],
                    'screen_name_a': data['user']['screen_name'],
                    'verified_a': data['user']['verified'],
                    'tid_a': data['id'],
                    'text_a': data['text'],
                    'timestamp_a': int(data['timestamp_ms']) // 1000,
                    'uid_b': data['quoted_status']['user']['id'],
                    'screen_name_b': data['quoted_status']['user']['screen_name'],
                    'verified_b': data['quoted_status']['user']['verified'],
                    'tid_b': data['quoted_status']['id'],
                    'text_b': data['quoted_status']['text'],
                    'timestamp_b': int(datetime.strptime(data['quoted_status']['created_at'], "%a %b %d %H:%M:%S %z %Y").timestamp()),
                }

                query = """MERGE (a:User { id: $uid_a }) \
                        SET a = { id: $uid_a, screen_name: $screen_name_a, verified: $verified_a } \
                        MERGE (b:User { id: $uid_b }) \
                        SET b = { id: $uid_b, screen_name: $screen_name_b, verified: $verified_b } \
                        MERGE (t_a:Tweet { id: $tid_a }) \
                        SET t_a = { id: $tid_a, type:"quotedRetweet", text: $text_a, timestamp: $timestamp_a } \
                        MERGE (t_b:Tweet { id: $tid_b }) \
                        SET t_b = { id: $tid_b, type:"tweet", text: $text_b, timestamp: $timestamp_b } \
                        MERGE (a)-[:Post]->(t_a)-[:QuotedRetweet]->(t_b)<-[:Post]-(b) """

                if len(data['entities']['hashtags']) > 0:
                    for i, h in enumerate(data['entities']['hashtags']):
                        params['hashtag_a_' + str(i)] = h['text']
                        query += "MERGE (h_a_{}:Hashtag {{ text: $hashtag_a_{} }}) \
                                  MERGE (h_a_{})<-[:Tag]-(t_a) ".format(i, i, i)

                if len(data['quoted_status']['entities']['hashtags']) > 0:
                    for i, h in enumerate(data['quoted_status']['entities']['hashtags']):
                        params['hashtag_b_' + str(i)] = h['text']
                        query += "MERGE (h_b_{}:Hashtag {{ text: $hashtag_b_{} }}) \
                                  MERGE (h_b_{})<-[:Tag]-(t_b) ".format(i, i, i)

                if not data.get('place') is None:
                    params['country_a'] = data['place']['country']
                    query += """MERGE (c_a:Country { text: $country_a }) \
                              MERGE (c_a)<-[:At]-(t_a) """

                if not data['quoted_status'].get('place') is None:
                    params['country_b'] = data['quoted_status']['place']['country']
                    query += """MERGE (c_b:Country { text: $country_b }) \
                              MERGE (c_b)<-[:At]-(t_b) """

                query = build_params_header(params) + query
                resp = exec(r, query)

                rtq += 1

            # Retweet
            elif not data.get('retweeted_status') is None:

                # User a retweet to User b
                params = {
                    'uid_a': data['user']['id'],
                    'screen_name_a': data['user']['screen_name'],
                    'verified_a': data['user']['verified'],
                    'tid_a': data['id'],
                    'text_a': data['text'],
                    'timestamp_a': int(data['timestamp_ms']) // 1000,
                    'uid_b': data['retweeted_status']['user']['id'],
                    'screen_name_b': data['retweeted_status']['user']['screen_name'],
                    'verified_b': data['retweeted_status']['user']['verified'],
                    'tid_b': data['retweeted_status']['id'],
                    'text_b': data['retweeted_status']['text'],
                    'timestamp_b': int(datetime.strptime(data['retweeted_status']['created_at'], "%a %b %d %H:%M:%S %z %Y").timestamp()),
                }

                query = """MERGE (a:User { id: $uid_a }) \
                        SET a = { id: $uid_a, screen_name: $screen_name_a, verified: $verified_a } \
                        MERGE (b:User { id: $uid_b }) \
                        SET b = { id: $uid_b, screen_name: $screen_name_b, verified: $verified_b } \
                        MERGE (t_a:Tweet { id: $tid_a }) \
                        SET t_a = { id: $tid_a, type:"retweet", text: $text_a, timestamp: $timestamp_a } \
                        MERGE (t_b:Tweet { id: $tid_b }) \
                        SET t_b = { id: $tid_b, type:"tweet", text: $text_b, timestamp: $timestamp_b } \
                        MERGE (a)-[:Post]->(t_a)-[:Retweet]->(t_b)<-[:Post]-(b) """

                if len(data['entities']['hashtags']) > 0:
                    for i, h in enumerate(data['entities']['hashtags']):
                        params['hashtag_a_' + str(i)] = h['text']
                        query += "MERGE (h_a_{}:Hashtag {{ text: $hashtag_a_{} }}) \
                                  MERGE (h_a_{})<-[:Tag]-(t_a) ".format(i, i, i)

                if len(data['retweeted_status']['entities']['hashtags']) > 0:
                    for i, h in enumerate(data['retweeted_status']['entities']['hashtags']):
                        params['hashtag_b_' + str(i)] = h['text']
                        query += "MERGE (h_b_{}:Hashtag {{ text: $hashtag_b_{} }}) \
                                  MERGE (h_b_{})<-[:Tag]-(t_b) ".format(i, i, i)

                if not data.get('place') is None:
                    params['country_a'] = data['place']['country']
                    query += """MERGE (c_a:Country { text: $country_a }) \
                              MERGE (c_a)<-[:At]-(t_a) """

                if not data['retweeted_status'].get('place') is None:
                    params['country_b'] = data['retweeted_status']['place']['country']
                    query += """MERGE (c_b:Country { text: $country_b }) \
                              MERGE (c_b)<-[:At]-(t_b) """

                query = build_params_header(params) + query
                resp = exec(r, query)

                rt += 1

            # Tweet
            else:

                params = {
                    'uid': data['user']['id'],
                    'screen_name': data['user']['screen_name'],
                    'verified': data['user']['verified'],
                    'tid': data['id'],
                    'text': data['text'],
                    'timestamp': int(data['timestamp_ms']) // 1000,
                }

                query = """MERGE (u:User { id: $uid }) \
                        SET u = { id: $uid, screen_name: $screen_name, verified: $verified } \
                        MERGE (t:Tweet { id: $tid }) \
                        SET t = { id: $tid, type:"tweet", text: $text, timestamp: $timestamp } \
                        MERGE (u)-[:Post]->(t) """

                if len(data['entities']['hashtags']) > 0:
                    for i, h in enumerate(data['entities']['hashtags']):
                        params['hashtag_' + str(i)] = h['text']
                        query += "MERGE (h_{}:Hashtag {{ text: $hashtag_{} }}) \
                                  MERGE (h_{})<-[:Tag]-(t) ".format(i, i, i)
                
                if not data.get('place') is None:
                    params['country'] = data['place']['country']
                    query += """MERGE (c:Country { text: $country }) \
                              MERGE (c)<-[:At]-(t) """

                query = build_params_header(params) + query
                resp = exec(r, query)

                tw += 1


            total += 1

            # if tw > 0 and rt > 0 and rtq > 0 and rp > 0:
            #     break

        except:
            print(json.dumps(data, indent=4, sort_keys=True))
            break

print("tweet = {}, reply = {}, retweet = {}, retweet with quote = {}, total = {}".format(tw, rp, rt, rtq, total))

'''
Some Testing Commands

GRAPH.QUERY Twitter "MATCH (u:User) Return u" 
GRAPH.QUERY Twitter "MATCH (n) DETACH DELETE n" 
'''