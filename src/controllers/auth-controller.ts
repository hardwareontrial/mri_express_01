import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth-service';

export class AuthController {
  private service = new AuthService();

  public getAbilities = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents = await this.service.findAllAbilityRules();
      res.json(documents)
    } catch (error) {
      _next(error)
    }
  }

  public getRoles = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents = await this.service.findAllRoles();
      res.json(documents)
    } catch (error) {
      _next(error)
    }
  }

  public login = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const response = await this.service.login(username, password);
      res.json(response);
    } catch (error) {
      if(error instanceof Error) { _next({ status: 500, message: error?.message }) }
      _next(error)
    }
  }
}