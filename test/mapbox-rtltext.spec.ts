import { Browser, Page } from 'puppeteer';
import compare from '../util/compareImage';

import launchBrowser from '../util/launchBrowser';

const exampleUrl = 'https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-rtl-text/';
const baselinePath = 'output/mapbox-rtltext-normal.png';
const targetPath = 'output/mapbox-rtltext-request-interception.png';
const diffPath = 'output/mapbox-rtltext-diff.png';

let browser: Browser;
let page: Page;

test('Launch Chrome', async () => {
	browser = await launchBrowser();
});

test('Open example page', async () => {
	page = await browser.newPage();
	await page.goto(exampleUrl, { waitUntil: 'networkidle0' });
}, 30 * 1000);

test('Take a screenshot', async () => {
	const map = await page.$('#demo');
	await map.screenshot({
		path: baselinePath,
	});
	await page.close();
});

test('Enable request interception', async () => {
	page = await browser.newPage();
	await page.setRequestInterception(true);
	page.on('request', (req) => {
		req.continue();
	});
	await page.goto(exampleUrl, { waitUntil: 'networkidle0' });
}, 30 * 1000);

test('Take a screenshot', async () => {
	const map = await page.$('#demo');
	await map.screenshot({
		path: targetPath,
	});
	await page.close();
});

test('Compare 2 images', async () => {
	const diff = await compare(baselinePath, targetPath, diffPath);
	expect(diff.differences).toBe(0);
	expect(diff.dimension).toBeGreaterThan(0);
});

test('Close', async () => {
	await browser.close();
});
