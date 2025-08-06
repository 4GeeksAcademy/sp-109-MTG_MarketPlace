import os
import stripe
from flask import Blueprint, request, jsonify
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Vendedor, Producto, Comprador, Carrito, ItemCarrito, Categorias, Admin
from api.utils import generate_sitemap, APIException
import datetime
import jwt
from flask import current_app as app
from api.jwt_utils import token_required_vendedor
from werkzeug.security import generate_password_hash, check_password_hash
from api.jwt_utils_comprador import token_required_comprador

api = Blueprint('api', __name__)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
#CORS(api)


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
def create_producto():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "Body vacío"}), 400

    required_fields = ["nombre", "descripcion", "precio", "vendedor_id"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos"}), 400

    if not Vendedor.query.get(data["vendedor_id"]):
        return jsonify({"msg": "El vendedor no existe"}), 400

    producto = Producto(**{k: data[k] for k in required_fields})
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
        existing_user = Vendedor.query.filter_by(username=body["username"]).first()
        if existing_user and existing_user.id != id:
            return jsonify({"msg": "Nombre de usuario ya en uso"}), 400

    if "correo" in body:
        existing_email = Vendedor.query.filter_by(correo=body["correo"]).first()
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


# === API CATEGORIAS ===

@api.route('/categorias', methods=['GET'])
def get_categorias():
    all_categorias = Categorias.query.all()
    results =list(map(lambda categorias:categorias.serialize(),all_categorias ))
  
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

# === API ADMINS ===

@api.route('/admins', methods=['GET'])
def get_all_admins():
    return jsonify([a.serialize() for a in Admin.query.all()]), 200

@api.route('/admins/<int:id>', methods=['GET'])
def get_admin(id):
    admin = Admin.query.get(id)
    if not admin:
        return jsonify({"msg": "Admin no encontrado"}), 404
    return jsonify(admin.serialize()), 200

@api.route('/admins', methods=['POST'])
def create_admin():
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Body vacío"}), 400

    if not all(field in body for field in ("username", "correo")):
        return jsonify({"msg": "Faltan datos"}), 400

    if Admin.query.filter_by(username=body["username"]).first():
        return jsonify({"msg": "Nombre de usuario ya en uso"}), 400
    if Admin.query.filter_by(correo=body["correo"]).first():
        return jsonify({"msg": "Correo ya registrado"}), 400

    admin = Admin(**body)
    db.session.add(admin)
    db.session.commit()
    return jsonify(admin.serialize()), 201

@api.route('/admins/<int:id>', methods=['PUT'])
def update_admin(id):
    admin = Admin.query.get(id)
    if not admin:
        return jsonify({"msg": "Admin no encontrado"}), 404

    body = request.get_json()
    if not body:
        return jsonify({"msg": "Body vacío"}), 400

    if "username" in body:
        existing_user = Admin.query.filter_by(username=body["username"]).first()
        if existing_user and existing_user.id != id:
            return jsonify({"msg": "Nombre de usuario ya en uso"}), 400

    if "correo" in body:
        existing_email = Admin.query.filter_by(correo=body["correo"]).first()
        if existing_email and existing_email.id != id:
            return jsonify({"msg": "Correo ya registrado"}), 400

    admin.username = body.get("username", admin.username)
    admin.correo = body.get("correo", admin.correo)

    db.session.commit()
    return jsonify(admin.serialize()), 200

@api.route('/admins/<int:id>', methods=['DELETE'])
def delete_admin(id):
    admin = Admin.query.get(id)
    if not admin:
        return jsonify({"msg": "Admin no encontrado"}), 404
    db.session.delete(admin)
    db.session.commit()
    return jsonify({"msg": "Admin eliminado"}), 200



@api.route("/orders", methods=["GET"])
@token_required_comprador
def get_orders():
    compr_id = request.comprador_id
    orders = Order.query.filter_by(comprador_id=compr_id).order_by(Order.created_at.desc()).all()
    return jsonify([o.serialize() for o in orders]), 200

@api.route("/orders/<int:id>", methods=["GET"])
@token_required_comprador
def get_order(id):
    compr_id = request.comprador_id
    order = Order.query.get(id)
    if not order or order.comprador_id != compr_id:
        return jsonify({"msg": "Orden no encontrada"}), 404
    return jsonify(order.serialize()), 200

@api.route("/orders", methods=["POST"])
@token_required_comprador
def create_order():
    # Se asume que el carrito ya existe y se envía el cartId
    body = request.get_json()
    cart_id = body.get("cart_id")
    carrito = Carrito.query.get(cart_id)
    if not carrito or carrito.id_comprador != request.comprador_id:
        return jsonify({"msg": "Carrito inválido"}), 400
    total = sum(item.cantidad * item.producto.precio for item in carrito.items)
    order = Order(comprador_id=request.comprador_id, status="paid", total=total)
    for item in carrito.items:
        oi = OrderItem(
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=item.producto.precio
        )
        order.items.append(oi)
    db.session.add(order)
    carrito.status = "processed"
    db.session.commit()
    return jsonify(order.serialize()), 201



@api.route("/orders/stripe_intent", methods=["POST"])
@token_required_comprador
def stripe_intent():
    compr_id = request.comprador_id
    body = request.get_json()
    cart = Carrito.query.get(body["cart_id"])
    if not cart or cart.id_comprador != compr_id:
        return jsonify({"msg": "Carrito inválido"}), 400
    total = sum(item.cantidad * item.producto.precio for item in cart.items)
    intent = stripe.PaymentIntent.create(
        amount=int(total * 100),
        currency="eur",
        payment_method_types=["card"],
        metadata={"cart_id": cart.id, "user_id": compr_id},
    )
    order = Order(
        comprador_id=compr_id,
        payment_method="tarjeta",
        status="paid",
        total=total
    )
    for item in cart.items:
        order.items.append(OrderItem(
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=item.producto.precio
        ))
    db.session.add(order)
    db.session.commit()
    return jsonify({"clientSecret": intent.client_secret, "orderId": order.id})

@api.route("/orders/offline", methods=["POST"])
@token_required_comprador
def offline_order():
    compr_id = request.comprador_id
    body = request.get_json()
    cart = Carrito.query.get(body["cart_id"])
    if not cart or cart.id_comprador != compr_id:
        return jsonify({"msg": "Carrito inválido"}), 400
    total = sum(item.cantidad * item.producto.precio for item in cart.items)
    order = Order(
        comprador_id=compr_id,
        payment_method=body["metodoPago"],
        status="pending",
        total=total
    )
    for item in cart.items:
        order.items.append(OrderItem(
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=item.producto.precio
        ))
    db.session.add(order)
    db.session.commit()
    return jsonify({"orderId": order.id})