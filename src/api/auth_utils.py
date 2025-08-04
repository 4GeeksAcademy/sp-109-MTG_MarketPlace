from flask import request, jsonify
import jwt
import os
from functools import wraps

def obtener_vendedor_id_desde_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise Exception("Token faltante o mal formado")

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            os.getenv("SECRET_KEY", "clave_super_secreta_cambiala"),
            algorithms=["HS256"]
        )
        return payload.get("vendedor_id")
    except jwt.ExpiredSignatureError:
        raise Exception("Token expirado")
    except jwt.InvalidTokenError:
        raise Exception("Token inválido")

def vendedor_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            vendedor_id = obtener_vendedor_id_desde_token()
        except Exception as e:
            return jsonify({"msg": str(e)}), 401

        return f(vendedor_id=vendedor_id, *args, **kwargs)

    return decorated_function