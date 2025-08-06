import jwt
from flask import request, jsonify
from functools import wraps
import os

SECRET_KEY = os.getenv("SECRET_KEY", "clave_super_secreta_cambiala")

def token_required_comprador(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        if not token:
            return jsonify({'msg': 'Token no proporcionado'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if data.get("tipo") != "comprador":
                return jsonify({'msg': 'Token inválido para este recurso'}), 403
            request.comprador_id = data["id"]
        except jwt.ExpiredSignatureError:
            return jsonify({'msg': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'msg': 'Token inválido'}), 401

        return f(*args, **kwargs)
    return decorated
