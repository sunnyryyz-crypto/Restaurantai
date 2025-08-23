from flask import Blueprint, request, jsonify
from ..models import Store
from .. import db, bcrypt
from flask_jwt_extended import create_access_token
import re

bp = Blueprint('auth', __name__)

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', '').lower()
    password = data.get('password', '')
    store_name = data.get('store_name', '')

    if not email or not password or not store_name:
        return jsonify({"error": "Email, password, and store name required"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Invalid email address"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password too short"}), 400

    if Store.query.filter_by(owner_email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_store = Store(owner_email=email, password_hash=pw_hash, store_name=store_name)
    db.session.add(new_store)
    db.session.commit()

    return jsonify({"message": "Store registered successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    store = Store.query.filter_by(owner_email=email).first()
    if not store or not bcrypt.check_password_hash(store.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=store.id)
    return jsonify({"access_token": access_token}), 200
