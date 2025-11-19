import { authenticateToken, checkRole } from '@middleware/auth';
import express, { NextFunction, Request, Response } from 'express';
import { catchAsync } from 'helper/catch_async';
import {
  CustomFile,
  galleryImagesUpload,
  projectImageFile,
} from 'helper/upload_helper';
import { validateSchema } from 'helper/validation_helper';
import path from 'path';
import ProjectController from '../controller/project_controller';
import { createProjectValidator } from '../validator/project_validator';

const router = express.Router();

// create project, only superadmin
// router.post(
//   '/create',
//   // authenticateToken,
//   // checkRole(['superadmin']),
//   projectImageFile,
//   (req: Request, res: Response, next: NextFunction): void => {
//     const files = req.files as { [fieldname: string]: CustomFile[] };
//     if (files['imageurl'] && files['imageurl'].length > 0) {
//       const filename = path.basename(files['imageurl'][0].path);
//       req.body.image = `${process.env.IMAGE_URL}/images/${filename}`;
//     }

//     next();
//   },

//   // validateSchema(createProjectValidator),
//   catchAsync(ProjectController.createNewProject),
// );

router.post(
  '/create',
  galleryImagesUpload,
  (req: Request, res: Response, next: NextFunction): void => {
    console.log(req.files, 'files');
    const files = req.files as { [fieldname: string]: CustomFile[] };
    console.log(files, 'filesfdsfds');
    req.body.image = req.body.image || [];
    if (typeof req.body.image === 'string') {
      try {
        req.body.image = JSON.parse(req.body.image).map(
          (image: string) => image,
        );
      } catch (error) {
        return next(new Error('Invalid JSON input for ourCulture Images'));
      }
    }
    if (files['image']) {
      files['image'].forEach((file) => {
        const imageUrl = `${process.env.IMAGE_URL}/images/${file.filename}`;
        req.body.image.push(imageUrl);
      });
    }
    next();
  },

  catchAsync(ProjectController.createNewProject),
);

// get all projects
router.get('/all-project', ProjectController.getAllProjects);

export default router;
