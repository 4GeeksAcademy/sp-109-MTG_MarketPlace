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

    

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
#VENDEDOR

class Vendedor(db.Model):
    __tablename__ = "vendedor"  

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    correo: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "correo": self.correo,
        }
        
# COMPRADOR
class Comprador(db.Model):
    __tablename__ = "comprador"



  
# COMPRADOR
class Comprador(db.Model):
    __tablename__ = "comprador"


    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    correo: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)



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

#PRODUCTO

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    descripcion = db.Column(db.String(500))
    precio = db.Column(db.Float, nullable=False)
    vendedor_id = db.Column(db.Integer, db.ForeignKey('vendedor.id'), nullable=False)
    
    vendedor = db.relationship("Vendedor", backref="productos")  # 👈 importante

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "vendedor_id": self.vendedor_id
        }