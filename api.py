import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

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


r = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)

app = Flask(__name__, static_url_path='', static_folder='static')
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route('/health')
def health():
    return jsonify(success=True)


@app.route('/q1', methods=['GET'])
def question1():

    params = {
        'screen_name': request.args.get('screen_name'),
    }

    if params['screen_name'] is None:
        return jsonify(error="parameter `screen_name` not found")

    query = """MATCH (a:User {screen_name: $screen_name})-[:Post]->(t_a:Tweet {type:'tweet'}) \
               OPTIONAL MATCH (t_a)<-[:Reply]-(t_b:Tweet {type:'reply'})<-[:Post]-(b:User) \
               RETURN a.id, a.screen_name, t_a.id, t_a.text, t_a.timestamp, b.id, b.screen_name, t_b.id, t_b.text, t_b.timestamp \
               ORDER BY t_a.timestamp DESC, t_b.timestamp DESC"""

    query = build_params_header(params) + query

    results = exec(r, query)[1]

    resp = []
    for result in results:
        a_id = result[0][1]
        a_screen_name = result[1][1]
        ta_id = result[2][1]
        ta_text = result[3][1]
        ta_ts = result[4][1]
        b_id = result[5][1]
        b_screen_name = result[6][1]
        tb_id = result[7][1]
        tb_text = result[8][1]
        tb_ts = result[9][1]

        if len(resp) > 0 and resp[-1][2] == ta_id and tb_id is not None:
            resp[-1][5].append([b_id, b_screen_name, tb_id, tb_text, tb_ts])
        else:
            resp.append([a_id, a_screen_name, ta_id, ta_text, ta_ts, []])
            if tb_id is not None:
                resp[-1][5].append([b_id, b_screen_name, tb_id, tb_text, tb_ts])

    return jsonify(resp)


@app.route('/q2', methods=['GET'])
def question2():

    params = {
        'start_ts': int(request.args.get('start_ts')) if request.args.get('start_ts') is not None else None,
        'end_ts': int(request.args.get('end_ts')) if request.args.get('end_ts') is not None else None,
    }

    query = """MATCH (c:Country)<-[:At]-(t:Tweet) """

    if params['start_ts'] is not None and params['end_ts'] is not None:
        query += """WHERE t.timestamp >= $start_ts AND t.timestamp <= $end_ts """
    elif params['start_ts'] is not None:
        query += """WHERE t.timestamp >= $start_ts """
    elif params['end_ts'] is not None:
        query += """WHERE t.timestamp <= $end_ts """

    query += """RETURN c.text, count(*) AS CNT \
                ORDER BY CNT DESC LIMIT 8"""

    query = build_params_header(params) + query

    results = exec(r, query)[1]

    resp = []
    for result in results:
        country = result[0][1]
        cnt = result[1][1]
        resp.append([country, cnt])

    return jsonify(resp)


@app.route('/q3', methods=['GET'])
def question3():

    params = {
        'start_ts': int(request.args.get('start_ts')) if request.args.get('start_ts') is not None else None,
        'end_ts': int(request.args.get('end_ts')) if request.args.get('end_ts') is not None else None,
    }

    query = """MATCH (u:User)-[:Post]->(t:Tweet {type:'tweet'}) """

    if params['start_ts'] is not None and params['end_ts'] is not None:
        query += """WHERE t.timestamp >= $start_ts AND t.timestamp <= $end_ts """
    elif params['start_ts'] is not None:
        query += """WHERE t.timestamp >= $start_ts """
    elif params['end_ts'] is not None:
        query += """WHERE t.timestamp <= $end_ts """

    query += """RETURN u.id, u.screen_name, count(*) AS CNT \
                ORDER BY CNT DESC LIMIT 10"""

    query = build_params_header(params) + query

    results = exec(r, query)[1]

    resp = []
    for result in results:
        uid = result[0][1]
        screen_name = result[1][1]
        cnt = result[2][1]
        resp.append([uid, screen_name, cnt])

    return jsonify(resp)


