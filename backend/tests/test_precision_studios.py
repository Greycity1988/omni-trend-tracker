import unittest
from unittest import mock
from fastapi.testclient import TestClient
from app.main import app

class PrecisionStudiosTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_google_trends_search_validation(self):
        # Empty keywords should fail with 400
        res = self.client.post("/api/google/search", json={"keywords": []})
        self.assertEqual(res.status_code, 400)

    def test_google_trends_search_fallback_or_live(self):
        with mock.patch("pytrends.request.TrendReq") as mock_req:
            mock_inst = mock.Mock()
            mock_req.return_value = mock_inst
            # Mock exception to test fallback behavior
            mock_inst.build_payload.side_effect = Exception("Mocked error")

            res = self.client.post("/api/google/search", json={
                "keywords": ["선크림", "러닝화"],
                "timeframe": "today 3-m",
                "geo": "KR"
            })
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertEqual(data["keywords"], ["선크림", "러닝화"])
            self.assertIn("timeline", data)
            self.assertIn("summaries", data)
            self.assertIn("선크림", data["summaries"])


if __name__ == "__main__":
    unittest.main()
