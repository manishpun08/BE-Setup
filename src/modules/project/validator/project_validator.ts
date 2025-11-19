import { body } from 'express-validator';

export const createProjectValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('link').notEmpty().withMessage('Link is required'),
  body('iconLists')
    .isArray({ min: 1 })
    .withMessage('iconLists must be an array with at least one item'),
];

export const updateProjectValidator = [
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('image').optional().notEmpty(),
  body('link').optional().notEmpty(),
  body('iconLists').optional().isArray(),
];
