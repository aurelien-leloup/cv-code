# cv-code

Aurélien Leloup's resume as code — bilingual EN/FR, exports to PDF via headless Chromium.

**Download:**
- [English PDF](https://github.com/aurelien-leloup/cv-code/releases/latest/download/CV-Aurelien-Leloup-EN.pdf)
- [French PDF](https://github.com/aurelien-leloup/cv-code/releases/latest/download/CV-Aurelien-Leloup-FR.pdf)

PDFs are rebuilt and published automatically on every push to `main`.

## Local usage

```bash
npm install       # installs Playwright + Chromium
npm run export    # builds HTML then exports both PDFs to export/
```

## Editing

| What | Where |
|------|-------|
| Text / translations | `src/content/en.mjs` and `src/content/fr.mjs` |
| Layout | `src/template.html` |
| Styles | `styles/cv.css` |
