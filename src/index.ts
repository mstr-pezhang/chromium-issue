import * as puppeteer from 'puppeteer';

(async function main(): Promise<void> {
	const browser = await puppeteer.launch();
	await browser.close();
}());
