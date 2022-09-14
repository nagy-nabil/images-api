import { unlink } from 'fs/promises';
import path from 'path';
import {
    imageProcess,
    saveNewIamge
} from '../../../utils/image/imageprocess.js';
describe('testing image processing util', (): void => {
    afterAll(async (): Promise<void> => {
        await unlink(path.resolve('public/thumbnail/santamonica-100-231.jpg'));
        await unlink(path.resolve('public/full/newimagename.jpg'));
    });
    describe('imageProcess function', (): void => {
        it('non-exist image must throw[reject]', async (): Promise<void> => {
            await expectAsync(
                imageProcess('notherefile', 100, 231)
            ).toBeRejected();
        });
        it('if exist promise resolve with nothong', async (): Promise<void> => {
            await expectAsync(
                imageProcess('santamonica', 100, 231)
            ).toBeResolved();
        });
    });
    describe('saveNewImage function', (): void => {
        it('if the path does not exist reject with error', async (): Promise<void> => {
            await expectAsync(
                saveNewIamge('notexistfilepath', 'newimagename')
            ).toBeRejected();
        });
        it('if the path  exist resolve with nothing', async (): Promise<void> => {
            await expectAsync(
                saveNewIamge(
                    path.resolve('src/__tests__/test-image.jpg'),
                    'newimagename'
                )
            ).toBeResolved();
        });
    });
});
