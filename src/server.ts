import express, { Request, Response, NextFunction, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connect } from '@config/database/db';
import { errorHandler } from 'helper/error_helper';
import routes from './routes/index';
import { apiError } from '@utils/response';
import { rateLimiter } from './middleware/rate_limit';
import { logger, morganMiddleware } from '@common/logger';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(morganMiddleware);
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/files', express.static(path.join(__dirname, '../public/files')));

const PORT = process.env.PORT || 3000;

const modelRouter = Router();

modelRouter.get(
  '/model',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { modelName } = req.query;

      if (!modelName || typeof modelName !== 'string') {
        res
          .status(400)
          .json({ error: 'Please provide a valid modelName parameter' });
        return;
      }

      if (!mongoose.modelNames().includes(modelName)) {
        res.status(404).json({ error: `Model '${modelName}' not found` });
        return;
      }

      const model = mongoose.model(modelName) as mongoose.Model<any> & {
        getFieldMetadata?: () => object;
        getTableFields?: () => string[];
        getSingleInstanceState?: () => boolean;
        getViewOnlyFields?: () => boolean;
        getReorderFields?: () => boolean;
        getViewAndEditState?: () => boolean;
        getExportData?: () => boolean;
      };

      const requiredMethods = [
        'getFieldMetadata',
        'getTableFields',
        'getSingleInstanceState',
      ];
      for (const method of requiredMethods) {
        if (typeof model[method as keyof typeof model] !== 'function') {
          res.status(500).json({
            error: `The model '${modelName}' does not implement '${method}'`,
          });
          return;
        }
      }

      const metadata = model.getFieldMetadata!();
      res.status(200).json({
        metadata,
        tableFields: model.getTableFields!() || [],
        singleInstanceState: model.getSingleInstanceState!(),
        viewOnly: model.getViewOnlyFields?.() || false,
        reOrder: model.getReorderFields?.() || false,
        viewAndEditState: model.getViewAndEditState?.() || false,
        exportData: model.getExportData?.() || false,
      });
    } catch (error) {
      next(error);
    }
  },
);

app.use('/api/v1', routes);
app.use('/api/v1', modelRouter);

app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    const errorResponse = await apiError(
      'The request failed due to bad syntax',
      400,
      { explanation: 'This is a JSON parsing issue.' },
    );
    res.status(400).json(errorResponse);
    return;
  }
  next(err);
});

app.use(errorHandler);

app.use(async (req: Request, res: Response) => {
  logger.error(`Route Not Found - ${req.method} ${req.originalUrl}`);

  const errorResponse = await apiError('Route not found', 404, {
    explanation: 'The requested route is not found',
  });
  res.status(404).json(errorResponse);
});

connect()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to the database', err);
    process.exit(1);
  });

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
