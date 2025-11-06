import { body } from 'express-validator';
import User from '../model/user_model';
import { forbidExtraFields } from 'helper/validation_helper';

const emailUniqueCheck = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }
};

const allowedCreateUserField = ['name', 'password', 'email', 'role'];
const allowLoginUserField = ['email', 'password'];
const allowRefreshTokenField = ['refreshToken'];
const allowChangePasswordField = ['currentPassword', 'newPassword'];

const createUserValidator = [
  forbidExtraFields(allowedCreateUserField),
  body('name').notEmpty().withMessage('Name is required').bail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one symbol'),

  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .bail()
    .custom(emailUniqueCheck),
  body('role')
    .isIn(['user', 'superadmin'])
    .withMessage('Role must be user or superadmin'),
];

const updateUserValidator = [
  forbidExtraFields(allowedCreateUserField),
  body('name').optional().notEmpty().withMessage('Name is required').bail(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .bail()
    .custom(emailUniqueCheck),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one symbol'),

  body('role')
    .optional()
    .isIn(['user', 'superadmin'])
    .withMessage('Role must be user or superadmin'),
];

const loginUserValidator = [
  forbidExtraFields(allowLoginUserField),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshTokenValidator = [
  forbidExtraFields(allowRefreshTokenField),
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const changePasswordValidator = [
  forbidExtraFields(allowChangePasswordField),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one symbol'),
];

export {
  createUserValidator,
  updateUserValidator,
  loginUserValidator,
  refreshTokenValidator,
};
