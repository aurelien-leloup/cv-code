import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, '..', 'src', 'linkedin-banner.html');
const exportDir = join(__dirname, '..', 'export');
mkdirSync(exportDir, { recursive: true });

// Both images come from the same source HTML; ?format switches the layout.
const targets = [
  { format: 'linkedin', file: 'linkedin-banner.png', w: 1584, h: 396 },
  { format: 'og', file: 'og-image.png', w: 1200, h: 630 },
];

const baseUrl = pathToFileURL(htmlPath).href;
const browser = await chromium.launch();

for (const { format, file, w, h } of targets) {
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.setViewportSize({ width: w + 120, height: h + 260 });
  const url = format === 'og' ? `${baseUrl}?format=og` : baseUrl;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const outPath = join(exportDir, file);
  await page.locator('#banner').screenshot({ path: outPath });
  await page.close();
  console.log('Wrote', outPath);
}

await browser.close();
