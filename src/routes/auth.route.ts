import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { validateObjectId } from '../middlewares/validateObjectId.middleware';
import { auth } from '../middlewares/auth.middleware';

export class AuthRoutes {
  public router = Router();
  private controller = new AuthController()

  constructor() {
    this.init()
  }

  private init() {
    // this.router.get('/', auth, this.controller.testAuth); // testing only
    this.router.post('/login', this.controller.login);
    this.router.get('/abilities', this.controller.getAbilities);
    this.router.get('/roles', this.controller.getRoles);
  }
}