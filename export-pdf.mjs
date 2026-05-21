import { chromium } from 'playwright';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, 'CV-en.html');
const exportDir = resolve(__dirname, 'export');
const pdfPath = resolve(exportDir, 'CV-Aurelien-Leloup.pdf');

mkdirSync(exportDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);
await page.waitForLoadState('networkidle');

// Give fonts time to load
await page.waitForTimeout(1000);

await page.pdf({
  path: pdfPath,
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

await browser.close();
console.log('PDF saved to:', pdfPath);
