import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import formidable from 'formidable';
import { saveNewIamge, createThumbName, imageProcess } from './imageprocess.js';
import { FolderNames } from '../../types.js';
import { isFileExist, dirContent } from '../fs/fsprocess.js';
const imageRouter = Router();
//controller for uploading images as [multipart/form-data] with formidable
function uploadImage(req: Request, res: Response, next: NextFunction): void {
    const uploadedForm = formidable({
        multiples: true,
        maxFileSize: 50 * 1024 * 1024,
        filename: (name, _, __, ___) => {
            return name;
        }
    }); //max 5mb
    uploadedForm.parse(req, async (err: Error, _, files): Promise<void> => {
        if (err) return next(err);
        if (!('image' in files)) {
            next(new Error('only accept file field called image'));
            return;
        }
        //*files is an object, its keys are the fields name sent by the user , our application accept the images under the name image
        const uploadedImages = files.image;
        //type gurd to deal if the user send more than one image
        if (Array.isArray(uploadedImages)) {
            uploadedImages.forEach(async (image: formidable.File) => {
                await saveNewIamge(image.filepath, image.newFilename);
            });
        } else {
            await saveNewIamge(
                uploadedImages.filepath,
                uploadedImages.newFilename
            );
        }
        res.status(201).end();
        return;
    });
    return;
}
//controller to serve thumbnails
async function sendThumbnail(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { filename, width, height } = req.query;
        if (
            !filename ||
            !width ||
            !height ||
            typeof filename !== 'string' ||
            typeof width !== 'string' ||
            typeof height !== 'string' ||
            isNaN(+width) ||
            isNaN(+height)
        )
            throw new Error('must include file name, width and height');
        const thumbname = createThumbName(filename, +width, +height);
        //if exist means i processed this image before and i just need to serve it
        const exist = await isFileExist(FolderNames.THUMBNAIL, thumbname);
        if (!exist) {
            // if image process didn't throw means the thumname has been created successfully and can send it back
            await imageProcess(filename, +width, +height);
        }
        res.sendFile(path.resolve(`public/thumbnail/${thumbname}`));
    } catch (err) {
        next(err);
    }
}
// end point send all images names from full dir to the front end to create gallery
async function alreadyExistImages(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const files = await dirContent(FolderNames.FULL);
        res.status(200).json({ images: files });
    } catch (err) {
        next(err);
        return;
    }
}
//mount the controller over the end points
imageRouter.route('').post(uploadImage).get(sendThumbnail);
imageRouter.get('/gallery', alreadyExistImages);
export default imageRouter;
