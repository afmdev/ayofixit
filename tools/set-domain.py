#!/usr/bin/env python3
"""Stamp the live domain into the files that cannot use relative urls.

The site itself is domain independent: links, assets, canonicals and the
structured data are all relative, so it runs from any host or subfolder.
Three things still need an absolute url to be valid - sitemap.xml, the
Sitemap line in robots.txt and the links in llms.txt - plus the share
image, which some crawlers refuse to resolve relatively.

    python3 tools/set-domain.py https://midominio.com

Re-run it with a different domain whenever the site moves; it rewrites
whatever domain is in there now.

The share image is the one tag that breaks when the site moves: crawlers
do not resolve a relative og:image, so it needs a host that stays put.
Point it at one and the pages keep working from any location:

    python3 tools/set-domain.py --image https://host-que-no-se-mueve/img.jpg
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(ROOT.glob("*.html")) + sorted((ROOT / "services").glob("*.html"))
ABS_URL = re.compile(r'https?://[^/"\s]+')


def url_path(page):
    """Public path of a page, e.g. services/index.html -> /services/"""
    rel = page.relative_to(ROOT).as_posix()
    return "/" + (rel[: -len("index.html")] if rel.endswith("index.html") else rel)


def stamp_image(url):
    """Only the share image goes absolute; everything else stays relative."""
    for page in PAGES:
        s = page.read_text(encoding="utf-8")
        s = re.sub(r'<meta property="og:image" content="[^"]*">',
                   f'<meta property="og:image" content="{url}">', s)
        s = re.sub(r'<meta name="twitter:image" content="[^"]*">',
                   f'<meta name="twitter:image" content="{url}">', s)
        page.write_text(s, encoding="utf-8")
    print(f"share image set to {url} in {len(PAGES)} pages, everything else left relative")


def stamp(domain):
    for page in PAGES:
        s = page.read_text(encoding="utf-8")
        here = domain + url_path(page)
        img = domain + "/images/open-graph.jpg"

        s = re.sub(r'<link rel="canonical" href="[^"]*">',
                   f'<link rel="canonical" href="{here}">', s)
        s = re.sub(r'<meta property="og:image" content="[^"]*">',
                   f'<meta property="og:image" content="{img}">', s)
        s = re.sub(r'<meta name="twitter:image" content="[^"]*">',
                   f'<meta name="twitter:image" content="{img}">', s)
        # og:url was dropped for the relative build, put it back next to og:locale
        if "og:url" not in s:
            s = s.replace('\t<meta property="og:title"',
                          f'\t<meta property="og:url" content="{here}">\n\t<meta property="og:title"', 1)
        else:
            s = re.sub(r'<meta property="og:url" content="[^"]*">',
                       f'<meta property="og:url" content="{here}">', s)
        page.write_text(s, encoding="utf-8")

    for name in ("sitemap.xml", "robots.txt", "llms.txt"):
        f = ROOT / name
        if f.exists():
            f.write_text(ABS_URL.sub(domain, f.read_text(encoding="utf-8")), encoding="utf-8")

    print(f"stamped {domain} into {len(PAGES)} pages, sitemap.xml, robots.txt and llms.txt")


def main():
    args = sys.argv[1:]
    if args[:1] == ["--image"] and len(args) == 2 and args[1].startswith("http"):
        stamp_image(args[1])
    elif len(args) == 1 and args[0].startswith("http"):
        stamp(args[0].rstrip("/"))
    else:
        sys.exit("usage: python3 tools/set-domain.py https://midominio.com\n"
                 "       python3 tools/set-domain.py --image https://host/imagen.jpg")


if __name__ == "__main__":
    main()
