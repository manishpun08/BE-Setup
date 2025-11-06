import { Request, Response, NextFunction } from 'express';
import {
  validationResult,
  ValidationChain,
  param,
  body,
  Schema,
} from 'express-validator';
import mongoose from 'mongoose';

type ErrorDetail = {
  message: string;
  errors: any[];
  statusCode: number;
};

const error = async (
  message: string,
  statusCode: number,
  errors: any[],
): Promise<ErrorDetail> => {
  return {
    message,
    statusCode,
    errors,
  };
};

const validateSchema = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const validationError = await error(
      'The request failed due to a validation problem',
      422,
      errors.array(),
    );

    res.status(422).json(validationError);
  };
};

const checkValidId = (field: string) => {
  return param(field)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid ID format');
};

const forbidExtraFields = (allowedFields: string[]): ValidationChain => {
  return body().custom((value, { req }) => {
    const extraFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key),
    );

    if (extraFields.length > 0) {
      throw new Error(`Invalid fields: ${extraFields.join(', ')}`);
    }

    return true;
  });
};
const createPaginationSchema: Schema = {
  perPage: {
    in: ['params', 'query'],
    optional: {
      options: { nullable: true, checkFalsy: true },
    },
    isInt: {
      bail: true,
      options: { min: 1 },
      errorMessage: 'Per page should be positive number.',
    },
  },
  page: {
    in: ['params', 'query'],
    optional: {
      options: { nullable: true, checkFalsy: true },
    },
    isInt: {
      bail: true,
      options: { min: 1 },
      errorMessage: 'Page number should be positive number.',
    },
  },
  id: {
    in: ['params', 'query'],
    optional: {
      options: { nullable: true, checkFalsy: true },
    },
    isMongoId: {
      bail: true,
      errorMessage: 'Id should be object id.',
    },
  },
};

export {
  validateSchema,
  checkValidId,
  forbidExtraFields,
  createPaginationSchema,
};
