"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Deck, Single, BoosterPack
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "En funcionamiento"
    }

    return jsonify(response_body), 200

#DECK
@api.route('/deck', methods=['GET'])
def get_decks():
    all_decks = Deck.query.all()
    results =list(map(lambda deck:deck.serialize(),all_decks ))
  
    return jsonify(results), 200

@api.route('/deck/<int:deck_id>', methods=['GET'])
def get_deck_dos(deck_id):
    deck= db.session.get(Deck, deck_id)

    return jsonify(deck.serialize()), 200

@api.route('/deck/<int:deck_id>', methods=['DELETE'])
def delete_deck(deck_id):
    deck= db.session.get(Deck, deck_id)

    response_body = {
        "msg": 'Se elimino Deck' +  deck.nombre
    }
    db.session.delete(deck)
    db.session.commit() 

    return jsonify(response_body), 200


@api.route('/deck', methods=['POST'])
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
@api.route('/single', methods=['GET'])
def get_single():
    all_single = Single.query.all()
    results =list(map(lambda single:single.serialize(),all_single ))
  
    return jsonify(results), 200

@api.route('/single/<int:single_id>', methods=['GET'])
def get_single_dos(single_id):
    single= db.session.get(Single, single_id)

    return jsonify(single.serialize()), 200

@api.route('/single/<int:single_id>', methods=['DELETE'])
def delete_single(single_id):
    single= db.session.get(Single, single_id)

    response_body = {
        "msg": 'Se elimino Single' +  single.nombre
    }
    db.session.delete(single)
    db.session.commit() 

    return jsonify(response_body), 200

@api.route('/single', methods=['POST'])
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
@api.route('/boosterpacks', methods=['GET'])
def get_boosterpacks():
    all_boosterpacks = BoosterPack.query.all()
    results =list(map(lambda boosterpack:boosterpack.serialize(),all_boosterpacks ))
  
    return jsonify(results), 200


@api.route('/boosterpacks/<int:boosterpack_id>', methods=['GET'])
def get_boosterpack_dos(boosterpack_id):
    boosterpack= db.session.get(BoosterPack, boosterpack_id)

    return jsonify(boosterpack.serialize()), 200

@api.route('/boosterpacks/<int:boosterpack_id>', methods=['DELETE'])
def delete_boosterpack(boosterpack_id):
    boosterpack= db.session.get(BoosterPack, boosterpack_id)

    response_body = {
        "msg": 'Se elimino Booster Pack' +  boosterpack.nombre
    }
    db.session.delete(boosterpack)
    db.session.commit() 

    return jsonify(response_body), 200

@api.route('/boosterpacks', methods=['POST'])
def add_boosterpacks():

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

# #CATEGORIAS

@api.route('/categorias', methods=['GET'])
def get_all_categorias():
    
    all_decks = Deck.query.all()
    all_singles = Single.query.all()
    all_boosterpack = BoosterPack.query.all()

    
    decks_serialized = [deck.serialize() for deck in all_decks]
    singles_serialized = [single.serialize() for single in all_singles]
    boosterpack_serialized = [boosterpack.serialize() for boosterpack in all_boosterpack]

    
    response = {
        "decks": decks_serialized,
        "singles": singles_serialized,
        "boosterPacks": boosterpack_serialized
    }

    return jsonify(response), 200


