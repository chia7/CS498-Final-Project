import json
from flask import Flask, request, jsonify, make_response
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

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return jsonify(success=True)


@app.route('/q1', methods=['GET'])
def question1():

    params = {
        'screen_name': request.args.get('screen_name'),
    }

    if params['screen_name'] is None:
        return jsonify(error="parameter `screen_name` not found")

    query = """MATCH (a:User {screen_name: $screen_name})-[:Post]->(t_a:Tweet {type:'tweet'})<-[:Reply]-(t_b:Tweet {type:'reply'})<-[:Post]-(b:User) \
               RETURN a.screen_name, t_a.text, t_a.timestamp, COLLECT([b.screen_name, t_b.text, t_b.timestamp]) \
               ORDER BY t_a.timestamp DESC, t_b.timestamp DESC"""

    query = build_params_header(params) + query
    resp = exec(r, query)

    return jsonify(resp)


@app.route('/q2', methods=['GET'])
def question2():

    query = """MATCH (c:Country)<-[:At]-(:Tweet) \
               RETURN c.text, count(*) AS CNT \
               ORDER BY CNT DESC"""

    resp = exec(r, query)

    return jsonify(resp)


@app.route('/q3', methods=['GET'])
def question3():

    query = """MATCH (u:User)-[:Post]->(:Tweet {type:'tweet'}) \
               RETURN u.id, u.screen_name, count(*) AS CNT \
               ORDER BY CNT DESC LIMIT 10"""

    resp = exec(r, query)

    return jsonify(resp)


@app.route('/q4', methods=['GET'])
def question4():

    query = """MATCH (h:Hashtag)<-[:Tag]-(t:Tweet) \
               RETURN h.text, count(*) AS CNT, COLLECT(t.timestamp) \
               ORDER BY CNT DESC LIMIT 100"""

    results = exec(r, query)[1]

    resp = []
    for result in results:
        hashtag = result[0][1]
        count = result[1][1]
        timestamps = {}
        for t in result[2][1]:
            ts = ( t[1] // 2629743 ) * 2629743  # 2629743 seconds = 1 month
            timestamps[ts] = timestamps.get(ts, 0) + 1
        timestamps = [[k, v] for k, v in timestamps.items()]
        timestamps.sort()
        resp.append([hashtag, count, timestamps])

    return jsonify(resp)


@app.route('/q5', methods=['GET'])
def question5():

    query = """MATCH (a:User)-[:Post]->(:Tweet {type:'reply'})-[:Reply]->(:Tweet)<-[:Post]-(b:User) \
               MATCH (a)-[:Post]->(:Tweet {type:'reply'})-[:Reply]->(:Tweet)<-[:Post]-(c:User) \
               MATCH (b)-[:Post]->(:Tweet {type:'reply'})-[:Reply]->(:Tweet)<-[:Post]-(a) \
               MATCH (b)-[:Post]->(:Tweet {type:'reply'})-[:Reply]->(:Tweet)<-[:Post]-(c) \
               MATCH (c)-[:Post]->(:Tweet {type:'reply'})-[:Reply]->(:Tweet)<-[:Post]-(a) \
               MATCH (c)-[:Post]->(:Tweet {type:'reply'})-[:Reply]->(:Tweet)<-[:Post]-(b) \
               WHERE a.id < b.id AND b.id < c.id \
               RETURN a.id, a.screen_name, b.id, b.screen_name, c.id, c.screen_name"""

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
        if len(resp) > 0 and resp[-1][0] == _id:
            resp[-1].append([_type, count])
        else:
            resp.append([_id, screen_name, [_type, count]])

    return jsonify(resp)


app.run(debug=True, host='0.0.0.0', port=8080)