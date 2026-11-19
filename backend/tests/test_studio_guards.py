import unittest
from unittest import mock

from fastapi.testclient import TestClient

from app import main
from app.main import app
from app.services import meta


class StudioGuardTests(unittest.TestCase):
    def setUp(self):
        main._lookups.clear()
        self.client = TestClient(app)

    def test_studio_searches_share_the_lookup_limit(self):
        with mock.patch.object(main, "search_google_trends_custom", return_value={
            "timeframe": "today 3-m", "geo": "KR", "gprop": "", "keywords": ["a"],
            "timeline": [], "summaries": {}, "is_live": False,
        }):
            codes = [self.client.post("/api/google/search", json={"keywords": ["a"]}).status_code
                     for _ in range(main.RATE_LIMIT_LOOKUPS + 1)]
        self.assertEqual(codes[:-1], [200] * main.RATE_LIMIT_LOOKUPS)
        self.assertEqual(codes[-1], 429)

    def test_long_keywords_are_rejected(self):
        res = self.client.post("/api/meta/search", json={"keywords": ["x" * 41]})
        self.assertEqual(res.status_code, 400)

    def test_server_errors_do_not_echo_exception_text(self):
        secret = "https://graph.facebook.com/x?client_secret=SECRET123"
        with mock.patch.object(main, "search_meta_precision_custom", side_effect=RuntimeError(secret)):
            res = self.client.post("/api/meta/search", json={"keywords": ["선크림"]})
        self.assertEqual(res.status_code, 500)
        self.assertNotIn("SECRET123", res.text)

    def test_token_refresh_endpoint_is_gone(self):
        self.assertIn(self.client.post("/api/meta/refresh-token").status_code, (404, 405))


class MetaRenewalTests(unittest.TestCase):
    def test_server_start_checks_the_token_in_the_background(self):
        with mock.patch.object(meta, "check_and_auto_renew_token") as check:
            with TestClient(app):
                pass
        check.assert_called_once()

    def test_renewed_token_is_used_by_later_calls(self):
        ok = mock.Mock(status_code=200)
        ok.json.return_value = {"access_token": "NEW_TOKEN", "expires_in": 5184000}
        with mock.patch.object(meta, "META_ACCESS_TOKEN", "OLD_TOKEN"), \
                mock.patch("app.config.META_APP_ID", "1"), mock.patch("app.config.META_APP_SECRET", "s"), \
                mock.patch("app.config.META_ACCESS_TOKEN", "OLD_TOKEN"), \
                mock.patch.object(meta, "update_env_meta_token"), \
                mock.patch("requests.get", return_value=ok):
            res = meta.refresh_meta_long_lived_token()
            self.assertTrue(res and res["success"])
            self.assertEqual(meta.META_ACCESS_TOKEN, "NEW_TOKEN")

    def test_renewal_errors_do_not_print_secrets(self):
        with mock.patch.object(meta, "META_ACCESS_TOKEN", "TOKEN"), \
                mock.patch("app.config.META_APP_ID", "1"), mock.patch("app.config.META_APP_SECRET", "s"), \
                mock.patch("requests.get", side_effect=RuntimeError("url?client_secret=SECRET123")), \
                mock.patch("builtins.print") as printed:
            self.assertIsNone(meta.refresh_meta_long_lived_token())
        self.assertNotIn("SECRET123", " ".join(str(c) for c in printed.call_args_list))


if __name__ == "__main__":
    unittest.main()
