import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error] ${err?.message}`);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message, ...(process.env.NODE_DEV === 'development' ? { stack: err.stack } : {}) });
}