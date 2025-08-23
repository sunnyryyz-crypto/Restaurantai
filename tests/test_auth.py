import pytest
from flask_jwt_extended import decode_token


def register(client, email="user@example.com", password="password123"):
    return client.post(
        "/auth/register",
        json={"email": email, "password": password},
    )


def login(client, email="user@example.com", password="password123"):
    return client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )


def test_successful_registration(client):
    resp = register(client)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["email"] == "user@example.com"
    assert "id" in data


def test_registration_fails_on_duplicate_email(client):
    resp1 = register(client)
    assert resp1.status_code == 201
    resp2 = register(client)
    assert resp2.status_code == 409


def test_successful_login_returns_valid_jwt(client, app):
    # First register user
    register(client)
    resp = login(client)
    assert resp.status_code == 200
    token = resp.get_json().get("access_token")
    assert token

    # Validate token can be decoded using app context
    with app.app_context():
        decoded = decode_token(token)
        assert decoded["type"] == "access"
        assert "sub" in decoded and decoded["sub"] is not None


def test_login_failure_on_wrong_password(client):
    register(client)
    resp = login(client, password="wrong")
    assert resp.status_code == 401