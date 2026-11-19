import pytest

from app import main


@pytest.fixture(autouse=True)
def fresh_limits():
    """Each test starts with an empty cache and rate-limit table."""
    main._cache.clear()
    main._lookups.clear()
    yield
