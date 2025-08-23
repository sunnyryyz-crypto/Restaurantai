from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy.exc import IntegrityError
from .. import db
from ..models import MenuItem


menu_bp = Blueprint('menu', __name__)


def get_store_id_from_jwt():
	claims = get_jwt()
	store_id = claims.get('store_id')
	if not store_id:
		raise ValueError('store_id missing in JWT claims')
	return str(store_id)


@menu_bp.errorhandler(ValueError)
def handle_value_error(err):
	return jsonify({'message': str(err)}), 400


@menu_bp.route('/menu', methods=['GET'])
@jwt_required()
def list_menu_items():
	store_id = get_store_id_from_jwt()
	items = MenuItem.query.filter_by(store_id=store_id).order_by(MenuItem.id.asc()).all()
	return jsonify([item.to_dict() for item in items]), 200


@menu_bp.route('/menu', methods=['POST'])
@jwt_required()
def create_menu_item():
	store_id = get_store_id_from_jwt()
	data = request.get_json(silent=True) or {}
	name = (data.get('name') or '').strip()
	price = data.get('price')
	if not name:
		return jsonify({'message': 'name is required'}), 400
	try:
		price_value = float(price)
	except (TypeError, ValueError):
		return jsonify({'message': 'price must be a number'}), 400

	item = MenuItem(store_id=store_id, name=name, price=price_value)
	db.session.add(item)
	try:
		db.session.commit()
	except IntegrityError:
		db.session.rollback()
		return jsonify({'message': 'could not create menu item'}), 400

	return jsonify(item.to_dict()), 201


@menu_bp.route('/menu/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_menu_item(item_id: int):
	store_id = get_store_id_from_jwt()
	item = MenuItem.query.filter_by(id=item_id, store_id=store_id).first()
	if not item:
		return jsonify({'message': 'item not found'}), 404

	data = request.get_json(silent=True) or {}
	if 'name' in data:
		new_name = (data.get('name') or '').strip()
		if not new_name:
			return jsonify({'message': 'name cannot be empty'}), 400
		item.name = new_name
	if 'price' in data:
		try:
			item.price = float(data.get('price'))
		except (TypeError, ValueError):
			return jsonify({'message': 'price must be a number'}), 400

	try:
		db.session.commit()
	except IntegrityError:
		db.session.rollback()
		return jsonify({'message': 'could not update menu item'}), 400

	return jsonify(item.to_dict()), 200


@menu_bp.route('/menu/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_menu_item(item_id: int):
	store_id = get_store_id_from_jwt()
	item = MenuItem.query.filter_by(id=item_id, store_id=store_id).first()
	if not item:
		return jsonify({'message': 'item not found'}), 404

	db.session.delete(item)
	try:
		db.session.commit()
	except IntegrityError:
		db.session.rollback()
		return jsonify({'message': 'could not delete menu item'}), 400

	return jsonify({'message': 'deleted'}), 200