@app.route('/q4', methods=['GET'])
def question4():

    #   86400 seconds = 1 day
    #  604800 seconds = 1 week
    # 2629743 seconds = 1 month
    aggregation = 2629743

    if request.args.get('aggregation') is not None:
        if request.args.get('aggregation') == "day":
            aggregation = 86400
        elif request.args.get('aggregation') == "week":
            aggregation = 604800

    params = {
        'start_ts': int(request.args.get('start_ts')) if request.args.get('start_ts') is not None else None,
        'end_ts': int(request.args.get('end_ts')) if request.args.get('end_ts') is not None else None,
    }

    query = """MATCH (h:Hashtag)<-[:Tag]-(t:Tweet) """

    if params['start_ts'] is not None and params['end_ts'] is not None:
        query += """WHERE t.timestamp >= $start_ts AND t.timestamp <= $end_ts """
    elif params['start_ts'] is not None:
        query += """WHERE t.timestamp >= $start_ts """
    elif params['end_ts'] is not None:
        query += """WHERE t.timestamp <= $end_ts """

    query += """RETURN h.text, count(*) AS CNT, COLLECT(t.timestamp) \
                ORDER BY CNT DESC LIMIT 100"""

    query = build_params_header(params) + query

    results = exec(r, query)[1]

    resp = []
    for result in results:
        hashtag = result[0][1]
        count = result[1][1]
        timestamps = {}
        for t in result[2][1]:
            ts = ( t[1] // aggregation ) * aggregation
            timestamps[ts] = timestamps.get(ts, 0) + 1
        timestamps = [[k, v] for k, v in timestamps.items()]
        timestamps.sort()
        resp.append([hashtag, count, timestamps])

    return jsonify(resp)


@app.route('/q5', methods=['GET'])
def question5():

    query = """MATCH (a:User)-[:Post]->(:Tweet)-[:Reply]->(:Tweet)<-[:Post]-(b:User)-[:Post]->(:Tweet)<-[:Reply]-(:Tweet)<-[:Post]-(c:User) \
               MATCH (b)-[:Post]->(:Tweet)-[:Reply]->(:Tweet)<-[:Post]-(a)-[:Post]->(:Tweet)<-[:Reply]-(:Tweet)<-[:Post]-(c) \
               MATCH (a)-[:Post]->(:Tweet)-[:Reply]->(:Tweet)<-[:Post]-(c)-[:Post]->(:Tweet)<-[:Reply]-(:Tweet)<-[:Post]-(b) \
               WHERE a.id < b.id AND b.id < c.id \
               RETURN DISTINCT a.id, a.screen_name, b.id, b.screen_name, c.id, c.screen_name"""

    results = exec(r, query)[1]

    resp = []
    for result in results:
        a_id = result[0][1]
        a_screen_name = result[1][1]
        b_id = result[2][1]
        b_screen_name = result[3][1]
        c_id = result[4][1]
        c_screen_name = result[5][1]
        resp.append([[a_id, a_screen_name], [b_id, b_screen_name], [c_id, c_screen_name]])

    return jsonify(resp)


@app.route('/q6', methods=['GET'])
def question6():

    query = """MATCH (u:User {verified: True})-[:Post]->(t:Tweet) \
               RETURN u.id, u.screen_name, t.type, COUNT(t.type) ORDER BY u.id"""

    results = exec(r, query)[1]

    resp = []
    for result in results:
        _id = result[0][1]
        screen_name = result[1][1]
        _type = result[2][1]
        count = result[3][1]

        if len(resp) == 0:
            resp.append([_id, screen_name, [0, 0, 0, 0]])

        if resp[-1][0] != _id:
            total = sum(resp[-1][2])
            for i in range(4):
                resp[-1][2][i] = (resp[-1][2][i] / total) * 100
                resp[-1][2][i] = "{:.2f}".format(resp[-1][2][i])
            resp.append([_id, screen_name, [0, 0, 0, 0]])

        if _type == "tweet":
            resp[-1][2][0] = count
        elif _type == "reply":
            resp[-1][2][1] = count
        elif _type == "retweet":
            resp[-1][2][2] = count
        elif _type == "quotedRetweet":
            resp[-1][2][3] = count

    return jsonify(resp)


app.run(debug=True, host='0.0.0.0', port=8080)