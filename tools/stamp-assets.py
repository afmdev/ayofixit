#!/usr/bin/env python3
"""Stamp a version on every local asset url so they can be cached for a year.

The filenames carry no hash, so a long cache would leave returning visitors
stuck with the old css until it expired. This adds ?v=<commit> to the css,
js, image and video urls at deploy time: same files, new urls on every
deploy, so `immutable` is safe.

    python3 tools/stamp-assets.py           # usa el commit actual
    python3 tools/stamp-assets.py 20261019  # o la version que le pases

It runs in CI over the checkout, not over the repo you work in: the stamped
urls are never committed. Running it twice is harmless, the old stamp is
replaced.
"""

import os
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSET = r'(?:css|js|images|videos)/[^"\'()?\s]+\.(?:css|js|jpg|jpeg|png|webp|svg|mp4)'
# href="css/x.css", src="/js/x.js", url('../images/x.webp') - con o sin sello
IN_HTML = re.compile(r'((?:href|src|content)=")((?:\.\./|/)?%s)(?:\?v=[^"]*)?(")' % ASSET)
IN_CSS = re.compile(r'(url\([\'"]?)((?:\.\./|/)?%s)(?:\?v=[^\'")]*)?([\'"]?\))' % ASSET)


def version():
    if len(sys.argv) > 1:
        return sys.argv[1]
    sha = os.environ.get("GITHUB_SHA")
    if not sha:
        sha = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT,
                             capture_output=True, text=True).stdout.strip()
    return sha[:8] or "dev"


def main():
    v = version()
    files = [p for p in ROOT.rglob("*.html") if "node_modules" not in p.parts]
    files += [p for p in (ROOT / "css").glob("*.css")]
    stamped = 0
    for page in files:
        s = page.read_text(encoding="utf-8")
        pattern = IN_CSS if page.suffix == ".css" else IN_HTML
        new, n = pattern.subn(lambda m: f"{m.group(1)}{m.group(2)}?v={v}{m.group(3)}", s)
        if n:
            page.write_text(new, encoding="utf-8")
            stamped += n
    print(f"{stamped} urls selladas con ?v={v} en {len(files)} archivos")


if __name__ == "__main__":
    main()
