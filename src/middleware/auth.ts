import { apiError } from '@utils/response';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export interface UserPayload extends JwtPayload {
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json(apiError('Token not found', 401, {}));
    return;
  }

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      res.status(403).json(apiError('Unauthorized', 401, {}));
      return;
    }
    req.user = user as UserPayload;
    next();
  });
};


export const checkRole = (roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json(apiError('Access denied', 401, {}));
      return;
    }
    next();
  };
};
