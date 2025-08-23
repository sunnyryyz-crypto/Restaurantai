import uuid
from typing import Dict, Tuple

import pytest
import requests


def create_order(base_url: str, http_session: requests.Session, payload: Dict) -> Tuple[requests.Response, Dict]:
	resp = http_session.post(f"{base_url}/orders", json=payload, timeout=10)
	data = {}
	try:
		data = resp.json()
	except Exception:  # noqa: BLE001
		pass
	return resp, data


def get_order(base_url: str, http_session: requests.Session, order_id: str) -> requests.Response:
	return http_session.get(f"{base_url}/orders/{order_id}", timeout=10)


def update_order_status(base_url: str, http_session: requests.Session, order_id: str, status: str) -> requests.Response:
	# Try PATCH, then PUT if PATCH not allowed
	resp = http_session.patch(
		f"{base_url}/orders/{order_id}", json={"status": status}, timeout=10
	)
	if resp.status_code == 405:
		resp = http_session.put(
			f"{base_url}/orders/{order_id}", json={"status": status}, timeout=10
		)
	return resp


def list_orders(base_url: str, http_session: requests.Session, store_id: str) -> requests.Response:
	return http_session.get(f"{base_url}/orders", params={"store_id": store_id}, timeout=10)


@pytest.mark.order(1)
@pytest.mark.timeout(30)
def test_place_and_retrieve_order(base_url: str, http_session: requests.Session, sample_order_payload: Dict) -> None:
	resp, data = create_order(base_url, http_session, sample_order_payload)
	assert resp.status_code in (201, 200), resp.text
	order_id = data.get("id") or data.get("order_id")
	assert order_id, f"Response missing order id. Body: {data}"

	# Retrieve
	get_resp = get_order(base_url, http_session, order_id)
	assert get_resp.status_code == 200, get_resp.text
	fetched = get_resp.json()
	assert fetched.get("id") == order_id or fetched.get("order_id") == order_id
	# Basic field echoes
	assert fetched.get("store_id") == sample_order_payload["store_id"]
	assert isinstance(fetched.get("items"), list) and len(fetched["items"]) >= 1


@pytest.mark.order(2)
@pytest.mark.timeout(30)
def test_update_order_status(base_url: str, http_session: requests.Session, sample_order_payload: Dict) -> None:
	# Create
	resp, data = create_order(base_url, http_session, sample_order_payload)
	assert resp.status_code in (201, 200), resp.text
	order_id = data.get("id") or data.get("order_id")
	assert order_id

	# Update status
	new_status = "completed"
	upd_resp = update_order_status(base_url, http_session, order_id, new_status)
	assert upd_resp.status_code in (200, 202), upd_resp.text
	updated = upd_resp.json() if upd_resp.headers.get("content-type", "").startswith("application/json") else {}
	if updated:
		# If the API returns the resource, validate the status
		assert updated.get("status") == new_status
	else:
		# If no body, fetch to confirm
		get_resp = get_order(base_url, http_session, order_id)
		assert get_resp.status_code == 200
		assert get_resp.json().get("status") == new_status


@pytest.mark.order(3)
@pytest.mark.timeout(30)
def test_list_orders_filtered_by_store(base_url: str, http_session: requests.Session) -> None:
	# Create two stores worth of orders
	store_a = f"store-{uuid.uuid4()}"
	store_b = f"store-{uuid.uuid4()}"

	payload_a = {"store_id": store_a, "items": [{"product_id": f"prod-{uuid.uuid4()}", "quantity": 1}]}
	payload_b = {"store_id": store_b, "items": [{"product_id": f"prod-{uuid.uuid4()}", "quantity": 1}]}

	resp_a1, _ = create_order(base_url, http_session, payload_a)
	resp_a2, _ = create_order(base_url, http_session, payload_a)
	resp_b1, _ = create_order(base_url, http_session, payload_b)
	assert resp_a1.status_code in (201, 200)
	assert resp_a2.status_code in (201, 200)
	assert resp_b1.status_code in (201, 200)

	# Filter by store_a
	list_resp = list_orders(base_url, http_session, store_a)
	assert list_resp.status_code == 200, list_resp.text
	orders = list_resp.json()
	assert isinstance(orders, list), f"Expected a list. Got: {type(orders)}"
	assert all(order.get("store_id") == store_a for order in orders), orders
	assert len(orders) >= 2


@pytest.mark.order(4)
@pytest.mark.timeout(30)
def test_invalid_inputs(base_url: str, http_session: requests.Session) -> None:
	# Missing required fields
	resp = http_session.post(f"{base_url}/orders", json={}, timeout=10)
	assert resp.status_code in (400, 422), resp.text

	# Wrong types
	resp = http_session.post(
		f"{base_url}/orders",
		json={"store_id": 123, "items": "not-a-list"},
		timeout=10,
	)
	assert resp.status_code in (400, 422), resp.text

	# Invalid order id format
	bad_id = "not-a-uuid"
	get_resp = http_session.get(f"{base_url}/orders/{bad_id}", timeout=10)
	assert get_resp.status_code in (400, 404, 422), get_resp.text

	# Invalid status update
	# Try PATCH first; accept validation errors
	upd = http_session.patch(
		f"{base_url}/orders/{bad_id}", json={"status": "invalid-status"}, timeout=10
	)
	if upd.status_code == 405:
		upd = http_session.put(
			f"{base_url}/orders/{bad_id}", json={"status": "invalid-status"}, timeout=10
		)
	assert upd.status_code in (400, 404, 422), upd.text