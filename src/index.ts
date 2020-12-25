import * as puppeteer from 'puppeteer';
import * as express from 'express';

const app = express();
app.use(express.static('static'));
const server = app.listen(3750);

(async function main(): Promise<void> {
	console.log('Launch Chrome');
	const browser = await puppeteer.launch();

	console.log('Open a new tab');
	const page = await browser.newPage();

	console.log('Open sample page');
	await page.setViewport({
		width: 979,
		height: 746,
	});
	await page.goto('http://localhost:3750');

	await page.setRequestInterception(true);

	page.on('request', (req) => {
		console.log(`Request: ${req.url()}`);
		req.continue();
	});

	page.on('requestfailed', (req) => {
		console.log(`Request Failed: ${req.url()}`);
	});

	page.on('requestfinished', (req) => {
		console.log(`Request Finished: ${req.url()}`);
	});

	console.log('Wait for 5s');
	await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

	console.log('Print to PDF');
	await page.pdf({
		path: 'dist/webfont.pdf',
		width: '11in',
		height: '8.5in',
		margin: {
			top: '0.25in',
			bottom: '0.25in',
			left: '0.3in',
			right: '0.3in',
		},
	});

	console.log('Close Chrome');
	await page.close();
	await browser.close();

	server.close();
}());
