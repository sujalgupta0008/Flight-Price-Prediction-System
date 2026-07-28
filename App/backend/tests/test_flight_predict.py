"""Backend tests for Flask flight price prediction app.
Endpoints: GET /  and  POST /predict (form-encoded, returns HTML)
"""
import os
import re
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


@pytest.fixture
def client():
    s = requests.Session()
    return s


# ---- Home page ----
class TestHome:
    def test_home_200_and_ui_markers(self, client):
        r = client.get(BASE_URL + "/", timeout=30)
        assert r.status_code == 200
        html = r.text
        assert 'data-testid="globe-background"' in html
        assert 'data-testid="predict-form"' in html
        assert 'data-testid="predict-button"' in html
        assert "AeroPredict" in html


# ---- Prediction endpoint ----
def _form(**overrides):
    data = {
        "airline": "IndiGo",
        "source": "Delhi",
        "destination": "Cochin",
        "journey_date": "2025-06-15",
        "dep_time": "09:30",
        "arrival_time": "12:45",
        "stops": "1 stop",
    }
    data.update(overrides)
    return data


def _extract_price(html):
    m = re.search(r'data-testid="prediction-price"[^>]*>\s*₹\s*([\d,]+\.\d{2})', html)
    return float(m.group(1).replace(",", "")) if m else None


class TestPredict:
    def test_predict_normal(self, client):
        r = client.post(BASE_URL + "/predict", data=_form(), timeout=30)
        assert r.status_code == 200
        assert 'data-testid="prediction-result"' in r.text
        price = _extract_price(r.text)
        assert price is not None and price > 0

    def test_predict_jet_airways_more_expensive_than_indigo(self, client):
        r1 = client.post(BASE_URL + "/predict", data=_form(airline="IndiGo"), timeout=30)
        r2 = client.post(BASE_URL + "/predict", data=_form(airline="Jet Airways"), timeout=30)
        p1, p2 = _extract_price(r1.text), _extract_price(r2.text)
        assert p1 and p2
        assert p2 > p1  # sanity: jet airways heuristic higher

    def test_predict_overnight_flight_positive(self, client):
        # arrival earlier than departure -> overnight, duration should wrap +24h
        r = client.post(BASE_URL + "/predict",
                        data=_form(dep_time="22:30", arrival_time="04:15"),
                        timeout=30)
        assert r.status_code == 200
        price = _extract_price(r.text)
        assert price is not None and price > 0

    def test_predict_missing_field_returns_error(self, client):
        data = _form()
        del data["airline"]
        r = client.post(BASE_URL + "/predict", data=data, timeout=30)
        # Flask KeyError -> 400/500; just verify it's not a valid prediction
        assert r.status_code >= 400 or _extract_price(r.text) is None
