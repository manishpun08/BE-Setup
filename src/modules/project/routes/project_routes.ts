import { authenticateToken, checkRole } from '@middleware/auth';
import express, { NextFunction, Request, Response } from 'express';
import { catchAsync } from 'helper/catch_async';
import { CustomFile, projectImageFile } from 'helper/upload_helper';
import { validateSchema } from 'helper/validation_helper';
import path from 'path';
import ProjectController from '../controller/project_controller';
import { createProjectValidator } from '../validator/project_validator';

const router = express.Router();

// create project, only superadmin
router.post(
  '/create',
  authenticateToken,
  checkRole(['superadmin']),
  projectImageFile,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema(createProjectValidator),
  catchAsync(ProjectController.createNewProject),
);

export default router;
