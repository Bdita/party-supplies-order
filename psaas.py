from flask import Flask, jsonify, request, current_app, make_response
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from datetime import datetime as dt, timedelta
from json import dumps


app = Flask(__name__)
app.config["MONGO_DBNAME"] = "restdb"
app.config['MONGO_URI'] = 'mongodb://localhost:27017/restdb'
app.config['CORS_HEADERS'] = 'Content-Type Etag'

mongo = PyMongo(app)
cors = CORS(app)

with app.app_context():
    etagstore = mongo.db.etagstore


def jsonify(**kwargs):
    response = make_response(dumps(kwargs))
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    response.last_modified = dt.utcnow()
    response.add_etag()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Expose-Headers'] = 'ETag'
    return response


@app.route('/api/v1/supplies', methods=['GET'])
def get_all_supplies():
    supplies = mongo.db.supplies
    output = []
    for q in supplies.find():
        output.append({'name': q['name'], 'supply': q['supply'], 'amount': q['amount']})

    response = jsonify(result=output)
    # store etag in data_store
    etag = response.headers.get('ETag')
    # if store is empty insert a document else find the document with id '1' and replace with new etag generated
    if etagstore.count() == 0:
        store_id = etagstore.insert_one({'etagStore_id': '1', 'etag': etag})
    else:
        etagstore.find_one_and_replace({'etagStore_id': '1'}, {'etagStore_id': '1', 'etag': etag})
    return response


@app.route('/api/v1/supplies', methods=['POST'])
def add_supply():
    supplies = mongo.db.supplies
    data = request.get_json()

    name = data['name']
    supply = data['supply']
    amount = data['amount']

    etagClient = request.headers.get('If-Match')

    # Get etag from data store
    etag_object = etagstore.find_one({'etagStore_id': '1'})
    etagServer = etag_object['etag']

    # if etag from client and server are the same, that means no changes in supply collection has occured.
    # Allow the post to happen and update etag in data store
    if etagClient == etagServer:
        supplies_id = supplies.insert({'name': name, 'supply': supply, 'amount': amount})
        new_supplies = supplies.find_one({'_id': supplies_id})

        output = {'name': new_supplies['name'], 'supply': new_supplies['supply'], 'amount': new_supplies['amount']}

        response = jsonify(result=output)
        etag = response.headers.get('ETag')
        if etagstore.count() == 0:
            store_id = etagstore.insert_one({'etagStore_id': '1', 'etag': etag})
        else:
            etagstore.find_one_and_replace({'etagStore_id': '1'}, {'etagStore_id': '1', 'etag': etag})
        return response
    # if etags are not the same, raise 412 response
    else:
        error_response = make_response('')
        error_response.status_code = 412
        return error_response


if __name__ == '__main__':
    app.run(debug=True)
