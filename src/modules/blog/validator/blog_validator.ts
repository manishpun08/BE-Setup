import { check } from 'express-validator';
import Blog from '../model/blog_model';
import { forbidExtraFields } from 'helper/validation_helper';
const allowedBlogFields = [
  'title',
  'slug',
  'description',
  'category',
  'type',
  'image',
  'metaTitle',
  'metaDescription',
  'ogTitle',
  'ogDescription',
  'canonicalUrl',
];

export const blogValidationRules = [
  forbidExtraFields(allowedBlogFields),
  check('title').notEmpty().withMessage('Title is required'),
  check('image.url').notEmpty().withMessage('Image is required').bail(),
  check('image.title')
    .optional()
    .isString()
    .withMessage('Image title must be a string')
    .bail(),
  check('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i)
    .withMessage(
      'Slug must not contain spaces and may only contain letters, and hyphens',
    )
    .custom(async (slug) => {
      const existing = await Blog.findOne({ slug });
      if (existing) {
        throw new Error('Slug already exists');
      }
      return true;
    }),
  check('image.alt')
    .optional()
    .isString()
    .withMessage('Image alt text must be a string')
    .bail(),
  check('image.caption')
    .optional()
    .isString()
    .withMessage('Image caption must be a string')
    .bail(),
  check('description').notEmpty().withMessage('Description is required'),
  check('category').notEmpty().withMessage('Category is required'),
  check('type')
    .optional()
    .isIn(['feature', 'new'])
    .withMessage('Type should be either "feature" or "new"'),
];

export const blogUpdateValidationRules = [
  forbidExtraFields(allowedBlogFields),
  check('title').optional().notEmpty().withMessage('Title is required'),
  check('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i)
    .withMessage(
      'Slug must not contain spaces and may only contain letters, numbers and hyphens',
    )
    .custom(async (slug, { req }) => {
      const blogId = req.params?.id;
      const existing = await Blog.findOne({ slug });
      if (
        existing &&
        typeof (existing as any)._id !== 'undefined' &&
        (existing as any)._id.toString() !== blogId
      ) {
        throw new Error('Slug already exists');
      }

      return true;
    }),
  check('image.url')
    .optional()
    .notEmpty()
    .withMessage('Image is required')
    .bail(),
  check('image.title')
    .optional()
    .isString()
    .withMessage('Image title must be a string')
    .bail(),
  check('image.alt')
    .optional()
    .isString()
    .withMessage('Image alt text must be a string')
    .bail(),
  check('image.caption')
    .optional()
    .isString()
    .withMessage('Image caption must be a string')
    .bail(),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Description is required'),
  check('category').optional().notEmpty().withMessage('Category is required'),
  check('type')
    .optional()
    .isIn(['feature', 'new'])
    .withMessage('Type should be either "feature" or "new"'),
];

export const blogCommentValidator = [
  check('comment').notEmpty().withMessage('Comment is required'),
  check('name').notEmpty().withMessage('Name is required'),
  check('email').notEmpty().withMessage('Email is required'),
];
