import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest, SECRET_KEY } from './../types/auth.types'

export const auth = (_req: Request, res: Response, _next: NextFunction) => {
  const token = _req.header('Authorization')?.replace('Bearer ','');
  if(!token) { return res.status(403).json({ message: 'No Token Provided'}) }

  const decoded = jwt.verify(token, SECRET_KEY);
  if(!decoded) { return res.status(401).json({ message: 'Token invalid' }) }

  (_req as CustomRequest).token = decoded;
  _next();
}