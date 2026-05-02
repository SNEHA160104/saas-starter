import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // RFC 7807 Problem Details
  res.status(status).json({
    type: 'about:blank',
    title: message,
    status,
    detail: err.detail || message,
    instance: req.originalUrl,
  });
};
