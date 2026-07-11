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
### 2026-07-11
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
