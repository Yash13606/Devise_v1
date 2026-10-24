from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)


def test_health_is_available_without_claiming_ingestion_readiness():
    assert client.get("/health").status_code == 200


def test_events_cannot_be_acknowledged_without_durable_ingestion():
    response = client.post("/api/event", json={"event_id": "test-event"})
    assert response.status_code == 501
    assert "ingestion" in response.json()["detail"].lower()


def test_unimplemented_event_reads_are_not_successful_empty_evidence():
    assert client.get("/api/event").status_code == 501
