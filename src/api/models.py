from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class Vendedor(db.Model):
    __tablename__ = 'vendedor'
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    productos = relationship("Producto", back_populates="vendedor", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "productos": [producto.serialize_basic() for producto in self.productos]
        }

class Comprador(db.Model):
    __tablename__ = 'comprador'
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    carrito = relationship("Carrito", back_populates="comprador", uselist=False, cascade="all, delete")
    orders = relationship("Order", back_populates="comprador", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email
        }

class Producto(db.Model):
    __tablename__ = 'producto'
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=True)
    precio: Mapped[float] = mapped_column(Float, nullable=False)
    vendedor_id: Mapped[int] = mapped_column(ForeignKey("vendedor.id"), nullable=False)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"))

    vendedor = relationship("Vendedor", back_populates="productos")
    categoria = relationship("Categorias", back_populates="productos")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "vendedor": self.vendedor.serialize(),
            "categoria": self.categoria.nombre if self.categoria else None
        }

    def serialize_basic(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio
        }

class Carrito(db.Model):
    __tablename__ = 'carrito'
    id: Mapped[int] = mapped_column(primary_key=True)
    comprador_id: Mapped[int] = mapped_column(ForeignKey("comprador.id"), unique=True)
    comprador = relationship("Comprador", back_populates="carrito")
    items = relationship("ItemCarrito", back_populates="carrito", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "comprador_id": self.comprador_id,
            "items": [item.serialize() for item in self.items]
        }

class ItemCarrito(db.Model):
    __tablename__ = 'item_carrito'
    id: Mapped[int] = mapped_column(primary_key=True)
    carrito_id: Mapped[int] = mapped_column(ForeignKey("carrito.id"))
    producto_id: Mapped[int] = mapped_column(ForeignKey("producto.id"))
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False)

    carrito = relationship("Carrito", back_populates="items")
    producto = relationship("Producto")

    def serialize(self):
        return {
            "id": self.id,
            "producto": self.producto.serialize_basic(),
            "cantidad": self.cantidad
        }

class Categorias(db.Model):
    __tablename__ = 'categorias'
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

    productos = relationship("Producto", back_populates="categoria", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
        }

class Admin(db.Model):
    __tablename__ = 'admin'
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email
        }

# --------------------------
# MODELS PER A COMANDES
# --------------------------

class Order(db.Model):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    comprador_id: Mapped[int] = mapped_column(ForeignKey("comprador.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    payment_method: Mapped[str] = mapped_column(String(32), nullable=False)  # e.g. "paypal", "bizzum", etc.
    status: Mapped[str] = mapped_column(String(20), default="pending")  # 'pending', 'paid'
    total: Mapped[float] = mapped_column(Float, nullable=False)

    comprador = relationship("Comprador", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def serialize(self, include_items=True):
        return {
            "id": self.id,
            "comprador": self.comprador.serialize(),
            "status": self.status,
            "payment_method": self.payment_method,
            "total": self.total,
            "created_at": self.created_at.isoformat(),
            "items": [item.serialize(False) for item in self.items] if include_items else []
        }

class OrderItem(db.Model):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    producto_id: Mapped[int] = mapped_column(ForeignKey("producto.id"), nullable=False)
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False)
    precio_unitario: Mapped[float] = mapped_column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    producto = relationship("Producto")

    def serialize(self, _include_order=True):
        return {
            "producto": self.producto.serialize(),
            "cantidad": self.cantidad,
            "precio_unitario": self.precio_unitario
        }
