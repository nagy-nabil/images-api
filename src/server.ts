import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import imageRouter from './utils/image/image.router.js';
const server = express();
//middlewares for absic config for the server
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
//middleware to log any server action
server.use(morgan('dev'));
//controller for main page
server.get('/', (req, res) => {
    res.send('welcome');
});
//middleware to serve images from public [i will serve two folders full and thumbnail] if the user supplied query contain image width and size =>serve the image from thumbnail
//if the user didn't supply query serve from full
//full
server.use('/image', express.static(path.resolve('public/full')));
//serve thumbnail and handle new uploads
server.use('/image', imageRouter);
//! only for testing
server.get('/file-error', (req, res) => {
    throw new Error(
        'if the error include Input file is missing send  no such file'
    );
});
server.get('/error', (req, res) => {
    throw new Error('throw error');
});
//! middleware to catch any errors were thrown in any of the middlewares or any controller
server.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        let errMsg = err.message;
        if (err.message.includes('Input file is missing'))
            errMsg = 'no such file';
        res.status(400).json({ error: errMsg });
    }
);
//! if the server reached this middleware without matching any endpoint means that point doesn't exist [404]
server.use((req, res) => {
    res.status(404).send('404 NOT FOUND');
});
export default server;
