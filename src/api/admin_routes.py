# src/api/routes.py
from flask import Blueprint, jsonify
from .models import db, Vendedor, Comprador
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_routes = Blueprint('admin_routes', __name__)

# Obtener todos los vendedores
@admin_routes.route("/admin/vendedores", methods=["GET"])
@jwt_required()  # Se asegura que haya un admin logueado
def get_all_vendedores():
    identity = get_jwt_identity()
    if not identity.get("is_admin", False):
        return jsonify({"msg": "No autorizado"}), 403

    vendedores = Vendedor.query.all()
    return jsonify([v.serialize() for v in vendedores]), 200

# Obtener todos los compradores
@admin_routes.route("/admin/compradores", methods=["GET"])
@jwt_required()
def get_all_compradores():
    identity = get_jwt_identity()
    if not identity.get("is_admin", False):
        return jsonify({"msg": "No autorizado"}), 403

    compradores = Comprador.query.all()
    return jsonify([c.serialize() for c in compradores]), 200
