import { Router } from 'express';
import { UserControllers } from '../controllers/user-controller';
import { validateObjectId } from './../middlewares/validateObjectId.middleware';

export class UserRoutes {
  public router = Router();
  private controller = new UserControllers()

  constructor() {
    this.init()
  }

  private init() {
    this.router.get('/', this.controller.getUsers);
    this.router.get('/:id', validateObjectId, this.controller.getUserById);
  }
}