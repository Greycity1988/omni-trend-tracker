"""Wording and helpers shared by the platform services."""
import hashlib
import random

# Shown on a card whose numbers are simulated, so nobody reads them as measurements.
EXAMPLE_METRIC_LABEL = "데이터 상태"
EXAMPLE_METRIC_VALUE = "예시 데이터 · 실제 수치 아님"


def example_rng(keyword: str, salt: str) -> random.Random:
    """Random source for example data that gives the same curve for the same keyword.

    Built-in hash() is salted per process, so example values used to change on every restart.
    """
    digest = hashlib.sha256(f"{salt}:{keyword}".encode("utf-8")).digest()
    return random.Random(int.from_bytes(digest[:8], "big"))
