import { Request, Response, NextFunction } from 'express';
import { UserServices } from '../services/user-service';

export class UserControllers {
  private services = new UserServices();

  public getUsers = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents = await this.services.findAllUsers();
      res.json(documents);
    } catch (error) {
      _next(error)
    }
  } 

  public getUserById = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const document = await this.services.getUserById(id);
      res.json(document)
    } catch (error) {
      _next(error)
    }
  }
}
