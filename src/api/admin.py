from .models import db, User, Vendedor, Comprador, Producto, Carrito, ItemCarrito, Categorias, ProductoCategoria
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import os




class ProductoCategoriaAdmin(ModelView):
    column_list = ['id', 'producto_id', 'categoria_id']          # columnas visibles
    form_columns = ['producto_id', 'categoria_id']                # campos editables
    column_labels = {
        'producto_id': 'Producto',
        'categoria_id': 'Categoría'
    }
def setup_admin(app):
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Vendedor, db.session))
    admin.add_view(ModelView(Categorias, db.session))
    admin.add_view(ModelView(Producto, db.session))
    admin.add_view(ProductoCategoriaAdmin(ProductoCategoria, db.session))  # ✅ usamos la clase aquí
    admin.add_view(ModelView(Comprador, db.session))
    admin.add_view(ModelView(Carrito, db.session))
    admin.add_view(ModelView(ItemCarrito, db.session))