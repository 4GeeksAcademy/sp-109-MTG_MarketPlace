from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Vendedor, Comprador
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

# === ENDPOINTS ===

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# === API VENDEDORES ===

@api.route('/vendedores', methods=['GET'])
def get_all_vendedores():
    vendedores = Vendedor.query.all()
    return jsonify([v.serialize() for v in vendedores]), 200

@api.route('/vendedores/<int:id>', methods=['GET'])
def get_vendedor(id):
    vendedor = Vendedor.query.get(id)
    if not vendedor:
        return jsonify({"msg": "Vendedor no encontrado"}), 404
    return jsonify(vendedor.serialize()), 200

@api.route('/vendedores', methods=['POST'])
def create_vendedor():
    body = request.get_json()
    required_fields = ["username", "correo", "password"]
    if not all(field in body for field in required_fields):
        return jsonify({"msg": "Faltan datos"}), 400

    # Verificar si el correo o username ya existen
    if Vendedor.query.filter_by(username=body["username"]).first():
        return jsonify({"msg": "Nombre de usuario ya en uso"}), 400
    if Vendedor.query.filter_by(correo=body["correo"]).first():
        return jsonify({"msg": "Correo ya registrado"}), 400

    vendedor = Vendedor(
        username=body["username"],
        correo=body["correo"],
        password=body["password"]
    )
    db.session.add(vendedor)
    db.session.commit()
    return jsonify(vendedor.serialize()), 201

@api.route('/vendedores/<int:id>', methods=['PUT'])
def update_vendedor(id):
    vendedor = Vendedor.query.get(id)
    if not vendedor:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    body = request.get_json()

    # Verificar duplicado en username o correo de OTROS vendedores
    if "username" in body:
        existing_user = Vendedor.query.filter_by(username=body["username"]).first()
        if existing_user and existing_user.id != id:
            return jsonify({"msg": "Nombre de usuario ya en uso"}), 400

    if "correo" in body:
        existing_email = Vendedor.query.filter_by(correo=body["correo"]).first()
        if existing_email and existing_email.id != id:
            return jsonify({"msg": "Correo ya registrado"}), 400

    vendedor.username = body.get("username", vendedor.username)
    vendedor.correo = body.get("correo", vendedor.correo)

   
    new_password = body.get("password")
    if new_password:
        vendedor.password = new_password

    db.session.commit()
    return jsonify(vendedor.serialize()), 200

@api.route('/vendedores/<int:id>', methods=['DELETE'])
def delete_vendedor(id):
    vendedor = Vendedor.query.get(id)
    if not vendedor:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    db.session.delete(vendedor)
    db.session.commit()
    return jsonify({"msg": "Vendedor eliminado"}), 200


# === API COMPRADORES ===
@api.route('/compradores', methods=['GET'])
def get_all_compradores():
    compradores = Comprador.query.all()
    return jsonify([c.serialize() for c in compradores]), 200

@api.route('/compradores/<int:id>', methods=['GET'])
def get_comprador(id):
    comprador = Comprador.query.get(id)
    if not comprador:
        return jsonify({"msg": "Comprador no encontrado"}), 404
    return jsonify(comprador.serialize()), 200

@api.route('/compradores', methods=['POST'])
def create_comprador():
    body = request.get_json()
    required_fields = ["username", "correo"]
    if not all(field in body for field in required_fields):
        return jsonify({"msg": "Faltan datos"}), 400

    if Comprador.query.filter_by(username=body["username"]).first():
        return jsonify({"msg": "Nombre de usuario ya en uso"}), 400
    if Comprador.query.filter_by(correo=body["correo"]).first():
        return jsonify({"msg": "Correo ya registrado"}), 400

    comprador = Comprador(
        username=body["username"],
        correo=body["correo"]
    )
    db.session.add(comprador)
    db.session.commit()
    return jsonify(comprador.serialize()), 201

@api.route('/compradores/<int:id>', methods=['PUT'])
def update_comprador(id):
    comprador = Comprador.query.get(id)
    if not comprador:
        return jsonify({"msg": "Comprador no encontrado"}), 404

    body = request.get_json()

    if "username" in body:
        existing_user = Comprador.query.filter_by(username=body["username"]).first()
        if existing_user and existing_user.id != id:
            return jsonify({"msg": "Nombre de usuario ya en uso"}), 400

    if "correo" in body:
        existing_email = Comprador.query.filter_by(correo=body["correo"]).first()
        if existing_email and existing_email.id != id:
            return jsonify({"msg": "Correo ya registrado"}), 400

    comprador.username = body.get("username", comprador.username)
    comprador.correo = body.get("correo", comprador.correo)

    db.session.commit()
    return jsonify(comprador.serialize()), 200

@api.route('/compradores/<int:id>', methods=['DELETE'])
def delete_comprador(id):
    comprador = Comprador.query.get(id)
    if not comprador:
        return jsonify({"msg": "Comprador no encontrado"}), 404

    db.session.delete(comprador)
    db.session.commit()
    return jsonify({"msg": "Comprador eliminado"}), 200
