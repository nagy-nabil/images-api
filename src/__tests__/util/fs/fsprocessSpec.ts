import { isFileExist } from '../../../utils/fs/fsprocess.js';
import { FolderNames } from '../../../types.js';
describe('util/fs/fsprocess', (): void => {
    describe('isFileExist, check if an image already exist is one of the two folders full, thumbnal', (): void => {
        it('if the file doesnt exist return false', async (): Promise<void> => {
            const flag = await isFileExist(
                FolderNames.THUMBNAIL,
                'thisImageNameIsNotInTheFolderDontAddItOrIWillFail.jpg'
            );
            expect(flag).toBeFalse();
        });
        it('if the file  exist return true', async (): Promise<void> => {
            const flag = await isFileExist(FolderNames.FULL, 'santamonica.jpg');
            expect(flag).toBeTrue();
        });
    });
});
