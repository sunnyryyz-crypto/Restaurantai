from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI='postgresql://user:password@localhost/restaurant_db',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY='your-secret-key',
    )

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        from .routes import auth, qbank
        app.register_blueprint(auth.bp, url_prefix='/auth')
        app.register_blueprint(qbank.bp, url_prefix='/qbank')
        db.create_all()

    return app
