#!/bin/bash
# Publish the built frontend to the gh-pages branch: site files only, nothing else from the repo.
#
#   scripts/deploy_pages.sh          build and show what would be published (nothing is pushed)
#   scripts/deploy_pages.sh --push   build, check, and push to origin/gh-pages
#
# Builds from a clean checkout only, so what goes out is exactly a commit on this branch.
set -euo pipefail

BASE_PATH="/omni-trend-tracker/"
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Commit or discard changes first." >&2
  exit 1
fi

SOURCE_COMMIT="$(git rev-parse --short HEAD)"
(cd frontend && rm -rf dist && npm run build -- --base="$BASE_PATH" >/dev/null)
DIST="$ROOT/frontend/dist"

# Only web files may go out. Anything else (env files, source maps, keys, docs) stops the deploy.
BAD="$(cd "$DIST" && find . -type f ! \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.svg' \
  -o -name '*.png' -o -name '*.jpg' -o -name '*.webp' -o -name '*.ico' -o -name '*.woff2' \) -print)"
if [ -n "$BAD" ]; then
  echo "Unexpected files in the build, not publishing:" >&2
  echo "$BAD" >&2
  exit 1
fi
if grep -rIlE 'ghp_[A-Za-z0-9]{20,}|github_pat_|EAA[A-Za-z0-9]{30,}|pina_[A-Za-z0-9]{20,}|PRIVATE KEY-----|NAVER_CLIENT_SECRET|META_ACCESS_TOKEN' "$DIST" >/dev/null; then
  echo "Build contains a token-like string or key name, not publishing." >&2
  exit 1
fi

echo "Site files built from $SOURCE_COMMIT:"
(cd "$DIST" && find . -type f | sort | sed 's|^\./|  |')

git fetch -q origin gh-pages
PARENT="$(git rev-parse origin/gh-pages)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
# A throwaway index whose work tree is dist/, so the commit holds the site files and nothing else.
export GIT_INDEX_FILE="$TMP/index"
GIT_DIR="$(git rev-parse --git-dir)" GIT_WORK_TREE="$DIST" git -C "$DIST" add -A -f .
TREE="$(git write-tree)"
unset GIT_INDEX_FILE
if [ "$TREE" = "$(git rev-parse "$PARENT^{tree}")" ]; then
  echo "gh-pages already has these exact files. Nothing to publish."
  exit 0
fi
COMMIT="$(git commit-tree "$TREE" -p "$PARENT" -m "deploy: site built from $SOURCE_COMMIT")"
echo "Prepared gh-pages commit $(git rev-parse --short "$COMMIT") on top of $(git rev-parse --short "$PARENT")."

if [ "${1:-}" != "--push" ]; then
  echo "Dry run. Re-run with --push to publish."
  exit 0
fi
# Plain fast-forward push: refuses if gh-pages moved since the fetch above.
git push origin "$COMMIT:refs/heads/gh-pages"
echo "Published. https://greycity1988.github.io/omni-trend-tracker/"
