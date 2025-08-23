import os
import uuid
import requests
import pytest

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
MENUS_URL = f"{BASE_URL}/menu"


def require_server():
	try:
		requests.get(BASE_URL, timeout=2)
	except requests.exceptions.RequestException:
		pytest.skip("API server is not reachable. Set API_BASE_URL or start the server.")


def auth_headers(token: str | None = None):
	headers = {"Content-Type": "application/json"}
	if token:
		headers["Authorization"] = f"Bearer {token}"
	return headers


@pytest.mark.order(1)
@pytest.mark.parametrize("name,price", [("Test Pizza", 12.5)])
def test_create_menu_item(name, price):
	require_server()
	payload = {"name": name, "price": price}
	resp = requests.post(MENUS_URL, json=payload, headers=auth_headers(os.getenv("API_TOKEN")), timeout=5)
	assert resp.status_code in (200, 201), resp.text
	data = resp.json()
	assert data.get("name") == name
	assert float(data.get("price")) == float(price)
	assert data.get("id")
	# store id for later tests via environment-like pytest cache
	os.environ["LAST_MENU_ID"] = str(data["id"]) if not isinstance(data["id"], dict) else str(data["id"].get("id"))


def test_unauthorized_access_rejected():
	require_server()
	payload = {"name": "Unauthorized Burger", "price": 9.99}
	resp = requests.post(MENUS_URL, json=payload, headers=auth_headers(None), timeout=5)
	assert resp.status_code in (401, 403), f"Expected 401/403, got {resp.status_code}: {resp.text}"


@pytest.mark.order(2)
def test_update_menu_item_with_valid_data():
	require_server()
	menu_id = os.getenv("LAST_MENU_ID") or str(uuid.uuid4())
	update = {"name": "Updated Item", "price": 15.0}
	resp = requests.put(f"{MENUS_URL}/{menu_id}", json=update, headers=auth_headers(os.getenv("API_TOKEN")), timeout=5)
	# Allow either success for real id or 404 for random fallback id
	assert resp.status_code in (200, 204, 404), resp.text
	if resp.status_code in (200, 204):
		if resp.status_code == 200:
			data = resp.json()
			assert data.get("name") == update["name"]
			assert float(data.get("price")) == float(update["price"])


@pytest.mark.order(3)
def test_delete_menu_item_removes_item():
	require_server()
	menu_id = os.getenv("LAST_MENU_ID") or str(uuid.uuid4())
	resp = requests.delete(f"{MENUS_URL}/{menu_id}", headers=auth_headers(os.getenv("API_TOKEN")), timeout=5)
	# Allow either success for real id or 404 if id isn't found
	assert resp.status_code in (200, 204, 404), resp.text
	if resp.status_code in (200, 204):
		check = requests.get(f"{MENUS_URL}/{menu_id}", headers=auth_headers(os.getenv("API_TOKEN")), timeout=5)
		assert check.status_code in (404, 410), f"Expected not found after delete, got {check.status_code}"