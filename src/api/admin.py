from .models import db, User, Vendedor, Comprador, Producto, Carrito, ItemCarrito, Categorias
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import os


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    
   
    admin.add_view(ModelView(User, db.session))

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Vendedor, db.session))
    admin.add_view(ModelView(Categorias, db.session))
    admin.add_view(ModelView(Producto, db.session))
    admin.add_view(ModelView(Comprador, db.session))
    admin.add_view(ModelView(Producto, db.session))
    admin.add_view(ModelView(Carrito, db.session))
    admin.add_view(ModelView(ItemCarrito, db.session))

