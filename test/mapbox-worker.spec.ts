import puppeteer from 'puppeteer';
import compare from '../util/compareImage';

const exampleUrl = 'https://docs.mapbox.com/mapbox-gl-js/api/';
const baselinePath = 'output/mapbox-worker-normal.png';
const targetPath = 'output/mapbox-worker-request-interception.png';
const diffPath = 'output/mapbox-worker-diff.png';

let browser: puppeteer.Browser;
let page: puppeteer.Page;

test('Launch Chrome', async () => {
	browser = await puppeteer.launch();
});

test('Enable request interception', async () => {
	page = await browser.newPage();
	await page.setRequestInterception(true);
	page.on('request', (req) => {
		req.continue();
	});
});

test('Open example page', async () => {
	await page.goto(exampleUrl, { waitUntil: 'networkidle0' });
}, 30 * 1000);

test('Wait for 10s', (done) => {
	setTimeout(done, 10 * 1000);
}, 15 * 1000);

test('Take a screenshot', async () => {
	const map = await page.$('#demo');
	await map.screenshot({
		path: targetPath,
	});
	await page.close();
});

test('Open example page', async () => {
	page = await browser.newPage();
	await page.goto(exampleUrl, { waitUntil: 'networkidle0' });
}, 30 * 1000);

test('Wait for 10s', (done) => {
	setTimeout(done, 10 * 1000);
}, 15 * 1000);

test('Take a screenshot', async () => {
	const map = await page.$('#demo');
	await map.screenshot({
		path: baselinePath,
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
