"""Backend API tests for Tambe luxury automotive brand website."""
import os
import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
load_dotenv("/app/backend/.env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") + "/api"
ADMIN_TOKEN = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
AUTH_HEADERS = {"X-Admin-Token": ADMIN_TOKEN}


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# =========== Health ===========
class TestHealth:
    def test_root(self, s):
        r = s.get(f"{BASE_URL}/")
        assert r.status_code == 200
        assert "message" in r.json()


# =========== Themes ===========
class TestThemes:
    def test_initialize_presets(self, s):
        r = s.post(f"{BASE_URL}/themes/presets/initialize", headers=AUTH_HEADERS)
        assert r.status_code == 200
        assert "count" in r.json() or "message" in r.json()

    def test_get_active(self, s):
        r = s.get(f"{BASE_URL}/themes/active")
        assert r.status_code == 200
        body = r.json()
        assert "colors" in body and "fonts" in body
        assert body["colors"]["primary"].startswith("#")

    def test_list_themes(self, s):
        r = s.get(f"{BASE_URL}/themes")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_presets_list(self, s):
        r = s.get(f"{BASE_URL}/themes/presets/all")
        assert r.status_code == 200
        assert len(r.json()) == 3

    def test_auth_required(self, s):
        r = s.post(f"{BASE_URL}/themes", json={
            "name": "Test", "colors": {}, "fonts": {}
        })
        assert r.status_code == 401

    def test_crud_theme(self, s):
        payload = {
            "name": "TEST_theme",
            "colors": {"primary": "#FF0000"},
            "fonts": {"family": "Arial"},
        }
        r = s.post(f"{BASE_URL}/themes", json=payload, headers=AUTH_HEADERS)
        assert r.status_code == 200
        theme = r.json()
        tid = theme["id"]
        assert theme["name"] == "TEST_theme"
        assert theme["colors"]["primary"] == "#FF0000"

        # GET by id
        r = s.get(f"{BASE_URL}/themes/{tid}")
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_theme"

        # Update
        r = s.put(f"{BASE_URL}/themes/{tid}",
                  json={"name": "TEST_theme_updated"}, headers=AUTH_HEADERS)
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_theme_updated"

        # Activate
        r = s.post(f"{BASE_URL}/themes/{tid}/activate", headers=AUTH_HEADERS)
        assert r.status_code == 200
        assert r.json()["is_active"] is True

        # Verify active theme switched
        r = s.get(f"{BASE_URL}/themes/active")
        assert r.json()["id"] == tid

        # Try delete active -> should fail 400
        r = s.delete(f"{BASE_URL}/themes/{tid}", headers=AUTH_HEADERS)
        assert r.status_code == 400

        # Activate a preset then delete the test theme
        presets = s.get(f"{BASE_URL}/themes").json()
        preset = next(p for p in presets if p.get("is_preset"))
        s.post(f"{BASE_URL}/themes/{preset['id']}/activate", headers=AUTH_HEADERS)

        r = s.delete(f"{BASE_URL}/themes/{tid}", headers=AUTH_HEADERS)
        assert r.status_code == 200

        # verify 404
        r = s.get(f"{BASE_URL}/themes/{tid}")
        assert r.status_code == 404

    def test_cannot_delete_preset(self, s):
        presets = s.get(f"{BASE_URL}/themes").json()
        preset = next((p for p in presets if p.get("is_preset")), None)
        assert preset is not None
        r = s.delete(f"{BASE_URL}/themes/{preset['id']}", headers=AUTH_HEADERS)
        assert r.status_code == 400


# =========== Products ===========
class TestProducts:
    product_id = None

    def test_initialize(self, s):
        r = s.post(f"{BASE_URL}/products/initialize", headers=AUTH_HEADERS)
        assert r.status_code == 200

    def test_list_products(self, s):
        r = s.get(f"{BASE_URL}/products")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_update_delete(self, s):
        payload = {
            "name": "TEST_Product",
            "category": "Gears",
            "description": "Test description",
            "features": ["F1", "F2"],
            "order": 99,
        }
        r = s.post(f"{BASE_URL}/products", json=payload, headers=AUTH_HEADERS)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]
        assert r.json()["name"] == "TEST_Product"
        assert r.json()["features"] == ["F1", "F2"]

        # GET
        r = s.get(f"{BASE_URL}/products/{pid}")
        assert r.status_code == 200

        # PUT
        r = s.put(f"{BASE_URL}/products/{pid}",
                  json={"description": "Updated desc"}, headers=AUTH_HEADERS)
        assert r.status_code == 200
        assert r.json()["description"] == "Updated desc"

        # Persistence check
        r = s.get(f"{BASE_URL}/products/{pid}")
        assert r.json()["description"] == "Updated desc"

        # DELETE
        r = s.delete(f"{BASE_URL}/products/{pid}", headers=AUTH_HEADERS)
        assert r.status_code == 200
        r = s.get(f"{BASE_URL}/products/{pid}")
        assert r.status_code == 404

    def test_create_requires_auth(self, s):
        r = s.post(f"{BASE_URL}/products", json={
            "name": "X", "category": "Y", "description": "Z", "features": []
        })
        assert r.status_code == 401

    def test_get_nonexistent(self, s):
        r = s.get(f"{BASE_URL}/products/does-not-exist")
        assert r.status_code == 404


# =========== Hero ===========
class TestHero:
    def test_initialize(self, s):
        r = s.post(f"{BASE_URL}/hero/initialize", headers=AUTH_HEADERS)
        assert r.status_code == 200

    def test_list(self, s):
        r = s.get(f"{BASE_URL}/hero")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_crud(self, s):
        payload = {
            "title": "TEST_Title",
            "subtitle": "Sub",
            "tagline": "Tag",
            "order": 5,
        }
        r = s.post(f"{BASE_URL}/hero", json=payload, headers=AUTH_HEADERS)
        assert r.status_code == 200, r.text
        sid = r.json()["id"]
        assert r.json()["title"] == "TEST_Title"

        r = s.put(f"{BASE_URL}/hero/{sid}",
                  json={"title": "TEST_Updated"}, headers=AUTH_HEADERS)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Updated"

        r = s.get(f"{BASE_URL}/hero/{sid}")
        assert r.json()["title"] == "TEST_Updated"

        r = s.delete(f"{BASE_URL}/hero/{sid}", headers=AUTH_HEADERS)
        assert r.status_code == 200
        r = s.get(f"{BASE_URL}/hero/{sid}")
        assert r.status_code == 404

    def test_auth(self, s):
        r = s.post(f"{BASE_URL}/hero",
                   json={"title": "x", "subtitle": "x", "tagline": "x"})
        assert r.status_code == 401


# =========== Settings ===========
class TestSettings:
    def test_get(self, s):
        r = s.get(f"{BASE_URL}/settings")
        assert r.status_code == 200
        body = r.json()
        assert "whatsapp_number" in body
        assert "hero_title" in body

    def test_update(self, s):
        r = s.put(f"{BASE_URL}/settings",
                  json={"whatsapp_number": "+919876543210",
                        "contact_email": "test@tambe.engineering"},
                  headers=AUTH_HEADERS)
        assert r.status_code == 200, r.text
        assert r.json()["whatsapp_number"] == "+919876543210"

        # Persistence
        r = s.get(f"{BASE_URL}/settings")
        assert r.json()["whatsapp_number"] == "+919876543210"
        assert r.json()["contact_email"] == "test@tambe.engineering"

    def test_update_auth(self, s):
        r = s.put(f"{BASE_URL}/settings", json={"whatsapp_number": "x"})
        assert r.status_code == 401
