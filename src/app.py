import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User, Producto, CategoriaProductoSingle, CategoriaSingle, Comprador
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

app = Flask(__name__)
app.url_map.strict_slashes = False

# ✅ CORS aplicado globalmente para permitir requests entre frontend (3000) y backend (3001)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# DB setup
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Admin y comandos
setup_admin(app)
setup_commands(app)

# Blueprints
app.register_blueprint(api, url_prefix='/api')

# Errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Rutas
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

@app.route('/producto', methods=['GET'])
def get_producto():
    all_producto = Producto.query.all()
    return jsonify([p.serialize() for p in all_producto]), 200

@app.route('/categoria_producto', methods=['POST'])
def add_categoria_producto():
    body = request.get_json()
    if 'producto_id' not in body or 'categoria_id' not in body:
        return 'Faltan datos obligatorios', 400

    categoria_producto = CategoriaProductoSingle(**body)
    db.session.add(categoria_producto)
    db.session.commit()
    return jsonify({
        "msg": "Se agregó producto",
        "categoria_producto": categoria_producto.serialize()
    }), 200

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)