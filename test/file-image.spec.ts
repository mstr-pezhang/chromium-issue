import puppeteer from 'puppeteer';
import express from 'express';

const app = express();
app.use(express.static('static'));
const server = app.listen(3750);

let browser: puppeteer.Browser;
let page: puppeteer.Page;

test('Launch Chrome', async () => {
	browser = await puppeteer.launch({
		args: [
			'--disable-web-security',
		],
	});
});

test('Open a new tab', async () => {
	page = await browser.newPage();
});

test('Open sample page', async () => {
	await Promise.all([
		new Promise<void>(((resolve, reject) => {
			page.on('requestfailed', (req: puppeteer.HTTPRequest) => {
				if (req.url() !== 'file:///Z:/BIN/x64/1.jpg') {
					return;
				}
				const failure = req.failure();
				if (failure && failure.errorText === 'net::ERR_UNKNOWN_URL_SCHEME') {
					reject(new Error(failure.errorText));
				} else {
					resolve();
				}
			});
		})),
		page.goto('http://localhost:3750/file-image.html'),
	]);
});

test('Close', async () => {
	await page.close();
	await browser.close();
	server.close();
});
