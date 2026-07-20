# Changelog

## 2026-06-20 — Galerij performance
- Galerijfoto's (MRTN 11–12MB, Wenssexpress ~1.4MB, pexels 1.6MB) omgezet naar WebP (max 1600px, q82) → ~80–240KB per bestand.
- `loading="lazy"` + `decoding="async"` toegevoegd op gallery images in Home.jsx.
- Hero-achtergrond (MRTN1539) en mock.js (pexels) verwijzen nu naar .webp.
- Oude JPG-originelen verwijderd. media/ van 72MB → 22MB.
- Script: /app/frontend/scripts/optimize_gallery.py
