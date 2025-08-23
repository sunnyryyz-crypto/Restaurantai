from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os


db = SQLAlchemy()
jwt = JWTManager()


def create_app():
	app = Flask(__name__)
	app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:////workspace/app.db')
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-me')

	db.init_app(app)
	jwt.init_app(app)

	from .routes.menu import menu_bp
	app.register_blueprint(menu_bp, url_prefix='/')

	with app.app_context():
		db.create_all()

	return app