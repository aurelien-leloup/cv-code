import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '..');
const exportDir = resolve(root, 'export');
mkdirSync(exportDir, { recursive: true });

const files = [
  { html: 'dist/CV-en.html', pdf: 'CV-Aurelien-Leloup-EN.pdf' },
  { html: 'dist/CV-fr.html', pdf: 'CV-Aurelien-Leloup-FR.pdf' },
];

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-font-subpixel-positioning'],
});

for (const { html, pdf } of files) {
  const htmlPath = resolve(root, html);
  const pdfPath  = resolve(exportDir, pdf);

  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.pdf({
    path: pdfPath,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await page.close();
  console.log('PDF saved to:', pdfPath);
}

await browser.close();
