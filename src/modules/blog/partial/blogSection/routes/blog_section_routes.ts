import { Router } from 'express';
import blog_sectionController from '../controller/blog_section_controller';
import { authenticateToken } from '@middleware/auth';
import { checkValidId, validateSchema } from 'helper/validation_helper';
import { createBlogSectionValidator } from '../validator/blog_section_validator';

const router = Router();

router.post(
  '/',
  authenticateToken,
  validateSchema(createBlogSectionValidator),
  blog_sectionController.create,
);

router.get('/', authenticateToken, blog_sectionController.getAll);

router.get('/:id', authenticateToken, checkValidId, blog_sectionController.getById);

router.put(
  '/:id',
  authenticateToken,
  checkValidId,
  validateSchema(createBlogSectionValidator),
  blog_sectionController.update,
);

router.delete('/:id', authenticateToken, checkValidId, blog_sectionController.delete);

export default router;
