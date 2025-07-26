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
class Producto(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    precio: Mapped[str] = mapped_column(nullable=False)
    stock: Mapped[str] = mapped_column(nullable=False)
    vendedor_id: Mapped[str] = mapped_column(nullable=False)

    

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="productos")

    


    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio,
            "stock": self.stock,
            # do not serialize the password, its a security breach
        }
    
 

#CATEGORIA
class CategoriaSingle(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    categoria: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    categoria_producto_single: Mapped[List["CategoriaProductoSingle"]] = relationship(back_populates="categoria_single")
 


    def serialize(self):
        return {
            "id": self.id,
            "categoria": self.categoria,
            # do not serialize the password, its a security breach
        }
    

#CATEGORIA  PRODUCTO  
class CategoriaProductoSingle(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    producto_id: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    categoria_id: Mapped[str] = mapped_column(nullable=False)
    rareza: Mapped[str] = mapped_column(nullable=False)


    categoria_single_id: Mapped[int] = mapped_column(ForeignKey("categoria_single.id"))
    categoria_single: Mapped["CategoriaSingle"] = relationship(back_populates="categoria_producto_single")

    def serialize(self):
        return {
            "id": self.id,
            "producto_id": self.producto_id,
            "categoria_id": self.categoria_id,
            "rareza": self.rareza,
            # do not serialize the password, its a security breach
        }



