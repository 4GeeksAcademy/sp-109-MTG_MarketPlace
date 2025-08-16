from uuid import uuid4
from datetime import datetime
from api.auth_utils import vendedor_required
from api.auth_utils import obtener_vendedor_id_desde_token
from sqlalchemy import func
from functools import wraps
from flask import request, jsonify, Flask, url_for, Blueprint, current_app
from api.models import db, User, Vendedor, Producto, Comprador, Carrito, ItemCarrito, Categorias, ProductoCategoria, UserAdmin
from api.utils import generate_sitemap, APIException
import datetime
import jwt
import os
from flask import current_app as app
from api.jwt_utils import token_required_vendedor
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename


from sqlalchemy.orm import joinedload
from api.admin import setup_admin


app = Flask(__name__)
setup_admin(app)


api = Blueprint('api', __name__)

# CORS(api)


# === GENERAL ===

@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    return jsonify({"message": "En funcionamiento"}), 200


# === API PRODUCTOS ===

@api.route('/productos', methods=['GET'])
def get_productos():
    productos = Producto.query.all()
    return jsonify([p.serialize() for p in productos]), 200


@api.route('/productos/<int:id>', methods=['GET'])
def get_producto(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({"msg": "Producto no encontrado"}), 404
    return jsonify(producto.serialize()), 200


@api.route('/productos', methods=['POST'])
def crear_producto():
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"msg": "Token requerido"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, os.getenv(
            "SECRET_KEY", "clave_super_secreta_cambiala"), algorithms=["HS256"])
        vendedor_id = payload.get("vendedor_id")
    except jwt.ExpiredSignatureError:
        return jsonify({"msg": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"msg": "Token inválido"}), 401

    data = request.get_json()

    if not all(field in data for field in ("nombre", "precio", "rarity", "type")):
        return jsonify({"msg": "Faltan campos requeridos"}), 400

    producto = Producto(
        nombre=data["nombre"],
        descripcion=data.get("descripcion", ""),
        precio=data["precio"],
        rarity=data["rarity"],
        type=data["type"], 
        imageUrl=data.get("imageUrl", ""), 
        vendedor_id=vendedor_id
    )

    db.session.add(producto)
    db.session.commit()

    return jsonify(producto.serialize()), 201


@api.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({"msg": "Producto no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Body vacío"}), 400

    producto.nombre = data.get("nombre", producto.nombre)
    producto.descripcion = data.get("descripcion", producto.descripcion)
    producto.precio = data.get("precio", producto.precio)

    if "vendedor_id" in data:
        if not Vendedor.query.get(data["vendedor_id"]):
            return jsonify({"msg": "Nuevo vendedor no existe"}), 400
        producto.vendedor_id = data["vendedor_id"]

    db.session.commit()
    return jsonify(producto.serialize()), 200


