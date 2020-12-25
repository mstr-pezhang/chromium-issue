import fs from 'fs';
import util from 'util';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const writeFile = util.promisify(fs.writeFile);

interface ImageDiff {
	differences: number;
	dimension: number;
}

/**
 * Compare two images and generate their diff image
 * @param imageAPath
 * @param imageBPath
 * @param outputPath
 * @return number of mismatched pixels and total pixels
 */
async function compareImage(imageAPath: string, imageBPath: string, outputPath: string): Promise<ImageDiff> {
	const imageA = PNG.sync.read(fs.readFileSync(imageAPath));
	const imageB = PNG.sync.read(fs.readFileSync(imageBPath));

	const { width, height } = imageA;
	const dimension = width * height;

	if (width !== imageB.width || height !== imageB.height) {
		return {
			differences: dimension,
			dimension,
		};
	}

	const diff = new PNG({ width, height });
	const diffNum = pixelmatch(imageA.data, imageB.data, diff.data, width, height, {
		threshold: 0.1,
		diffMask: true,
	});

	if (diffNum > 0) {
		await writeFile(outputPath, PNG.sync.write(diff));
	}

	return {
		differences: diffNum,
		dimension,
	};
}

export default compareImage;
