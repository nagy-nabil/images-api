import server from './server.js';
import {
    isFolderStructureExist,
    createFolderStructure
} from './utils/fs/fsprocess.js';
/**
 * function to run the api firstly check if the public folder structure exist to not test it more than one time across the code
 */
async function main(): Promise<void | Error> {
    if (!(await isFolderStructureExist())) {
        await createFolderStructure();
    }
    server.listen(process.env.PORT, () => {
        console.log('listening on', process.env.PORT);
    });
}
await main();
