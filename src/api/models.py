from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_admin.contrib.sqla import ModelView


db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }


class Vendedor(db.Model):
    __tablename__ = "vendedor"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    correo: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(256), nullable=False)

    productos = relationship(
        "Producto", back_populates="vendedor", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "correo": self.correo,
        }



class Comprador(db.Model):
    __tablename__ = "comprador"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    correo: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)

    carritos = relationship(
        "Carrito", back_populates="comprador", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "correo": self.correo
        }


class Categorias(db.Model):
    __tablename__ = "categorias"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name

        }


class Producto(db.Model):
    __tablename__ = "producto"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(500))
    precio: Mapped[float] = mapped_column(Float, nullable=False)
    vendedor_id: Mapped[int] = mapped_column(
        ForeignKey('vendedor.id'), nullable=False)

    vendedor = relationship("Vendedor", back_populates="productos")

    categorias = relationship(
        "ProductoCategoria", back_populates="producto", cascade="all, delete")


    items_carrito = relationship("ItemCarrito", back_populates="producto")  

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "vendedor_id": self.vendedor_id
        }


class Carrito(db.Model):
    __tablename__ = "carrito"
    id: Mapped[int] = mapped_column(primary_key=True)
    id_comprador: Mapped[int] = mapped_column(
        ForeignKey("comprador.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)

    comprador = relationship("Comprador", back_populates="carritos")
    items = relationship(
        "ItemCarrito", back_populates="carrito", cascade="all, delete-orphan")

    def serialize(self, include_items=True):
        return {
            "id": self.id,
            "id_comprador": self.id_comprador,
            "status": self.status,
            "comprador": self.comprador.serialize() if self.comprador else None,
            "items": [item.serialize(include_carrito=False) for item in self.items] if include_items else []
        }


class ItemCarrito(db.Model):
    __tablename__ = "item_carrito"

    id: Mapped[int] = mapped_column(primary_key=True)
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("producto.id"), nullable=False)
    carrito_id: Mapped[int] = mapped_column(
        ForeignKey("carrito.id"), nullable=False)

    status: Mapped[str] = mapped_column(String(50), default="get_direction")
    direccion_envio: Mapped[str] = mapped_column(String(255), nullable=True)
    detalle_envio: Mapped[str] = mapped_column(String(500), nullable=True)
    latitud: Mapped[str] = mapped_column(String(50), nullable=True)
    longitud: Mapped[str] = mapped_column(String(50), nullable=True)
    producto = relationship("Producto", back_populates="items_carrito") 
    carrito = relationship("Carrito", back_populates="items")

    def serialize(self, include_carrito=True):
        return {
            "id": self.id,
            "cantidad": self.cantidad,
            "status": self.status,
            "direccion_envio": self.direccion_envio,
            "detalle_envio": self.detalle_envio,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "producto_id": self.producto_id,
            "carrito_id": self.carrito_id,
            "producto": self.producto.serialize() if self.producto else None,
            "carrito": self.carrito.serialize(include_items=False) if self.carrito and include_carrito else None
        }



class ProductoCategoria(db.Model):
    __tablename__ = "producto_categoria"
    id = db.Column(db.Integer, primary_key=True)
    producto_id = db.Column(db.Integer, db.ForeignKey("producto.id"), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey("categorias.id"), nullable=False)

    producto = db.relationship("Producto", backref="producto_categorias", lazy=True)
    categoria = db.relationship("Categorias", backref="producto_categorias", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "producto_id": self.producto_id,
            "producto_nombre": self.producto.nombre if self.producto else None,
            "categoria_id": self.categoria_id,
            "categoria_nombre": self.categoria.name if self.categoria else None
        }

class UserAdmin(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Guardar el hash

    def __repr__(self):
        return f'<UserAdmin {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }
 
