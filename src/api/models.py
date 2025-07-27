from typing import List

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column,relationship, backref


db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    productos: Mapped[List["Producto"]] = relationship(back_populates="user")


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

#PRODUCTO
class Deck(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    precio: Mapped[int] = mapped_column(nullable=False)
    stock: Mapped[int] = mapped_column(nullable=False)
    vendedor_id: Mapped[str] = mapped_column(nullable=False)

    
    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio,
            "stock": self.stock,
            # do not serialize the password, its a security breach
        }
    
class Single(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    precio: Mapped[int] = mapped_column(nullable=False)
    rareza: Mapped[str] = mapped_column(nullable=False)
    stock: Mapped[int] = mapped_column(nullable=False)
    vendedor_id: Mapped[str] = mapped_column(nullable=False)

    
    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio,
            "rareza": self.rareza,
            "stock": self.stock,
            # do not serialize the password, its a security breach
        }
    
class BoosterPack(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    precio: Mapped[int] = mapped_column(nullable=False)
    stock: Mapped[int] = mapped_column(nullable=False)
    vendedor_id: Mapped[str] = mapped_column(nullable=False)

    
    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio,
            "stock": self.stock,
            # do not serialize the password, its a security breach
        }
    
    
 

