import os from 'os';
import path from 'path';
import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer';

const browserCacheDir = '.local-browser';
const browserProduct = 'chrome';
const browserRevision = '1045629';

function getExecutablePath(): string {
	const platform = os.platform();
	const modulePath = path.resolve(require.resolve('puppeteer'), '../../../..');
	const browserDir = path.join(modulePath, browserCacheDir, browserProduct);
	if (platform === 'win32') {
		return path.join(browserDir, `win64-${browserRevision}`, 'chrome-win', 'chrome.exe');
	}
	if (platform === 'linux') {
		return path.join(browserDir, `linux-${browserRevision}`, 'chrome-linux', 'chrome');
	}
	if (platform === 'darwin') {
		return path.join(browserDir, `darwin-${browserRevision}`, 'chrome-win', 'chrome.exe');
	}

	throw new Error(`${platform} is not supported yet.`);
}

export default function launchBrowser(options?: PuppeteerLaunchOptions): Promise<Browser> {
	const executablePath = getExecutablePath();
	return puppeteer.launch({
		...options,
		executablePath,
	});
}
