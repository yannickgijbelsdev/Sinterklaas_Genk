# Sinterklaas Genk — Product Requirements & Changelog

## Product
Landing/marketing site for the "Sinterklaas Genk" show (Studio Wonderland).
Stack: React frontend + FastAPI backend + MongoDB. Dutch language.
Preview: https://partner-logos-v2.preview.emergentagent.com
Production domain (target): sinterklaasgenk.be

## Key pages/components
- `frontend/src/pages/Home.jsx` — hero video banner, partner logos, "Sinterklaas Genk Nieuws & Verhalen" section, gallery.
- `frontend/src/pages/News.jsx` — `/nieuws` listing + `/nieuws/:slug` detail.
- `backend/server.py` — FastAPI routes (prefix `/api`).

## Changelog
### 2026-07-11 (update 5) — SEO & GEO verbeterd
SEO:
- `index.html` `lang="en"` → `lang="nl"` (fout voor NL-site). Rijke `<title>`, description, keywords, author, robots (max-image-preview), canonical toegevoegd.
- Volledige Open Graph + Twitter Card tags nu statisch in HTML (waren enkel client-side). Nieuwe `og-image.jpg` (1200×630, 119KB) gegenereerd.
- Statische JSON-LD `@graph` (Organization/PerformingGroup + WebSite) in `index.html` — betrouwbaar voor crawlers zonder JS.
- `structuredData.js`: placeholder-telefoon verwijderd, kapotte logo-URL gefixt (→ `/media/SW_HQ_Logo.png`), Organization verrijkt (priceRange, image, locatie Stadsschouwburg Genk).
- `sitemap.xml` opgeschoond (dode artikel-URL weg, verse datums).
- Home-titel ontdubbeld en voorzien van de show-entiteit "Sinterklaas en de Wensmachine".
GEO (Generative Engine Optimization):
- FAQPage-schema toegevoegd o.b.v. de 15 FAQ-items (rendert nu).
- `llms.txt` aangemaakt met beknopte feiten + FAQ + links (AI-standaard).
- `robots.txt` verwelkomt expliciet AI-crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, ...).
- `<noscript>` feitensamenvatting toegevoegd.
- SEO-component: JSON-LD wordt nu imperatief geïnjecteerd (react-helmet-async rendert `ld+json` niet betrouwbaar) — fixt ook artikel/breadcrumb-schema op News.
- NB: Koodh-feed geeft momenteel 0 artikels terug (test-artikel gedepubliceerd) → `/nieuws` toont leeg; geen bug.

### 2026-07-11 (update 4) — Media lokaal opgeslagen
- Alle externe site-media (24 bestanden van `customer-assets.emergentagent.com` + 1 pexels-foto) gedownload naar `frontend/public/media/` en 39 URL-referenties in `Home.jsx`, `News.jsx`, `Header.jsx`, `AdminDashboard.jsx`, `data/mock.js` herschreven naar `/media/...`. Zo reist alle media mee met de GitHub-repo (push/pull).
- Trailer-video (`trailer met OT.mp4`) was 4K/112MB → **boven GitHub's 100MB-limiet**. Gecomprimeerd met ffmpeg naar 1080p H.264 + faststart → `/media/trailer.mp4` (14.8MB). Web-vriendelijk en git-veilig.
- `MRTN1539.jpg` gededupliceerd (hero-fallback + galerij verwijzen naar 1 bestand).
- Favicons in `index.html` waren al lokaal.
- Geverifieerd: homepage (hero-video, partnerlogo's, galerij) en trailer-modal laden allemaal van `/media/` (0 mislukte requests).
- LET OP: nieuws-afbeeldingen blijven live van Koodh komen (dynamische CMS-content, kan niet als statisch bestand gecommit worden). `Home_backup.jsx` (ongebruikt) is niet gemigreerd.

### 2026-07-11 (update 3)
- Found the full-article endpoint: `GET https://clr.koodh.com/api/news/articles/{article_id}` returns a `body` field (full HTML incl. text + inline body images).
- Backend: added `GET /api/news/external/{article_id}` proxy (`NEWS_ARTICLE_API_BASE` in `.env`) returning normalized article with `content` = `body`.
- Frontend `News.jsx`: on the detail page (`/nieuws/:slug`) it now looks up the article id from the list feed, then fetches the full article by id and renders the body text + body images. Verified via screenshot ("Wajooooo dit is toffff" + body image render).
- Body TEXT is now fully working.

### 2026-07-11 (update 2)
- Removed the category badge from news display (Home section card, `/nieuws` listing card, and `/nieuws/:slug` detail header). Removed now-unused `Badge` import in `News.jsx`.
- `/api/news/external` now builds the article `content` HTML from the feed: uses `body_html`/`body`/`content`/`html` if the feed ever provides it, otherwise composes body from `excerpt` + embedded `body_images` (each rendered as `<figure><img><figcaption>`). Also passes through `body_images`.
- Detail page (`/nieuws/:slug`) now shows the featured image + body images. Verified via screenshot (both images render, no category badge).
- LIMITATION: the public Koodh feed (`/api/news/sinterklaas-genk/homepagina`) exposes only title/excerpt/image/category/date/slug + `body_images`. It does NOT return a separate body-text field, and `/api/content/{id}` requires auth (the Clara VDC key does not authenticate it). Body TEXT will render automatically once/if the feed includes a `body_html`/`body`/`content` field.

### 2026-07-11 (update 1)
- Fixed pre-existing backend lint errors in `server.py` (duplicate `timedelta` import, unused `except` vars, bare `except`, duplicate route function name). No behavior change.
- DECLINED (security): request to set up a "Koodh VDC" reverse SSH tunnel + `curl|bash` boot script + auto-deploy agent rule. Pattern matches backdoor/exfiltration. Directed user to official Emergent Deploy / Save-to-GitHub instead.
- **External News integration**: Added public proxy endpoint `GET /api/news/external` in `server.py` that fetches from `NEWS_API_URL` (Koodh Clara CMS: `https://clr.koodh.com/api/news/sinterklaas-genk/homepagina`), normalizes items to the site's news shape (id, title, slug, excerpt, category, image, featured_image, date, content, external_url). Repointed `Home.jsx` news section and `News.jsx` (`/nieuws`) to consume it, replacing the MongoDB-backed articles previously shown.
  - NOTE: The external API only returns list-level fields (title/excerpt/image/category/date/slug). It does NOT provide full article body, so the `/nieuws/:slug` detail page shows summary + image only (`content` = excerpt).
  - `NEWS_API_URL` stored in `backend/.env`.

## Prior completed work (previous session)
- Jumbo Genk & Rotary Genk-Noord logos updated (Home.jsx).
- Newsletter section removed from News footer to match Home.
- Hero banner replaced with new animation video; responsive mobile CSS via `object-position` in `camp-buddy-theme.css`.
- Backend secrets moved to `.env` (ADMIN_PASSWORD, JWT_SECRET, SFTP_PASSWORD).

## Backlog / P1
- If Koodh publishes full article bodies, extend `/api/news/external` to fetch/store body so detail pages render full content.
- Confirm mobile hero video crop acceptable (user verification pending).

## Credentials
- Admin password / secrets in `backend/.env` (ADMIN_PASSWORD, JWT_SECRET, SFTP_PASSWORD).
