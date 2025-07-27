"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""


import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Producto, CategoriaProductoSingle, CategoriaSingle
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file

#DECK
@app.route('/deck', methods=['GET'])
def get_decks():
    all_decks = Deck.query.all()
    results =list(map(lambda deck:deck.serialize(),all_decks ))
  
    return jsonify(results), 200

@app.route('/deck/<int:deck_id>', methods=['GET'])
def get_deck_dos(deck_id):
    deck= db.session.get(Deck, deck_id)

    return jsonify(deck.serialize()), 200

@app.route('/deck/<int:deck_id>', methods=['DELETE'])
def delete_deck(deck_id):
    deck= db.session.get(Deck, deck_id)

    response_body = {
        "msg": 'Se elimino Deck' +  deck.nombre
    }
    db.session.delete(deck)
    db.session.commit() 

    return jsonify(response_body), 200


@app.route('/deck', methods=['POST'])
def add_deck():

    print(request)
    print(request.get_json())
    print(request.get_json()['nombre'])
    
    body=request.get_json()
    carta = Deck(**body)
    db.session.add(carta) 
    db.session.commit()
     
    response_body = {
        "msg": "Se creo el Deck",
        "carta":carta.serialize()
          }

    return jsonify(response_body), 200

#SINGLE
@app.route('/single', methods=['GET'])
def get_single():
    all_single = Single.query.all()
    results =list(map(lambda single:single.serialize(),all_single ))
  
    return jsonify(results), 200

@app.route('/single/<int:single_id>', methods=['GET'])
def get_single_dos(single_id):
    single= db.session.get(Single, single_id)

    return jsonify(single.serialize()), 200

@app.route('/single/<int:single_id>', methods=['DELETE'])
def delete_single(single_id):
    single= db.session.get(Single, single_id)

    response_body = {
        "msg": 'Se elimino Single' +  single.nombre
    }
    db.session.delete(single)
    db.session.commit() 

    return jsonify(response_body), 200

@app.route('/single', methods=['POST'])
def add_single():

    print(request)
    print(request.get_json())
    print(request.get_json()['nombre'])
    
    body=request.get_json()
    carta = Single(**body)
    db.session.add(carta) 
    db.session.commit()
     
    response_body = {
        "msg": "Se creo el Single",
        "carta":carta.serialize()
          }

    return jsonify(response_body), 200


#BOOSTERPACK
@app.route('/boosterpack', methods=['GET'])
def get_boosterpack():
    all_boosterpack = BoosterPack.query.all()
    results =list(map(lambda boosterpack:boosterpack.serialize(),all_boosterpack ))
  
    return jsonify(results), 200


@app.route('/boosterpack/<int:boosterpack_id>', methods=['GET'])
def get_boosterpack_dos(boosterpack_id):
    boosterpack= db.session.get(BoosterPack, boosterpack_id)

    return jsonify(boosterpack.serialize()), 200

@app.route('/boosterpack/<int:boosterpack_id>', methods=['DELETE'])
def delete_boosterpack(boosterpack_id):
    boosterpack= db.session.get(BoosterPack, boosterpack_id)

    response_body = {
        "msg": 'Se elimino Booster Pack' +  boosterpack.nombre
    }
    db.session.delete(boosterpack)
    db.session.commit() 

    return jsonify(response_body), 200

@app.route('/boosterpack', methods=['POST'])
def add_boosterpack():

    print(request)
    print(request.get_json())
    print(request.get_json()['nombre'])
    
    body=request.get_json()
    carta = BoosterPack(**body)
    db.session.add(carta) 
    db.session.commit()
     
    response_body = {
        "msg": "Se creo el BoosterPack",
        "carta":carta.serialize()
          }

    return jsonify(response_body), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
