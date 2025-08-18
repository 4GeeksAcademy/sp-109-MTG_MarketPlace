import os
import jwt
import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename

from api.models import db, Comprador
from api.auth_utils import comprador_required  # Asegúrate de crear este decorador

auth_comprador = Blueprint("auth_comprador", __name__)

# Configuración de directorios (misma estructura que vendedores)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
AVATARS_DIR = os.path.join(STATIC_DIR, "avatars")
os.makedirs(AVATARS_DIR, exist_ok=True)

ALLOWED_EXTS = {"png", "jpg", "jpeg", "gif", "webp"}

# ---------------------------
# LOGIN
# ---------------------------
@auth_comprador.route("/comprador/login", methods=["POST"])
def login_comprador():
    data = request.get_json() or {}
    correo = data.get("correo")
    password = data.get("password")

    if not correo or not password:
        return jsonify({"msg": "Correo y contraseña requeridos"}), 400

    comprador = Comprador.query.filter_by(correo=correo).first()
    if not comprador or not check_password_hash(comprador.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    payload = {
        "comprador_id": comprador.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=3),
    }
    secret = os.getenv("SECRET_KEY", "clave_super_secreta_cambiala")
    token = jwt.encode(payload, secret, algorithm="HS256")

    return jsonify({
        "token": token,
        "username": comprador.username,
        "id": comprador.id,
        "comprador_id": comprador.id,
        "msg": "Login exitoso",
    }), 200

# ---------------------------
# PERFIL - Obtener
# ---------------------------
@auth_comprador.route("/comprador/perfil", methods=["GET"])
@comprador_required
def get_perfil(comprador_id):
    comp = db.session.get(Comprador, comprador_id)
    if not comp:
        return jsonify({"msg": "Comprador no encontrado"}), 404

    return jsonify({
        "username": comp.username,
        "correo": comp.correo,
        "direccion": comp.direccion,  # Nuevo campo específico
        "telefono": comp.telefono,    # Nuevo campo opcional
        "imagen_url": comp.imagen_url,
    }), 200

# ---------------------------
# PERFIL - Actualizar datos
# ---------------------------
@auth_comprador.route("/comprador/perfil", methods=["PUT"])
@comprador_required
def update_perfil(comprador_id):
    comp = db.session.get(Comprador, comprador_id)
    if not comp:
        return jsonify({"msg": "Comprador no encontrado"}), 404

    data = request.get_json() or {}
    if "username" in data and data["username"]:
        comp.username = data["username"]
    if "direccion" in data:  # Nuevo campo obligatorio
        comp.direccion = data["direccion"]
    if "telefono" in data:   # Nuevo campo opcional
        comp.telefono = data["telefono"]

    db.session.commit()

    return jsonify({
        "username": comp.username,
        "correo": comp.correo,
        "direccion": comp.direccion,
        "telefono": comp.telefono,
        "imagen_url": comp.imagen_url,
    }), 200

# ---------------------------
# PERFIL - Subir imagen
# ---------------------------
@auth_comprador.route("/comprador/perfil/imagen", methods=["POST"])
@comprador_required
def upload_imagen(comprador_id):
    if "imagen" not in request.files:
        return jsonify({"msg": "Falta el archivo 'imagen'"}), 400

    file = request.files["imagen"]
    if not file or file.filename == "":
        return jsonify({"msg": "Archivo vacío"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTS:
        return jsonify({"msg": "Formato no permitido"}), 400

    filename = secure_filename(f"comprador_{comprador_id}.{ext}")
    filepath = os.path.join(AVATARS_DIR, filename)

    comp = db.session.get(Comprador, comprador_id)

    # Limpiar avatar previo si existe
    if comp and comp.imagen_url and comp.imagen_url.startswith("/static/avatars/"):
        try:
            old_abs = os.path.join(STATIC_DIR, comp.imagen_url.replace("/static/", ""))
            if os.path.isfile(old_abs) and os.path.abspath(old_abs) != os.path.abspath(filepath):
                os.remove(old_abs)
        except Exception:
            pass

    file.save(filepath)

    public_url = f"/static/avatars/{filename}"
    if comp:
        comp.imagen_url = public_url
        db.session.commit()

    return jsonify({"imagen_url": public_url}), 200