import fs from 'fs/promises';
import path from 'path';
import { FolderNames } from 'src/types.js';
/**
 *  function to check if the image exist or not in two folders[FolderNames]
 * mainly used to check if the image in thumbnail in not search for it in full and process it
 * @param folder string
 * @param name string
 * @returns Promise<boolean>
 */
export async function isFileExist(
    folder: FolderNames,
    name: string
): Promise<boolean> {
    try {
        await fs.access(path.resolve(`public/${folder}/${name}`));
        return true;
    } catch {
        return false;
    }
}
/**
 * check if the folder structure exist [full, thumbnail] , will be helpful if we deployed the server without development images to check if the structure exist if not create it
 * @returns Promise<boolean>
 */
export async function isFolderStructureExist(): Promise<boolean> {
    try {
        await fs.access(path.resolve(`public/full`));
        await fs.access(path.resolve(`public/thumbnail`));
        return true;
    } catch {
        return false;
    }
}
/**
 * function to create folder structure resolve with nothing , if error happend will reject with it
 * ,error will mostly be permission error and with that error tht server can't run from index.ts
 * @returnes Promise
 */
export async function createFolderStructure(): Promise<void> {
    await fs.mkdir(path.resolve('public/full'), { recursive: true });
    await fs.mkdir(path.resolve('public/thumbnail'), { recursive: true });
}
// export async function saveNewImage(path: string, name: string): Promise<void> {
//     await fs.rename(path, name);
// }
