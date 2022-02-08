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

test('expose a function', async () => {
	await page.exposeFunction('test', () => {
		// do nothing
	});
});

test('Open sample page', async () => {
	await page.setViewport({
		width: 979,
		height: 746,
	});
	await page.goto(`file:///${path.join(process.cwd(), 'static/remove-iframe.html')}`);
});

test('Screenshot', async () => {
	await page.screenshot({
		path: 'output/remove-iframe.png',
	});
});

test('remove <iframe> and call exposed function', async () => {
	await page.evaluate(() => {
		/* global window */
		const remove = Reflect.get(window, 'remove');
		remove();
	});
});

test('Close', async () => {
	await page.close();
	await browser.close();
});
