import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { Request, Response } from 'express';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator: (req: Request): string => {
    const ip = ipKeyGenerator(req.ip || '127.0.0.1');
    return `${ip}-${req.headers['user-agent']}`;
  },
  handler: (request: Request, response: Response): void => {
    response.status(429).json({
      status: 429,
      error: 'Too Many Requests',
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(15 * 60),
    });
  },
  skip: (req: Request): boolean => {
    const trustedIPs = ['127.0.0.1', 'YOUR_TRUSTED_IP'];
    const ip = ipKeyGenerator(req.ip || '127.0.0.1');
    return trustedIPs.includes(ip);
  },
});
