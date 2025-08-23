from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()


def create_app(test_config: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config.setdefault("SQLALCHEMY_DATABASE_URI", "sqlite:///app.db")
    app.config.setdefault("SQLALCHEMY_TRACK_MODIFICATIONS", False)
    app.config.setdefault("JWT_SECRET_KEY", "test-secret")
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    from .auth import bp as auth_bp  # type: ignore
    app.register_blueprint(auth_bp, url_prefix="/auth")

    with app.app_context():
        db.create_all()

    return app