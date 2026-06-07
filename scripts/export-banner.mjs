import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, '..', 'src', 'linkedin-banner.html');
const exportDir = join(__dirname, '..', 'export');
mkdirSync(exportDir, { recursive: true });
const outPath = join(exportDir, 'linkedin-banner.png');

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.setViewportSize({ width: 1700, height: 640 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const banner = page.locator('#banner');
await banner.screenshot({ path: outPath });

await browser.close();
console.log('Wrote', outPath);
