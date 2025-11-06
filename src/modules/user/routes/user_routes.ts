import { Router } from 'express';
import UserController from '../controller/user_controller';
import {
  changePasswordValidator,
  createUserValidator,
  loginUserValidator,
  refreshTokenValidator,
  updateUserValidator,
} from '../validator/user_validator';
import {
  validateSchema,
  checkValidId,
  createPaginationSchema,
} from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { catchAsync } from 'helper/catch_async';
import { checkSchema } from 'express-validator';

const router = Router();

router.post(
  '/register',
  validateSchema(createUserValidator),
  catchAsync(UserController.createUser),
);

router.post(
  '/login',
  validateSchema(loginUserValidator),
  catchAsync(UserController.loginUser),
);

router.post(
  '/refresh-token',
  validateSchema(refreshTokenValidator),
  catchAsync(UserController.refreshToken),
);

router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema([checkValidId('id'), ...updateUserValidator]),
  catchAsync(UserController.updateUser),
);

router.get(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema([checkValidId('id')]),
  catchAsync(UserController.getUserById),
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema([checkValidId('id')]),
  catchAsync(UserController.deleteUser),
);

router.get(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(checkSchema(createPaginationSchema)),
  catchAsync(UserController.getUsers),
);

router.post(
  '/change-password',
  authenticateToken,
  validateSchema(changePasswordValidator),
  catchAsync(UserController.changePassword),
);

export default router;
