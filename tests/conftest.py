import os
import pytest
from flask import Flask

from app import create_app, db as _db


@pytest.fixture(scope="session")
def app() -> Flask:
    test_config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_ENGINE_OPTIONS": {"connect_args": {"check_same_thread": False}},
        "JWT_SECRET_KEY": "test-secret",
    }
    app = create_app(test_config)
    return app


@pytest.fixture()
def db(app: Flask):
    with app.app_context():
        _db.drop_all()
        _db.create_all()
        yield _db
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def client(app: Flask, db):
    return app.test_client()