/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import pdfjs from 'pdfjs-dist';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			ReadableStream: any;
		}
	}
}

if (!global.ReadableStream) {
	const { ReadableStream } = require('web-streams-polyfill');
	global.ReadableStream = ReadableStream;
}

if (!Reflect.get(Promise, 'allSettled')) {
	const allSettled = require('promise.allsettled');
	allSettled.shim();
}

export default pdfjs;
