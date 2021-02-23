import path from 'path';
import puppeteer from 'puppeteer';

import pdfjs from '../util/pdfjs';

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
	await page.goto(`file:///${path.join(process.cwd(), 'static/line-height-transform.html')}`);
});

test('Print to PDF', async () => {
	await page.screenshot({
		path: 'output/line-height-transform.png',
	});
	await page.pdf({
		path: 'output/line-height-transform.pdf',
		width: '11in',
		height: '8.5in',
	});
});

test('Check texts', async () => {
	const pdf = await pdfjs.getDocument({
		url: encodeURI(path.join(process.cwd(), 'output/line-height-transform.pdf')),
		disableFontFace: true,
	}).promise;
	const p = await pdf.getPage(1);
	const textContent = await p.getTextContent();
	const texts = textContent.items.map((item) => item.str);
	expect(texts).toContain('Atlanta');
	expect(texts).toContain('$894,145');
});

test('Close', async () => {
	await page.close();
	await browser.close();
});
