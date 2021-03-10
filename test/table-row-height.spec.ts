import path from 'path';
import puppeteer from 'puppeteer';

let browser: puppeteer.Browser;
let page: puppeteer.Page;

test('Launch Chrome', async () => {
	browser = await puppeteer.launch();
});

test('Open a new tab', async () => {
	page = await browser.newPage();
});

test('Open sample page', async () => {
	await page.setViewport({
		width: 979,
		height: 746,
	});
	await page.goto(`file:///${path.join(process.cwd(), 'static/table-row-height.html')}`);
});

test('Print to PDF', async () => {
	await page.screenshot({
		path: 'output/table-row-height.png',
	});
	await page.pdf({
		path: 'output/table-row-height.pdf',
		width: '11in',
		height: '8.5in',
		printBackground: true,
	});
});

test('Table height should be < 687px', async () => {
	const height = await page.evaluate(() => {
		// eslint-disable-next-line no-undef
		const [table] = document.getElementsByTagName('table');
		return table.getBoundingClientRect().height;
	});
	expect(height).toBeLessThan(687);
});

test('Close', async () => {
	await page.close();
	await browser.close();
});
