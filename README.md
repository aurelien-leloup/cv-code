# cv-code

Aurélien Leloup's resume as code — bilingual (EN/FR), single layout.

## Structure

```
src/
  template.html        ← HTML layout with {{TOKEN}} placeholders
  content/
    en.mjs             ← English text
    fr.mjs             ← French text
styles/
  cv.css               ← shared stylesheet
avatar.png
build.mjs              ← reads src/ → writes dist/
export-pdf.mjs         ← opens dist/ in headless Chromium → export/*.pdf
```

**Generated (gitignored):**
```
dist/                  ← CV-en.html, CV-fr.html
export/                ← CV-Aurelien-Leloup-EN.pdf, …-FR.pdf
```

## Usage

```bash
npm install        # installs Playwright and downloads Chromium
npm run build      # generates dist/CV-en.html and dist/CV-fr.html
npm run export     # build + export both PDFs to export/
```

## Editing

- **Text / translations** → `src/content/en.mjs` or `src/content/fr.mjs`
- **Layout / structure** → `src/template.html` (one edit, both languages updated)
- **Styles** → `styles/cv.css`
