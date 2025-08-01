import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User, Vendedor, Comprador, Producto, Carrito, ItemCarrito, Categorias
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands







app = Flask(__name__)
app.url_map.strict_slashes = False


CORS(app,
     supports_credentials=True,
     resources={r"/api/*": {
         "origins": ["https://obscure-rotary-phone-4j6j5xx96499f5qxj-3000.app.github.dev"]
     }},
     expose_headers=["Content-Type", "Authorization"],
     allow_headers=["Content-Type", "Authorization"]
)




ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')


# Configuración de base de datos
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar DB y migraciones
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Setup admin y comandos
setup_admin(app)
setup_commands(app)

# Registrar API
app.register_blueprint(api, url_prefix='/api')

# Manejo de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Sitemap en desarrollo
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Soporte para React Router en producción
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    file_path = os.path.join(static_file_dir, path)
    if not os.path.isfile(file_path):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response


# Ejecutar servidor

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=(ENV == "development"))