# AYOFixIt — Computer & Mobile Repair in Tenerife

Website of **AYOFixIt**, the one-man repair workshop of Ayoze Pérez: computers, laptops, phones and tablets, island-wide across Tenerife.

![AYOFixIt — home page](docs/screenshot.png)

## What it is

A static, eleven-page marketing site in English. Plain HTML, one stylesheet of our own and a handful of vanilla-JS files — **no build step, no bundler, no framework, no dependencies to install**. The markup began as a commercial HTML template and was stripped down to what this site actually uses.

- **Nothing to deploy, anywhere to deploy it.** Every link, asset and canonical is relative, so the same files work from a domain root, from a subfolder or straight off `file://`. The three files that cannot be relative (`sitemap.xml`, `robots.txt`, `llms.txt`) get their absolute URLs stamped by `tools/set-domain.py`.
- **One third-party request:** Google Fonts (Onest). Everything else — video, icons, images, jQuery, GSAP, Lenis, Swiper — is served from the repository. No analytics, no cookies, no embeds.
- **Scroll motion on a single timeline.** Lenis drives the scroll, GSAP `ScrollTrigger` drives everything that reacts to it: per-character heading reveals via `SplitText` with `scrub`, a lateral `clipPath` wipe on photos, and the section entrances. The whole block sits behind a `prefers-reduced-motion: reduce` guard.
- **Each page loads only what it uses.** Swiper ships with the home page alone, Bootstrap's JS only where there is an accordion, counterUp and Waypoints only where there is a counter. About, contact and 404 pull five scripts; the home page, thirteen.
- **Self-hosted hero video** with `playsinline` plus a small retry loop, because iOS refuses to autoplay in low power mode and after a bfcache restore.
- **Custom cursor only where there is a cursor.** The pointer effect is gated behind `(hover: hover) and (pointer: fine)`, so it never appears on a touch screen.
- **SEO.** A JSON-LD `@graph` per page (`WebSite`, `LocalBusiness` with the eight Facebook reviews and their aggregate rating, `WebPage`, and `FAQPage` on the pages that answer questions), relative canonicals, `sitemap.xml` and an `llms.txt` descriptor.
- **No forms, no backend.** Every call to action is a WhatsApp deep link, a `tel:` or a `mailto:`.

## Layout

```
index.html              # home: hero video, services, testimonials, FAQ
about.html              # faqs.html, contact.html, 404.html
services/index.html     # the services listing
services/<service>.html # computer-hardware, battery-replacement, custom-pc-builds,
                        # laptop-screen-replacement, software-troubleshooting
css/custom.css          # the site's own stylesheet (theme CSS, pruned)
css/bootstrap.min.css   # grid and utilities
css/all.min.css         # Font Awesome
css/swiper-bundle.min.css · slicknav.min.css · mousecursor.css
js/function.js          # all of this site's behaviour: menu, slider, counters,
                        # scroll choreography, hero video
js/lenis.min.js         # smooth scroll
js/gsap.min.js · ScrollTrigger.min.js · SplitText.min.js
js/jquery-3.7.1.min.js · bootstrap.min.js · jquery.slicknav.js ·
js/swiper-bundle.min.js · jquery.waypoints.min.js · jquery.counterup.min.js ·
js/magiccursor.js
images/                 # photography, service shots, icons, favicons, open graph
images/reviews/         # avatars of the eight Facebook reviewers
videos/hero-video-1.mp4 # hero background
tools/set-domain.py     # stamps the live domain into the absolute-URL files
sitemap.xml · robots.txt · llms.txt
docs/screenshot.png     # the image at the top of this file
```

## Running it locally

No install, no build. Opening `index.html` in a browser works, and so does a server if you prefer one:

```bash
python3 -m http.server 8080
```

URLs keep their `.html`, so nothing needs a host that resolves extensionless paths.

## Publishing

Upload the repository as-is. Before the first publish, stamp the domain:

```bash
python3 tools/set-domain.py https://tudominio.com
```

That rewrites the canonical and `og:` tags of all eleven pages, `sitemap.xml`, the `Sitemap:` line in `robots.txt` and the links in `llms.txt`, deriving each page's path on its own (`services/index.html` → `/services/`). Re-run it whenever the site moves; it replaces whatever domain is in there now.

If the site lives in a subfolder, pass the full base (`https://host/projects/ayofixit`) — the pages work either way, the stamped files need the whole prefix.

**The share image is the one tag that breaks on a move.** Crawlers do not resolve a relative `og:image`, so it needs a host that stays put:

```bash
python3 tools/set-domain.py --image https://host-estable/open-graph.jpg
```

That touches only `og:image` and `twitter:image` and leaves the rest relative.

## Things that will bite you

- **Never `gsap.from()` with a ScrollTrigger here.** A `from()` tween re-applies its starting state on every `ScrollTrigger.refresh()`, which strands elements at `autoAlpha: 0` — photos and whole sections silently stop rendering. Use `gsap.set()` followed by `gsap.to()`, as `js/function.js` does throughout.
- **Nothing may depend on the native scroll event.** Lenis replaces it. WOW.js used to animate the `.wow` sections and broke exactly this way; those entrances now run through ScrollTrigger, and the `.wow` class survives only as a hook.
- **`prefers-reduced-motion` is a real code path**, not a nicety: `.reveal` figures start at `visibility: hidden` in CSS, so that branch has to make them visible or the photos never appear.
- **A host behind HTTP basic auth kills every social preview.** Facebook, WhatsApp and the meta validators fetch the page anonymously; a `401` reads to them as a broken `og:image`, with no hint about the real cause.
