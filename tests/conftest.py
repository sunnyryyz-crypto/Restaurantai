import os
import time
import uuid
from typing import Generator, Optional

import pytest
import requests


def pytest_addoption(parser: pytest.Parser) -> None:
	parser.addoption(
		"--base-url",
		action="store",
		help="Base URL of the Orders API (e.g., http://localhost:8000)",
		default=os.getenv("API_BASE_URL", "http://localhost:8000"),
	)
	parser.addoption(
		"--auth-token",
		action="store",
		help="Bearer token for authenticated environments",
		default=os.getenv("API_AUTH_TOKEN"),
	)


@pytest.fixture(scope="session")
def base_url(pytestconfig: pytest.Config) -> str:
	return str(pytestconfig.getoption("base_url")).rstrip("/")


@pytest.fixture(scope="session")
def auth_token(pytestconfig: pytest.Config) -> Optional[str]:
	value = pytestconfig.getoption("auth_token")
	return str(value) if value else None


@pytest.fixture(scope="session")
def http_session(auth_token: Optional[str]) -> Generator[requests.Session, None, None]:
	session = requests.Session()
	# Optional Authorization header
	if auth_token:
		session.headers.update({"Authorization": f"Bearer {auth_token}"})
	session.headers.update({"Content-Type": "application/json", "Accept": "application/json"})
	try:
		yield session
	finally:
		session.close()


@pytest.fixture(scope="session", autouse=True)
def ensure_api_available(base_url: str, http_session: requests.Session) -> None:
	"""Skip the entire test session if the API is not reachable.

	We try a health endpoint then the root. A small retry loop handles slow boots.
	"""
	health_urls = [f"{base_url}/health", base_url]
	errors = []
	for attempt in range(6):  # ~12s total
		for url in health_urls:
			try:
				resp = http_session.get(url, timeout=2)
				if resp.status_code < 500:
					return  # reachable
			except Exception as exc:  # noqa: BLE001
				errors.append(f"{type(exc).__name__}: {exc}")
		time.sleep(2)
	pytest.skip(
		"API not reachable at base_url='" + base_url + "'. "
		"Set API_BASE_URL or use --base-url to point to a running service.\n"
		+ "Errors: " + "; ".join(errors)
	)


@pytest.fixture()
def unique_store_id() -> str:
	return f"store-{uuid.uuid4()}"


@pytest.fixture()
def sample_order_payload(unique_store_id: str) -> dict:
	return {
		"store_id": unique_store_id,
		"items": [
			{"product_id": f"prod-{uuid.uuid4()}", "quantity": 2},
			{"product_id": f"prod-{uuid.uuid4()}", "quantity": 1},
		],
		"customer": {"name": "Test User", "phone": "1234567890"},
	}