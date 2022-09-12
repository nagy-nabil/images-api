import server from './server.js';
import {
    isFolderStructureExist,
    createFolderStructure
} from './utils/fs/fsprocess.js';
async function main(): Promise<void | Error> {
    if (!(await isFolderStructureExist())) {
        await createFolderStructure();
    }
    server.listen(process.env.PORT, () => {
        console.log('listening on', process.env.PORT);
    });
}
await main();
