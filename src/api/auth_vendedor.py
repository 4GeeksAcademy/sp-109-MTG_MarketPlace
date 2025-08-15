import os
import jwt
import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename

from api.models import db, Vendedor
from api.auth_utils import vendedor_required  # tu decorador ya existente

auth_vendedor = Blueprint("auth_vendedor", __name__)

# Carpeta pública para avatares (ya la sirve app.py con /static/<path>)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
AVATARS_DIR = os.path.join(STATIC_DIR, "avatars")
os.makedirs(AVATARS_DIR, exist_ok=True)  # idempotente

ALLOWED_EXTS = {"png", "jpg", "jpeg", "gif", "webp"}


# ---------------------------
# LOGIN (MISMO TOKEN DE SIEMPRE)
# ---------------------------
@auth_vendedor.route("/vendedor/login", methods=["POST"])
def login_vendedor():
    data = request.get_json() or {}
    correo = data.get("correo")
    password = data.get("password")

    if not correo or not password:
        return jsonify({"msg": "Correo y contraseña requeridos"}), 400

    vendedor = Vendedor.query.filter_by(correo=correo).first()
    if not vendedor or not check_password_hash(vendedor.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    payload = {
        "vendedor_id": vendedor.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=3),
    }
    secret = os.getenv("SECRET_KEY", "clave_super_secreta_cambiala")
    token = jwt.encode(payload, secret, algorithm="HS256")

    return jsonify({
        "token": token,
        "username": vendedor.username,
        "id": vendedor.id,
        "vendedor_id": vendedor.id,
        "msg": "Login exitoso",
    }), 200


# ---------------------------
# PERFIL - Obtener
# ---------------------------
@auth_vendedor.route("/vendedor/perfil", methods=["GET"])
@vendedor_required
def get_perfil(vendedor_id):
    ven = db.session.get(Vendedor, vendedor_id)
    if not ven:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    return jsonify({
        "username": ven.username,
        "correo": ven.correo,
        "descripcion": ven.descripcion,
        "imagen_url": ven.imagen_url,  # ej: /static/avatars/vendedor_1.png
    }), 200


# ---------------------------
# PERFIL - Actualizar texto
# ---------------------------
@auth_vendedor.route("/vendedor/perfil", methods=["PUT"])
@vendedor_required
def update_perfil(vendedor_id):
    ven = db.session.get(Vendedor, vendedor_id)
    if not ven:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    data = request.get_json() or {}
    if "username" in data and data["username"]:
        ven.username = data["username"]
    if "descripcion" in data:
        ven.descripcion = data["descripcion"]

    db.session.commit()

    return jsonify({
        "username": ven.username,
        "correo": ven.correo,
        "descripcion": ven.descripcion,
        "imagen_url": ven.imagen_url,
    }), 200


# ---------------------------
# PERFIL - Subir imagen
# ---------------------------
@auth_vendedor.route("/vendedor/perfil/imagen", methods=["POST"])
@vendedor_required
def upload_imagen(vendedor_id):
    if "imagen" not in request.files:
        return jsonify({"msg": "Falta el archivo 'imagen'"}), 400

    file = request.files["imagen"]
    if not file or file.filename == "":
        return jsonify({"msg": "Archivo vacío"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTS:
        return jsonify({"msg": "Formato no permitido"}), 400

    filename = secure_filename(f"vendedor_{vendedor_id}.{ext}")
    filepath = os.path.join(AVATARS_DIR, filename)

    ven = db.session.get(Vendedor, vendedor_id)

    # opcional: limpia un avatar local previo si cambia la extensión
    if ven and ven.imagen_url and ven.imagen_url.startswith("/static/avatars/"):
        try:
            old_abs = os.path.join(STATIC_DIR, ven.imagen_url.replace("/static/", ""))
            if os.path.isfile(old_abs) and os.path.abspath(old_abs) != os.path.abspath(filepath):
                os.remove(old_abs)
        except Exception:
            pass

    file.save(filepath)

    public_url = f"/static/avatars/{filename}"
    if ven:
        ven.imagen_url = public_url
        db.session.commit()

    return jsonify({"imagen_url": public_url}), 200