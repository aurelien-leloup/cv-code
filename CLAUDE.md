# cv-code

Aurélien Leloup's resume as code. Bilingual (EN/FR) single-source CV that builds to HTML and exports to PDF.

## Architecture

- `src/template.html` — single HTML layout with `{{TOKEN}}` placeholders
- `src/content/en.mjs` — English text
- `src/content/fr.mjs` — French text
- `styles/cv.css` — shared stylesheet (both languages)
- `build.mjs` — reads `src/` → writes `dist/CV-{en,fr}.html`
- `export-pdf.mjs` — opens `dist/` in headless Chromium → `export/CV-Aurelien-Leloup-{EN,FR}.pdf`
- `dist/` and `export/` are gitignored

## Hard rules

- **Always edit both `en.mjs` and `fr.mjs`** — any content change must land in both languages. Never commit a mismatch.
- **Keep the token set identical** in `en.mjs` and `fr.mjs`. If you add a new `{{TOKEN}}`, add it to the template and both content files.
- **Single layout** — structural changes go in `src/template.html` only. Do not duplicate layout per language.
- **A4 format is mandatory** for PDF output. Page size: 210mm × 297mm. Verify `@page { size: A4; }` stays in `styles/cv.css` and that `export-pdf.mjs` passes `format: 'A4'` to Playwright's `page.pdf()`.
- **Keep the CV to a single A4 page per language** unless explicitly told otherwise. Check `export/` output after style changes.
- **Print margins** stay consistent between EN and FR — set them in CSS via `@page { margin: ... }`, not per-language.

## Commands

- Install: `npm install` (downloads Chromium)
- Build HTML: `npm run build`
- Build + export PDFs: `npm run export`

Always run `npm run export` after content or style changes and verify both PDFs render correctly on A4.

## Conventions

- Use `{{TOKEN}}` placeholders in `template.html`. Token names are UPPER_SNAKE_CASE.
- Content files export a flat object keyed by token name.
- Keep `cv.css` print-first — screen styles should not break print layout.
- No JavaScript in the rendered CV (HTML + CSS only in `dist/`).
- Do not add runtime dependencies for the CV itself. Build/export tooling only.

## Public artifacts

PDFs are republished on every push to `main` via GitHub Actions at stable URLs:

- EN: `https://github.com/aurelien-leloup/cv-code/releases/latest/download/CV-Aurelien-Leloup-EN.pdf`
- FR: `https://github.com/aurelien-leloup/cv-code/releases/latest/download/CV-Aurelien-Leloup-FR.pdf`

Do not change these filenames without updating the GitHub Actions workflow and any external links.

## When making changes

1. Edit `template.html`, `en.mjs`, `fr.mjs`, or `cv.css` as needed.
2. If adding content: update **both** language files with matching token keys.
3. Run `npm run export`.
4. Open both PDFs and confirm: A4 size, one page each, no overflow, EN/FR parity in structure.
