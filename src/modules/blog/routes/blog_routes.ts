import express, { Request, Response, NextFunction } from 'express';
import BlogController from '../controller/blog_controller';
import { authenticateToken, checkRole } from '@middleware/auth';
import { blogImageFile, CustomFile } from 'helper/upload_helper';
import {
  createPaginationSchema,
  validateSchema,
} from 'helper/validation_helper';
import { catchAsync } from 'helper/catch_async';

import {
  blogCommentValidator,
  blogUpdateValidationRules,
  blogValidationRules,
} from '../validator/blog_validator';
import path from 'path';
import { checkSchema } from 'express-validator';
import { tr } from 'date-fns/locale';

const router = express.Router();

// create blog, only superadmin
router.post(
  '/create',
  authenticateToken,
  checkRole(['superadmin']),
  blogImageFile,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema(blogValidationRules),
  catchAsync(BlogController.createNewBlog),
);

// get all blogs
router.get(
  '/',
  validateSchema(checkSchema(createPaginationSchema)),
  catchAsync(BlogController.getBlogs),
);

// get single blog by slug
router.get('/:slug', catchAsync(BlogController.getBlog));

// update blog, only superadmin
router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  blogImageFile,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    next();
  },
  validateSchema(blogUpdateValidationRules),
  catchAsync(BlogController.updateExistingBlog),
);

// delete blog, only superadmin
router.delete('/:id', catchAsync(BlogController.deleteBlogPost));

// get trending blogs
router.get(
  '/trending',
  validateSchema(checkSchema(createPaginationSchema)),
  catchAsync(BlogController.getTrendingBlogs),
);

// get latest blogs
router.get(
  '/latest',
  validateSchema(checkSchema(createPaginationSchema)),
  catchAsync(BlogController.getLatestBlogs),
);

// favorite a blog post
router.post('/:slug/favorite', catchAsync(BlogController.favoriteBlogPost));

// add comment to a blog post
router.post(
  '/:slug/comment',
  validateSchema(blogCommentValidator),
  catchAsync(BlogController.addBlogComment),
);

export default router;
