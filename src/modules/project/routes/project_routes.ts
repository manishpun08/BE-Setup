import express, { NextFunction, Request, Response } from 'express';
import { catchAsync } from 'helper/catch_async';
import { CustomFile, projectImageFile } from 'helper/upload_helper';
import { validateSchema } from 'helper/validation_helper';
import path from 'path';
import ProjectController from '../controller/project_controller';
import { createProjectValidator } from '../validator/project_validator';
import { authenticateToken, checkRole } from '@middleware/auth';

const router = express.Router();

// create project, only superadmin
router.post(
  '/create',
  authenticateToken,
  checkRole(['superadmin']),
  projectImageFile,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };

    // Process main project image
    if (files['image'] && files['image'].length > 0) {
      const filename = path.basename(files['image'][0].path);
      req.body.image = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    // Process icon images
    req.body.iconImages = [];
    if (files['iconImages'] && files['iconImages'].length > 0) {
      req.body.iconImages = files['iconImages'].map((file) => {
        const filename = path.basename(file.path);
        return `${process.env.IMAGE_URL}/images/${filename}`;
      });
    }

    next();
  },

  validateSchema(createProjectValidator),
  catchAsync(ProjectController.createNewProject),
);

// get all projects
router.get('/all-project', ProjectController.getAllProjects);

// get project by id
router.get('/:id', ProjectController.getProjectById);

// update project by id
router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  ProjectController.updateProjectById,
);

// delete project by id
router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  ProjectController.deleteProjectById,
);

export default router;
