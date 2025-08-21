import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.auth_vendedor import auth_vendedor  # <-- solo este import

# -------------------------------------------------
# Config app
# -------------------------------------------------
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../dist/")

app = Flask(__name__)
app.url_map.strict_slashes = False

# Secret
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "clave_super_secreta_cambiala")

# CORS


FRONT_ORIGIN = os.getenv(
    "FRONT_ORIGIN",

    "https://obscure-rotary-phone-4j6j5xx96499f5qxj-3000.app.github.dev",

    "https://friendly-garbanzo-wrxvw4r756vj359jr-3000.app.github.dev",

)

CORS(
    app,
    resources={
        r"/api/*": {"origins": FRONT_ORIGIN},
        r"/uploads/*": {"origins": FRONT_ORIGIN},
    },
    supports_credentials=True,                 # si usas cookies/sesión/JWT en cookie
    expose_headers=["Content-Type", "Authorization"],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    intercept_exceptions=True,                 # <-- añade CORS también en 4xx/5xx
)

@app.after_request
def add_cors_headers(resp):
    origin = request.headers.get("Origin")
    if origin and (FRONT_ORIGIN == "*" or origin == FRONT_ORIGIN):
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Vary"] = "Origin"
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        resp.headers["Access-Control-Allow-Headers"] = request.headers.get(
            "Access-Control-Request-Headers", "Authorization, Content-Type"
        )
        resp.headers["Access-Control-Allow-Methods"] = request.headers.get(
            "Access-Control-Request-Method", "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        )
    return resp

# -------------------------------------------------
# DB
# -------------------------------------------------
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace("postgres://", "postgresql://")
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# -------------------------------------------------
# Admin, commands, blueprints
# -------------------------------------------------
setup_admin(app)
setup_commands(app)

app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(auth_vendedor, url_prefix="/api")

# -------------------------------------------------
# Static & errors
# -------------------------------------------------
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")

@app.route("/<path:path>", methods=["GET"])
def serve_any_other_file(path):
    file_path = os.path.join(static_file_dir, path)
    if not os.path.isfile(file_path):
        path = "index.html"
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# Sirve /static/* desde src/static
@app.route("/static/<path:path>")
def send_static(path):
    static_folder = os.path.join(os.path.dirname(os.path.realpath(__file__)), "static")
    return send_from_directory(static_folder, path)

# -------------------------------------------------
# Run
# -------------------------------------------------
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=(ENV == "development"))