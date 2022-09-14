import { isFileExist } from '../../../utils/fs/fsprocess.js';
import { FolderNames } from '../../../types.js';
describe('util/fs/fsprocess', () => {
    describe('isFileExist, check if an image already exist is one of the two folders full, thumbnal', () => {
        it('if the file doesnt exist return false', async () => {
            const flag = await isFileExist(
                FolderNames.THUMBNAIL,
                'thisImageNameIsNotInTheFolderDontAddItOrIWillFail.jpg'
            );
            expect(flag).toBeFalse();
        });
        it('if the file  exist return true', async () => {
            const flag = await isFileExist(FolderNames.FULL, 'santamonica.jpg');
            expect(flag).toBeTrue();
        });
    });
});
