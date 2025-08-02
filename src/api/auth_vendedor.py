from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from api.models import Vendedor
import jwt, datetime
import os

auth_vendedor = Blueprint('auth_vendedor', __name__)

@auth_vendedor.route('/vendedor/login', methods=['POST'])
def login_vendedor():
    data = request.get_json()
    if not data or not data.get("correo") or not data.get("password"):
        return jsonify({"msg": "Correo y contraseña requeridos"}), 400

    vendedor = Vendedor.query.filter_by(correo=data["correo"]).first()

    if not vendedor or not check_password_hash(vendedor.password, data["password"]):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    payload = {
        "vendedor_id": vendedor.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=3)
    }

    token = jwt.encode(payload, os.getenv("SECRET_KEY", "clave_super_secreta_cambiala"), algorithm="HS256")

    return jsonify({
        "token": token,
        "username": vendedor.username,
        "msg": "Login exitoso"
    }), 200