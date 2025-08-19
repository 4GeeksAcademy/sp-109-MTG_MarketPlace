import jwt
from flask import request, jsonify
from functools import wraps
from datetime import datetime
import os

SECRET_KEY = os.getenv("SECRET_KEY", "clave_super_secreta_cambiala")

def token_required_vendedor(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Obtener el token del header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'msg': 'Token no proporcionado'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if data.get("tipo") != "vendedor":
                return jsonify({'msg': 'Token inválido para este recurso'}), 403
            request.vendedor_id = data["id"]  
        except jwt.ExpiredSignatureError:
            return jsonify({'msg': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'msg': 'Token inválido'}), 401

        return f(*args, **kwargs)
    return decorated


def comprador_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"msg": "Token requerido"}), 401

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )
            comprador_id = payload.get("comprador_id")
            if not comprador_id:
                return jsonify({"msg": "Token inválido (falta comprador_id)"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"msg": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"msg": "Token inválido"}), 401

        # Pasamos el comprador_id a la función
        return f(comprador_id=comprador_id, *args, **kwargs)

    return decorated_function