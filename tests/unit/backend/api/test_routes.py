import pytest
from flask import Flask
from flask.testing import FlaskClient   # for type hints
from src.backend.api.routes import api

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(api)

    with app.test_client() as client:
        yield client

def test_can_run_parser(client:FlaskClient):
    response = client.post("/api/run", json=[
        {"type": "move", "direction": "up"},
        {"type": "move", "direction": "left"},
        {"type": "rotate", "direction": "left"},
        {"type": "move", "direction": "down"}
    ])

    assert response.status_code == 200
    assert response.get_json() == [
        {"x": 0, "y": 0, "direction": "up"},
        {"x": 0, "y": 1, "direction": "up"},
        {"x": -1, "y": 1, "direction": "up"},
        {"x": -1, "y": 1, "direction": "left"},
        {"x": 0, "y": 1, "direction": "left"}
    ]