import sharp from 'sharp';
import path from 'path';
/**
 * function return how do we store the new thumbnail names to make it general throw the code and avoid any typos
 * @param fileName string
 * @param width number
 * @param height number
 * @returns string
 */
export function createThumbName(
    fileName: string,
    width: number,
    height: number
): string {
    return `${fileName}-${width}-${height}.jpg`;
}
/**
 * file name to search with it in the full folder to see if i can process what the user want or not
 * ,,resolve with nothing or reject with error
 * @param fileName string -only the image name not the extension
 * @param width number
 * @param height number
 * @returns promise
 */
export async function imageProcess(
    fileName: string,
    width: number,
    height: number
): Promise<void | Error> {
    try {
        const image = sharp(path.resolve(`public/full/${fileName}.jpg`));
        const info = await image
            .resize(width, height)
            .jpeg()
            .toFile(
                path.resolve(
                    `public/thumbnail/${createThumbName(
                        fileName,
                        width,
                        height
                    )}`
                )
            );
        console.log('info', info);
    } catch (err) {
        console.log('error', err);
        throw err;
    }
}
/**
 *  take file path to image and store it in the full dir
 * @param filePath string complete file path to the image
 * @param fileName the new image name without extension
 * @returns Promise
 */
export async function saveNewIamge(
    filePath: string,
    fileName: string
): Promise<void | Error> {
    try {
        const image = sharp(filePath);
        const info = await image
            .jpeg()
            .toFile(path.resolve(`public/full/${fileName}.jpg`));
        console.log('info', info);
    } catch (err) {
        console.log('error', err);
        throw err;
    }
}
