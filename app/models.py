from datetime import datetime
from . import db


class MenuItem(db.Model):
	__tablename__ = 'menu_items'

	id = db.Column(db.Integer, primary_key=True)
	store_id = db.Column(db.String(64), nullable=False, index=True)
	name = db.Column(db.String(255), nullable=False)
	price = db.Column(db.Numeric(10, 2), nullable=False)
	created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
	updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

	def to_dict(self):
		return {
			'id': self.id,
			'store_id': self.store_id,
			'name': self.name,
			'price': float(self.price),
			'created_at': self.created_at.isoformat(),
			'updated_at': self.updated_at.isoformat() if self.updated_at else None,
		}