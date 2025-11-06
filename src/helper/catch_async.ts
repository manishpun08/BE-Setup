import { Request, Response, NextFunction, RequestHandler } from 'express';
export const catchAsync = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error: any) =>
      next(error),
    );
  };
};
