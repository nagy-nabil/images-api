import server from '../server.js';
import request from 'supertest';
import { unlink } from 'fs/promises';
import { isFileExist } from '../utils/fs/fsprocess.js';
import { FolderNames } from '../types.js';
import { createThumbName } from '../utils/image/imageprocess.js';
import path from 'path';
const serverRNN = request(server);
describe('test server index is working fine', () => {
    it('server is running', async () => {
        const res = await serverRNN.get('/');
        expect(res.statusCode).toBe(200);
    });
    describe('404 page , error handling', () => {
        describe('404 NOT FOUND', () => {
            it('any unknown endpoint must respond with 404 not found', async () => {
                const res = await serverRNN.get('/anythingthatnotendpoint');
                expect(res.text).toEqual('404 NOT FOUND');
                expect(res.statusCode).toBe(404);
            });
        });
        describe('errors, note those end points only available if the ENV in .env file is "dev"', () => {
            it('handle any error that happens in endponts and send feedback to the user', async () => {
                const res = await serverRNN.get('/error');
                expect(res.statusCode).toBe(400);
                expect(res.body.error).toEqual('throw error');
            });
            it('if the error contain Input file is missing send no such file', async () => {
                const res = await serverRNN.get('/file-error');
                expect(res.statusCode).toBe(400);
                expect(res.body.error).toEqual('no such file');
            });
        });
    });
});
describe('/image endpoint', () => {
    describe('send thunmbail with filename width height', () => {
        it('if the user didnt supplay filename, width and height throw', async () => {
            const res = await serverRNN
                .get('/image/')
                .set('Accept', 'application/json');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual(
                'must include file name, width and height'
            );
        });
        it('if the width or the height can not be converted to int', async () => {
            const res = await serverRNN
                .get('/image/?filename=image&width=jlgh7&height=200')
                .set('Accept', 'application/json');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual(
                'must include file name, width and height'
            );
        });
        it('if the image does not exist 400', async () => {
            const res = await serverRNN.get(
                '/image/?filename=thisImageNameIsNotInTheFolderDontAddItOrIWillFail&width=200&height=200'
            );
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual('no such file');
        });
        it('if the image exist send it to the user and must be cached in thumbnail folder', async () => {
            const res = await serverRNN.get(
                '/image/?filename=santamonica&width=200&height=200'
            );
            const flag = await isFileExist(
                FolderNames.THUMBNAIL,
                createThumbName('santamonica', 200, 200)
            );
            expect(res.statusCode).toBe(200);
            expect(flag).toBeTrue();
            await unlink(
                path.resolve('public/thumbnail/santamonica-200-200.jpg')
            );
        });
    });
    describe('upload images to the server', () => {
        it('if no image field 400', async () => {
            const res = await serverRNN.post('/image');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toEqual(
                'only accept file field called image'
            );
        });
        it('upload one image with status 201 and the image exist in full', async () => {
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
        //     describe('upload more than one image with status 201 and the images exist in full', () => {
        //         const arr = ['test-image.jpg', 'test-image-2.jpg'];
        //         it('fds', async () => {
        //             const req = serverRNN
        //                 .post('/image')
        //                 .attach(
        //                     'image',
        //                     path.resolve(`src/__tests__/test-image.jpg`)
        //                 )
        //                 .attach(
        //                     'image',
        //                     path.resolve(`src/__tests__/test-image-2.jpg`)
        //                 );
        //             const res = await req;
        //             expect(res.statusCode).toBe(201);
        //             const flag =
        //                 (await isFileExist(FolderNames.FULL, 'test-image.jpg')) &&
        //                 (await isFileExist(FolderNames.FULL, 'test-image-2.jpg'));
        //             expect(flag).toBeTrue();
        //         });
        //     });
    });
});
