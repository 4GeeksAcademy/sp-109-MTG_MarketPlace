from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from api.models import Comprador
import jwt, datetime
import os

auth_comprador = Blueprint('auth_comprador', __name__)

@auth_comprador.route('/comprador/login', methods=['POST'])
def login_comprador():
    data = request.get_json()
    if not data or not data.get("correo") or not data.get("password"):
        return jsonify({"msg": "Correo y contraseña requeridos"}), 400

    comprador = Comprador.query.filter_by(correo=data["correo"]).first()

    if not comprador or not check_password_hash(comprador.password, data["password"]):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    payload = {
        "id": comprador.id,
        "tipo": "comprador",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=3)
    }

    token = jwt.encode(payload, os.getenv("SECRET_KEY", "clave_super_secreta_cambiala"), algorithm="HS256")

    return jsonify({
        "token": token,
        "username": comprador.username,
        "msg": "Login exitoso"
    }), 200
