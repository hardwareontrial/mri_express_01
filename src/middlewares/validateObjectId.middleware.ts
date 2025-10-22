import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const validateObjectId = (_req: Request, res: Response, _next: NextFunction) => {
  // console.log(_req)
  const id = _req.params.id;
  const ObjectId = new mongoose.Types.ObjectId(id);

  if(!mongoose.Types.ObjectId.isValid(ObjectId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  _next();
}