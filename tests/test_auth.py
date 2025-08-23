import pytest
from app import create_app, db
from flask_jwt_extended import decode_token

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app.test_client()

def test_register_login(client):
    # Register new store
    response = client.post('/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123',
        'store_name': 'Test Store'
    })
    assert response.status_code == 201

    # Duplicate registration
    response = client.post('/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123',
        'store_name': 'Test Store'
    })
    assert response.status_code == 409

    # Login success
    response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

    # Login failure
    response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
