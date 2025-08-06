import click
from flask import Flask
from flask.cli import with_appcontext
from flask_migrate import init, migrate, upgrade, downgrade, revision

# Agrega aquí cualquier otra importación si necesitas DB
from .models import db

def setup_commands(app: Flask):
    @app.cli.command("migrate")
    @with_appcontext
    def migrate_command():
        """Inicializa migraciones si es necesario, genera y aplica cambios"""
        # Inicializar si no existe carpeta migrations
        import os
        if not os.path.isdir("migrations"):
            click.echo("Inicializando migraciones...")
            init()
        
        click.echo("Creando migración...")
        migrate(message="Auto migration")
        click.echo("Actualizando base de datos...")
        upgrade()
        click.echo("Migración completada.")

    @app.cli.command("downgrade")
    @with_appcontext
    def downgrade_command():
        """Revierte la última migración"""
        click.echo("Revirtiendo última migración...")
        downgrade()
        click.echo("Downgrade completado.")

    @app.cli.command("revision")
    @with_appcontext
    def revision_command():
        """Crea una revisión de migración sin aplicar"""
        click.echo("Creando una revisión...")
        revision(message="Nueva revisión")
        click.echo("Revisión creada.")
