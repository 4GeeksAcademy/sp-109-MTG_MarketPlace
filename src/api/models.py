from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
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
    correo: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)

    productos = relationship("Producto", back_populates="vendedor", cascade="all, delete")

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
    correo: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    carritos = relationship("Carrito", back_populates="comprador", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "correo": self.correo
        }

class Producto(db.Model):
    __tablename__ = "producto"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(500))
    precio: Mapped[float] = mapped_column(Float, nullable=False)
    vendedor_id: Mapped[int] = mapped_column(ForeignKey('vendedor.id'), nullable=False)

    vendedor = relationship("Vendedor", back_populates="productos")

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
    id_comprador: Mapped[int] = mapped_column(ForeignKey("comprador.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)

    comprador = relationship("Comprador", back_populates="carritos")
    items = relationship("ItemCarrito", back_populates="carrito", cascade="all, delete-orphan")

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
    producto_id: Mapped[int] = mapped_column(ForeignKey("producto.id"), nullable=False)
    carrito_id: Mapped[int] = mapped_column(ForeignKey("carrito.id"), nullable=False)

    producto = relationship("Producto")
    carrito = relationship("Carrito", back_populates="items")

    def serialize(self, include_carrito=True):
        return {
            "id": self.id,
            "cantidad": self.cantidad,
            "producto_id": self.producto_id,
            "carrito_id": self.carrito_id,
            "producto": self.producto.serialize() if self.producto else None,
            "carrito": self.carrito.serialize(include_items=False) if self.carrito and include_carrito else None
        }