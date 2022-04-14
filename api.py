import json
from flask import Flask, request, jsonify, make_response

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
               RETURN a.screen_name, t_a.text, t_a.timestamp, COLLECT([b.screen_name, t_b.text, t_b.timestamp]) ORDER BY t_a.timestamp DESC, t_b.timestamp DESC"""

    query = build_params_header(params) + query
    resp = exec(r, query)

    return jsonify(resp)


@app.route('/q2', methods=['GET'])
def question2():

    query = """MATCH (c:Country)<-[:At]-(:Tweet) RETURN c.text, count(*) AS CNT ORDER BY CNT DESC"""

    resp = exec(r, query)

    return jsonify(resp)


@app.route('/q3', methods=['GET'])
def question3():

    query = """MATCH (u:User)-[:Post]->(:Tweet {type:'tweet'}) RETURN u.id, u.screen_name, count(*) AS CNT ORDER BY CNT DESC LIMIT 10"""

    resp = exec(r, query)

    return jsonify(resp)


app.run(debug=True, port=8080)