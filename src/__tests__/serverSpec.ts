import server from '../server.js';
import request from 'supertest';
import { unlink } from 'fs/promises';
import {
    createFolderStructure,
    isFileExist,
    isFolderStructureExist,
    dirContent
} from '../utils/fs/fsprocess.js';
import { FolderNames } from '../types.js';
import { createThumbName } from '../utils/image/imageprocess.js';
import path from 'path';
//pre defined superagent request to use it across the tests
const serverRNN = request(server);
beforeAll(async (): Promise<void> => {
    if (!(await isFolderStructureExist())) {
        await createFolderStructure();
    }
});
describe('test server index is working fine', (): void => {
    it('server is running', async (): Promise<void> => {
        const res = await serverRNN.get('/');
        expect(res.statusCode).toBe(200);
    });
    describe('404 page , error handling', (): void => {
        describe('404 NOT FOUND', (): void => {
            it('any unknown endpoint must respond with 404 not found', async (): Promise<void> => {
                const res = await serverRNN.get('/anythingthatnotendpoint');
                expect(res.text).toEqual('404 NOT FOUND');
                expect(res.statusCode).toBe(404);
            });
        });
        describe('errors, note those end points only available if the ENV in .env file is "dev"', (): void => {
            it('handle any error that happens in endponts and send feedback to the user', async (): Promise<void> => {
                const res = await serverRNN.get('/error');
                expect(res.statusCode).toBe(400);
                expect(res.body.error).toEqual('throw error');
            });
            it('if the error contain Input file is missing send no such file', async (): Promise<void> => {
                const res = await serverRNN.get('/file-error');
                expect(res.statusCode).toBe(400);
                expect(res.body.error).toEqual('no such file');
            });
        });
    });
});
describe('/image endpoint', (): void => {
    describe('send thunmbail with filename width height', (): void => {
        it('if the user didnt supplay filename, width and height throw', async (): Promise<void> => {
            const res = await serverRNN
                .get('/image/')
                .set('Accept', 'application/json');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual(
                'must include file name, width and height'
            );
        });
        it('if the width or the height can not be converted to int', async (): Promise<void> => {
            const res = await serverRNN
                .get('/image/?filename=image&width=jlgh7&height=200')
                .set('Accept', 'application/json');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual(
                'must include file name, width and height'
            );
        });
        it('if the image does not exist 400', async (): Promise<void> => {
            const res = await serverRNN.get(
                '/image/?filename=thisImageNameIsNotInTheFolderDontAddItOrIWillFail&width=200&height=200'
            );
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual('no such file');
        });
        it('if the image exist send it to the user and must be cached in thumbnail folder,NOTE santamonica.jpg must be in full folder', async (): Promise<void> => {
            const res = await serverRNN.get(
                '/image/?filename=santamonica&width=200&height=200'
            );
            // test caching in thumbnail folder
            const flag = await isFileExist(
                FolderNames.THUMBNAIL,
                createThumbName('santamonica', 200, 200)
            );
            expect(res.statusCode).toBe(200);
            expect(flag).toBeTrue();
            //to remove pic from th
            await unlink(
                path.resolve('public/thumbnail/santamonica-200-200.jpg')
            );
        });
    });
    describe('upload images to the server', (): void => {
        it('if no image field 400', async (): Promise<void> => {
            const res = await serverRNN.post('/image');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual(
                'only accept file field called image'
            );
        });
        it('upload one image with status 201 and the image exist in full', async (): Promise<void> => {
            const req = serverRNN.post('/image');
            await req.attach(
                'image',
                path.resolve('src/__tests__/test-image.jpg')
            );
            const res = await req;
            const flag = await isFileExist(FolderNames.FULL, 'test-image.jpg');
            expect(res.statusCode).toBe(201);
            expect(flag).toBeTrue();
            await unlink(path.resolve('public/full/test-image.jpg'));
        });
    });
    describe('get all full dir images names', (): void => {
        it('/image/gallery', async (): Promise<void> => {
            const res = await serverRNN.get('/image/gallery');
            expect(res.statusCode).toBe(200);
            expect(res.body.images).toEqual(await dirContent(FolderNames.FULL));
        });
    });
});
