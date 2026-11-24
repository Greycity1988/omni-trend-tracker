import time
import unittest
from unittest import mock

from fastapi.testclient import TestClient

from app import main
from app.main import app


def _slow(*args, **kwargs):
    time.sleep(1.0)
    raise AssertionError("should have been cut off")


class DeadlineTests(unittest.TestCase):
    def setUp(self):
        main._cache.clear()
        main._lookups.clear()
        self.client = TestClient(app)

    def test_slow_platform_becomes_example_data_in_time(self):
        fast = lambda keyword, w: main.EXAMPLES["naver"](keyword, w) | {"is_live": True}
        with mock.patch.dict(main.FETCHERS, {"google": _slow, "naver": fast}), \
                mock.patch.object(main, "FETCH_DEADLINE_SECONDS", 0.2):
            t = time.monotonic()
            res = self.client.get("/api/trend/선크림?unit=month")
            elapsed = time.monotonic() - t
        self.assertEqual(res.status_code, 200)
        self.assertLess(elapsed, 0.9)
        body = res.json()
        self.assertFalse(body["platforms"]["google"]["is_live"])
        self.assertTrue(body["platforms"]["naver"]["is_live"])
        self.assertEqual(len(body["timeline"]), 12)

    def test_slow_studio_search_answers_504_with_a_message(self):
        with mock.patch.object(main, "search_google_trends_custom", _slow), \
                mock.patch.object(main, "STUDIO_DEADLINE_SECONDS", 0.2):
            res = self.client.post("/api/google/search", json={"keywords": ["선크림"]})
        self.assertEqual(res.status_code, 504)
        self.assertIn("다시 시도", res.json()["detail"])


if __name__ == "__main__":
    unittest.main()