@api.route('/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({"msg": "Producto no encontrado"}), 404
    db.session.delete(producto)
    db.session.commit()
    return jsonify({"msg": "Producto eliminado"}), 200


# === API VENDEDORES ===

@api.route('/vendedores', methods=['GET'])
def get_all_vendedores():
    return jsonify([v.serialize() for v in Vendedor.query.all()]), 200


@api.route('/vendedores/<int:id>', methods=['GET'])
def get_vendedor(id):
    vendedor = Vendedor.query.get(id)
    if not vendedor:
        return jsonify({"msg": "Vendedor no encontrado"}), 404
    return jsonify(vendedor.serialize()), 200


@api.route('/vendedores', methods=['POST'])
def create_vendedor():
    try:
        body = request.get_json()
        print("📩 Body recibido:", body)

        if not body:
            return jsonify({"msg": "Body vacío"}), 400

        if not all(field in body for field in ("username", "correo", "password")):
            return jsonify({"msg": "Faltan datos"}), 400

        if Vendedor.query.filter_by(username=body["username"]).first():
            return jsonify({"msg": "Nombre de usuario ya en uso"}), 400
        if Vendedor.query.filter_by(correo=body["correo"]).first():
            return jsonify({"msg": "Correo ya registrado"}), 400

        hashed_password = generate_password_hash(body["password"])
        print("🔐 Hashed password:", hashed_password)

        vendedor = Vendedor(
            username=body["username"],
            correo=body["correo"],
            password=hashed_password
        )

        db.session.add(vendedor)
        db.session.commit()

        print("✅ Vendedor creado:", vendedor.serialize())

        return jsonify(vendedor.serialize()), 201

    except Exception as e:
        print("❌ Error en registro de vendedor:", e)
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route('/vendedores/<int:id>', methods=['PUT'])
def update_vendedor(id):
    vendedor = Vendedor.query.get(id)
    if not vendedor:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    body = request.get_json()
    if not body:
        return jsonify({"msg": "Body vacío"}), 400

    if "username" in body:
        existing_user = Vendedor.query.filter_by(
            username=body["username"]).first()
        if existing_user and existing_user.id != id:
            return jsonify({"msg": "Nombre de usuario ya en uso"}), 400

    if "correo" in body:
        existing_email = Vendedor.query.filter_by(
            correo=body["correo"]).first()
        if existing_email and existing_email.id != id:
            return jsonify({"msg": "Correo ya registrado"}), 400

    vendedor.username = body.get("username", vendedor.username)
    vendedor.correo = body.get("correo", vendedor.correo)

    # Si se envía una nueva contraseña, se hashea
    if "password" in body and body["password"]:
        vendedor.password = generate_password_hash(body["password"])

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
    return jsonify([c.serialize() for c in Comprador.query.all()]), 200


@api.route('/compradores/<int:id>', methods=['GET'])
def get_comprador(id):
    comprador = Comprador.query.get(id)
    if not comprador:
        return jsonify({"msg": "Comprador no encontrado"}), 404
    return jsonify(comprador.serialize()), 200


@api.route('/compradores', methods=['POST'])
def create_comprador():
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Body vacío"}), 400

    if not all(field in body for field in ("username", "correo")):
        return jsonify({"msg": "Faltan datos"}), 400

    if Comprador.query.filter_by(username=body["username"]).first():
        return jsonify({"msg": "Nombre de usuario ya en uso"}), 400
    if Comprador.query.filter_by(correo=body["correo"]).first():
        return jsonify({"msg": "Correo ya registrado"}), 400

    comprador = Comprador(**body)
    db.session.add(comprador)
    db.session.commit()
    return jsonify(comprador.serialize()), 201


@api.route('/compradores/<int:id>', methods=['PUT'])
def update_comprador(id):
    comprador = Comprador.query.get(id)
    if not comprador:
        return jsonify({"msg": "Comprador no encontrado"}), 404

    body = request.get_json()
    if not body:
        return jsonify({"msg": "Body vacío"}), 400

    if "username" in body:
        existing_user = Comprador.query.filter_by(
            username=body["username"]).first()
        if existing_user and existing_user.id != id:
            return jsonify({"msg": "Nombre de usuario ya en uso"}), 400

    if "correo" in body:
        existing_email = Comprador.query.filter_by(
            correo=body["correo"]).first()
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


# === API CATEGORIAS ===

@api.route('/categorias', methods=['GET'])
def get_categorias():
    all_categorias = Categorias.query.all()
    results = list(
        map(lambda categorias: categorias.serialize(), all_categorias))

    return jsonify(results), 200


@api.route('/categorias/<int:id>', methods=['GET'])
def get_categoria(id):
    categoria = Categorias.query.get(id)
    if not categoria:
        return jsonify({"msg": "Categoria no encontrado"}), 404
    return jsonify(categoria.serialize()), 200


@api.route('/categorias', methods=['POST'])
def create_categoria():
    body = request.get_json()
    required_fields = ["name", ]
    if not all(field in body for field in required_fields):
        return jsonify({"msg": "Se necesita un nombre para la categoria"}), 400

    if Categorias.query.filter_by(name=body["name"]).first():
        return jsonify({"msg": "El nombre de la categoria ya existe"}), 400

    categoria = Categorias(
        name=body["name"],

    )
    db.session.add(categoria)
    db.session.commit()
    return jsonify(categoria.serialize()), 201


@api.route('/categorias/<int:id>', methods=['PUT'])
def update_categoria(id):
    categoria = Categorias.query.get(id)
    if not categoria:
        return jsonify({"msg": "Categoria no encontrado"}), 404

    body = request.get_json()

    if "name" in body:
        existing_name = Categorias.query.filter_by(name=body["name"]).first()
        if existing_name and existing_name.id != id:
            return jsonify({"msg": "El nombre de la categoria ya se esta utilizando"}), 400

    categoria.name = body.get("name", categoria.name)

    db.session.commit()
    return jsonify(categoria.serialize()), 200


@api.route('/categorias/<int:id>', methods=['DELETE'])
def delete_categoria(id):
    categoria = Categorias.query.get(id)
    if not categoria:
        return jsonify({"msg": "Categoria no encontrado"}), 404

    db.session.delete(categoria)
    db.session.commit()
    return jsonify({"msg": "La categoria fue eliminada"}), 200


# === API CARRITO ===

@api.route('/carritos', methods=['GET'])
def get_all_carritos():
    carritos = Carrito.query.all()
    return jsonify([c.serialize() for c in carritos]), 200


@api.route('/carritos/<int:id>', methods=['GET'])
def get_carrito(id):
    carrito = Carrito.query.get(id)
    if not carrito:
        return jsonify({"msg": "Carrito no encontrado"}), 404
    return jsonify(carrito.serialize()), 200


@api.route('/carritos', methods=['POST'])
def create_carrito():
    body = request.get_json()
    if not body or not all(k in body for k in ("id_comprador", "status")):
        return jsonify({"msg": "Faltan datos"}), 400

    if not Comprador.query.get(body["id_comprador"]):
        return jsonify({"msg": "Comprador no válido"}), 400

    carrito = Carrito(id_comprador=body["id_comprador"], status=body["status"])
    db.session.add(carrito)
    db.session.commit()
    return jsonify(carrito.serialize()), 201


@api.route('/carritos/<int:id>', methods=['PUT'])
def update_carrito(id):
    carrito = Carrito.query.get(id)
    if not carrito:
        return jsonify({"msg": "Carrito no encontrado"}), 404

    data = request.get_json()
    if "id_comprador" in data and not Comprador.query.get(data["id_comprador"]):
        return jsonify({"msg": "Comprador no válido"}), 400

    carrito.id_comprador = data.get("id_comprador", carrito.id_comprador)
    carrito.status = data.get("status", carrito.status)

    db.session.commit()
    return jsonify(carrito.serialize()), 200


@api.route('/carritos/<int:id>', methods=['DELETE'])
def delete_carrito(id):
    carrito = Carrito.query.get(id)
    if not carrito:
        return jsonify({"msg": "Carrito no encontrado"}), 404

    db.session.delete(carrito)
    db.session.commit()
    return jsonify({"msg": "Carrito eliminado"}), 200

# === API ITEM_CARRITO ===


@api.route('/itemcarrito', methods=['GET'])
def get_all_items():
    items = ItemCarrito.query.all()
    return jsonify([item.serialize() for item in items]), 200


@api.route('/itemcarrito/<int:id>', methods=['GET'])
def get_item(id):
    item = ItemCarrito.query.get(id)
    if not item:
        return jsonify({"msg": "Ítem no encontrado"}), 404
    return jsonify(item.serialize()), 200


@api.route('/itemcarrito', methods=['POST'])
def create_item():
    body = request.get_json()
    required_fields = ("cantidad", "producto_id", "carrito_id")

    if not all(k in body for k in required_fields):
        return jsonify({"msg": "Faltan datos"}), 400

    if not Producto.query.get(body["producto_id"]):
        return jsonify({"msg": "Producto no válido"}), 400

    if not Carrito.query.get(body["carrito_id"]):
        return jsonify({"msg": "Carrito no válido"}), 400

    try:
        new_item = ItemCarrito(
            cantidad=body["cantidad"],
            producto_id=body["producto_id"],
            carrito_id=body["carrito_id"]
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear ítem", "error": str(e)}), 500


@api.route('/itemcarrito/<int:id>', methods=['PUT'])
def update_item(id):
    item = ItemCarrito.query.get(id)
    if not item:
        return jsonify({"msg": "Ítem no encontrado"}), 404

    body = request.get_json()

    if "producto_id" in body and not Producto.query.get(body["producto_id"]):
        return jsonify({"msg": "Producto no válido"}), 400

    if "carrito_id" in body and not Carrito.query.get(body["carrito_id"]):
        return jsonify({"msg": "Carrito no válido"}), 400

    try:
        item.cantidad = body.get("cantidad", item.cantidad)
        item.producto_id = body.get("producto_id", item.producto_id)
        item.carrito_id = body.get("carrito_id", item.carrito_id)

        db.session.commit()
        return jsonify(item.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar ítem", "error": str(e)}), 500


@api.route('/itemcarrito/<int:id>', methods=['DELETE'])
def delete_item(id):
    item = ItemCarrito.query.get(id)
    if not item:
        return jsonify({"msg": "Ítem no encontrado"}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"msg": "Ítem eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar ítem", "error": str(e)}), 500


# === API CATEGORIA-PRODUCTO ===

@api.route('/producto-categoria', methods=['GET'])
def get_all_producto_categoria():
    relaciones = ProductoCategoria.query.all()
    return jsonify([r.serialize() for r in relaciones]), 200


@api.route('/producto-categoria/<int:id>', methods=['GET'])
def get_producto_categoria(id):
    pc = ProductoCategoria.query.get(id)
    if not pc:
        return jsonify({"error": "No encontrado"}), 404
    return jsonify(pc.serialize()), 200


@api.route('/producto-categoria', methods=['POST'])
def create_producto_categoria():
    data = request.get_json()
    producto_id = data.get("producto_id")
    categoria_id = data.get("categoria_id")

    if not producto_id or not categoria_id:
        return jsonify({"msg": "Producto_id y Categoria_id son requeridos"}), 400

    producto = Producto.query.get(producto_id)
    categoria = Categorias.query.get(categoria_id)

    if not producto or not categoria:
        return jsonify({"msg": "Producto o Categoría no encontrados"}), 404

    existe = ProductoCategoria.query.filter_by(
        producto_id=producto_id, categoria_id=categoria_id).first()
    if existe:
        return jsonify({"msg": "Esta relación ya existe"}), 400

    nuevo_enlace = ProductoCategoria(
        producto_id=producto_id, categoria_id=categoria_id)
    db.session.add(nuevo_enlace)
    db.session.commit()

    return jsonify(nuevo_enlace.serialize()), 201


@api.route('/producto-categoria/<int:id>', methods=['DELETE'])
def delete_producto_categoria(id):
    enlace = ProductoCategoria.query.get(id)
    if not enlace:
        return jsonify({"msg": "No se encontró el enlace"}), 404

    db.session.delete(enlace)
    db.session.commit()
    return jsonify({"msg": "Enlace eliminado"}), 200


@api.route('/producto-categoria/<int:id>', methods=['PUT'])
def update_producto_categoria(id):
    enlace = ProductoCategoria.query.get(id)
    if not enlace:
        return jsonify({"msg": "Enlace no encontrado"}), 404

    data = request.get_json()
    producto_id = data.get("producto_id")
    categoria_id = data.get("categoria_id")

    if not producto_id or not categoria_id:
        return jsonify({"msg": "Producto_id y Categoria_id son requeridos"}), 400

    producto = Producto.query.get(producto_id)
    categoria = Categorias.query.get(categoria_id)

    if not producto or not categoria:
        return jsonify({"msg": "Producto o Categoría no encontrados"}), 404

    # Evita duplicados
    existe = ProductoCategoria.query.filter_by(
        producto_id=producto_id,
        categoria_id=categoria_id
    ).first()
    if existe and existe.id != id:
        return jsonify({"msg": "Esta relación ya existe"}), 400

    enlace.producto_id = producto_id
    enlace.categoria_id = categoria_id
    db.session.commit()

    return jsonify(enlace.serialize()), 200


@api.route('/producto-categoria/opciones', methods=['GET'])
def get_producto_categoria_opciones():
    productos = Producto.query.all()
    categorias = Categorias.query.all()

    return jsonify({
        "productos": [p.serialize() for p in productos],
        "categorias": [c.serialize() for c in categorias]
    }), 200


# === API FLUJO_VENDEDOR ===

@api.route('/vendedor/productos', methods=['GET'])
@vendedor_required
def get_mis_productos(vendedor_id):
    """
    Devuelve solo los productos del vendedor autenticado (por token).
    """
    productos = Producto.query.filter_by(vendedor_id=vendedor_id).all()
    return jsonify([p.serialize() for p in productos]), 200

@api.route('/vendedor/dashboard', methods=['GET'])
@vendedor_required
def get_vendedor_dashboard(vendedor_id):
    vendedor_id = obtener_vendedor_id_desde_token()
    if not vendedor_id:
        return jsonify({"msg": "Token inválido o faltante"}), 401

    vendedor = Vendedor.query.get(vendedor_id)
    if not vendedor:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    productos = [p.serialize() for p in vendedor.productos]
    return jsonify({
        "vendedor": vendedor.serialize(),
        "productos": productos
    }), 200


@api.route('/vendedor/reportes', methods=['GET'])
@vendedor_required
def get_reporte_ventas():

    vendedor_id = obtener_vendedor_id_desde_token()
    if not vendedor_id:
        return jsonify({"msg": "Token inválido o faltante"}), 401

    vendedor = Vendedor.query.get(vendedor_id)
    if not vendedor:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    estados_finalizados = ["generado", "enviado", "entregado", "pagado"]

    resultados = db.session.query(
        Producto.id,
        Producto.nombre,
        func.sum(ItemCarrito.cantidad).label("total_vendido"),
        Producto.precio,
        func.sum(ItemCarrito.cantidad * Producto.precio).label("ingresos")
    ).join(ItemCarrito, Producto.id == ItemCarrito.producto_id
           ).join(Carrito, ItemCarrito.carrito_id == Carrito.id
                  ).filter(
        Producto.vendedor_id == vendedor_id,
        Carrito.status.in_(estados_finalizados)
    ).group_by(Producto.id).all()

    reporte = [
        {
            "producto_id": pid,
            "nombre": nombre,
            "vendidos": int(cantidad),
            "precio_unitario": float(precio),
            "total_ingresos": float(ingresos)
        }
        for pid, nombre, cantidad, precio, ingresos in resultados
    ]

    return jsonify(reporte), 200


@api.route('/vendedor/orders', methods=['GET'])
@vendedor_required
def get_vendedor_orders(vendedor_id):
    try:
        items = db.session.query(ItemCarrito).join(Producto).filter(
            Producto.vendedor_id == vendedor_id
        ).all()

        resultado = []

        for item in items:
            resultado.append({
                "item_id": item.id,
                "cantidad": item.cantidad,
                "estado": item.status if hasattr(item, 'status') else None,
                "producto": item.producto.serialize() if item.producto else None,
                "carrito": {
                    "id": item.carrito.id if item.carrito else None,
                    "estado": item.carrito.status if item.carrito else None,
                    "comprador": item.carrito.comprador.serialize() if getattr(item.carrito, 'comprador', None) else None
                }
            })

        return jsonify(resultado), 200

    except Exception as e:
        print("❌ ERROR EN get_vendedor_orders:", repr(e))
        return jsonify({"msg": "Error al obtener órdenes", "error": str(e)}), 500


@api.route('/vendedor/itemcarrito/<int:id>/estado', methods=['PUT'])
@vendedor_required
def actualizar_estado_item(id, vendedor_id):
    item = ItemCarrito.query.get(id)
    if not item:
        return jsonify({"msg": "Ítem no encontrado"}), 404

    if item.producto.vendedor_id != vendedor_id:
        return jsonify({"msg": "No tienes permiso para modificar este ítem"}), 403

    data = request.get_json()
    nuevo_estado = data.get("estado")
    ESTADOS_VALIDOS = ["get_direction", "in_progress", "enviado", "entregado"]

    if nuevo_estado not in ESTADOS_VALIDOS:
        return jsonify({"msg": f"Estado inválido. Debe ser uno de: {ESTADOS_VALIDOS}"}), 400

    item.status = nuevo_estado
    db.session.commit()
    return jsonify(item.serialize()), 200


@api.route('/vendedor/orden/<int:item_id>/direccion', methods=['POST'])
@vendedor_required
def guardar_direccion_envio(item_id, vendedor_id):
    item = ItemCarrito.query.get(item_id)

    if not item or item.producto.vendedor_id != vendedor_id:
        return jsonify({"msg": "No autorizado"}), 403

    if item.status == "in_progress":
        return jsonify({"msg": "Esta orden ya está en proceso"}), 400

    data = request.get_json()
    direccion = data.get("direccion")
    detalle = data.get("detalle")
    latitud = data.get("latitud")
    longitud = data.get("longitud")

    if not direccion:
        return jsonify({"msg": "La dirección es obligatoria"}), 400

    try:
        item.direccion_envio = direccion
        item.detalle_envio = detalle
        item.latitud = latitud
        item.longitud = longitud
        item.status = "in_progress"

        db.session.commit()

        return jsonify({"msg": "Dirección guardada y orden marcada como en proceso"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al procesar la orden", "error": str(e)}), 500

# ====   PERFIL  ====

# --- Perfil: GET / PUT -------------------------------------------------


@api.route('/vendedor/perfil', methods=['GET'])
@vendedor_required
def vendedor_perfil_get(vendedor_id):
    ven = db.session.get(Vendedor, vendedor_id)
    if not ven:
        return jsonify({"msg": "Vendedor no encontrado"}), 404
    return jsonify({
        "id": ven.id,
        "username": ven.username,
        "correo": ven.correo,
        "descripcion": getattr(ven, "descripcion", None),
        "imagen_url": getattr(ven, "imagen_url", None),
    }), 200


@api.route('/vendedor/perfil', methods=['PUT'])
@vendedor_required
def vendedor_perfil_put(vendedor_id):
    ven = db.session.get(Vendedor, vendedor_id)
    if not ven:
        return jsonify({"msg": "Vendedor no encontrado"}), 404

    data = request.get_json(silent=True) or {}
    ven.username = data.get("username", ven.username)
    if "descripcion" in data:
        ven.descripcion = data["descripcion"]

    db.session.commit()
    return jsonify({
        "username": ven.username,
        "descripcion": ven.descripcion
    }), 200


# --- Subida de imagen ---------------------------------------------------
import os
from flask import request, jsonify
from werkzeug.utils import secure_filename  # <-- IMPORTANTE
from api.models import db, Vendedor

# carpeta para guardar avatares
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "avatars")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED = {"png", "jpg", "jpeg", "gif", "webp"}

@api.route('/vendedor/perfil/imagen', methods=['POST'])
@vendedor_required
def vendedor_perfil_imagen(vendedor_id):
    """
    Sube una imagen (campo 'imagen' en FormData) y guarda la URL pública en vendedor.imagen_url
    Respuesta: { "imagen_url": "/static/avatars/vendedor_<id>.<ext>" }
    """
    try:
        if 'imagen' not in request.files:
            return jsonify({"msg": "Falta el archivo 'imagen'"}), 400

        f = request.files['imagen']
        if not f or f.filename == '':
            return jsonify({"msg": "Archivo vacío"}), 400

        # valida extensión
        ext = f.filename.rsplit('.', 1)[-1].lower() if '.' in f.filename else ''
        if ext not in ALLOWED:
            return jsonify({"msg": "Formato no permitido"}), 400

        # nombre normalizado
        filename = secure_filename(f"vendedor_{vendedor_id}.{ext}")
        filepath = os.path.join(UPLOAD_DIR, filename)

        # guarda archivo
        f.save(filepath)

        # URL pública
        public_url = f"/static/avatars/{filename}"

        # actualiza el vendedor
        ven = db.session.get(Vendedor, vendedor_id)
        if not ven:
            return jsonify({"msg": "Vendedor no encontrado"}), 404

        # opcional: si tenías una imagen local anterior, podrías borrarla
        # (solo si empieza por /static/avatars/)
        if ven.imagen_url and ven.imagen_url.startswith("/static/avatars/"):
            try:
                old_abs = os.path.join(os.path.dirname(os.path.dirname(__file__)), ven.imagen_url.lstrip("/"))
                if os.path.isfile(old_abs) and old_abs != filepath:
                    os.remove(old_abs)
            except Exception:
                pass

        ven.imagen_url = public_url
        db.session.commit()

        return jsonify({"imagen_url": public_url}), 200

    except Exception as e:
        # Logea en consola del server para que veas el error exacto
        print("❌ Error subiendo imagen:", repr(e))
        return jsonify({"msg": "Error interno subiendo imagen"}), 500

# === API ADMINISTRADOR ===

    # ----GET-TODOS---


@api.route('/useradmin', methods=['GET'])
def get_user_admins():
    useradmin = UserAdmin.query.all()
    return jsonify([admin.serialize() for admin in useradmin]), 200

    # ----GET-INDIVIDUAL---


@api.route('/useradmin/<int:id>', methods=['GET'])
def get_user_admin(id):
    admin = UserAdmin.query.get(id)
    if not admin:
        return jsonify({"error": "Usuario administrador no encontrado"}), 404
    return jsonify(admin.serialize()), 200

    # ----POST-creacion de usuario administrativo---


@api.route('/useradmin', methods=['POST'])
def create_user_admin():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    admin_existente = UserAdmin.query.filter_by(email=email).first()
    if admin_existente:
        return jsonify({"msg": "Este email ya está registrado"}), 409

    hashed_password = generate_password_hash(password)
    nuevo_admin = UserAdmin(email=email, password=hashed_password)

    db.session.add(nuevo_admin)
    db.session.commit()

    return jsonify({"msg": "Administrador creado exitosamente"}), 201

    # ----DELETE---


@api.route('/useradmin/<int:id>', methods=['DELETE'])
def delete_user_admin(id):
    admin = UserAdmin.query.get(id)
    if not admin:
        return jsonify({"error": "Usuario administrador no encontrado"}), 404

    db.session.delete(admin)
    db.session.commit()

    return jsonify({"msg": "Usuario administrador eliminado correctamente"}), 200

    # ----PUT---


# ----PUT - actualizar usuario administrativo---
@api.route('/useradmin/<int:id>', methods=['PUT'])
def update_user_admin(id):
    admin_a_actualizar = UserAdmin.query.get(id)

    if not admin_a_actualizar:
        return jsonify({"msg": "Administrador no encontrado"}), 404

    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if email:
        admin_a_actualizar.email = email

    if password:
        admin_a_actualizar.password = generate_password_hash(password)

    db.session.commit()

    return jsonify({"msg": "Administrador actualizado exitosamente"}), 200


@api.route('/useradmin/login', methods=['POST'])
def login_user_admin():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    admin = UserAdmin.query.filter_by(email=email).first()

    if not admin or not check_password_hash(admin.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401

    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    access_token = jwt.encode({
        "user_id": admin.id,
        "email": admin.email,
        "exp": expiration
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        "msg": "Login exitoso",
        "token": access_token,
        "id": admin.id,
        "email": admin.email
    }), 200


@api.route('/itemcarrito/<int:item_id>', methods=['GET'])
@vendedor_required
def get_itemcarrito(item_id, vendedor_id):
    item = ItemCarrito.query.get(item_id)

    if not item:
        return jsonify({"msg": "Item no encontrado"}), 404

    # Verifica que el item le pertenece al vendedor autenticado
    if item.producto.vendedor_id != vendedor_id:
        return jsonify({"msg": "No autorizado"}), 403

    return jsonify({
        "id": item.id,
        "producto_id": item.producto_id,
        "producto_nombre": item.producto.nombre,
        "direccion_envio": item.direccion_envio,
        "detalle_envio": item.detalle_envio,
        "latitud": item.latitud,
        "longitud": item.longitud,
        "status": item.status
    }), 200
