import express, { Express, Request, Response } from "express";
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './middlewares/error.middleware';
import { AuthRoutes } from './routes/auth.route';
import { UserRoutes } from "./routes/user.route";
import { TimbanganKomposRoutes } from './routes/timbangan-kompos.route';

export class App {
  public expressApp: Express

  constructor() {
    this.expressApp = express();
    this.initMiddleware();
    this.initRoutes();
    this.initErrorHandling();
  }

  private initMiddleware() {
    this.expressApp.use(cors());
    this.expressApp.use(express.json());
    this.expressApp.use(morgan('dev'));
  }
  private initRoutes() {
    const timbanganKomposRoutes = new TimbanganKomposRoutes();
    const authRoutes = new AuthRoutes();
    const userRoutes = new UserRoutes();

    this.expressApp.get('/', (_req:Request, res:Response) => res.send('MRI Backend ExpressJS'));
    this.expressApp.get('/api/health', (_req:Request, res:Response) => res.send('OK'));

    this.expressApp.use('/api/auth', authRoutes.router);
    this.expressApp.use('/api/user', userRoutes.router);
    this.expressApp.use('/api/timbangan-kompos', timbanganKomposRoutes.router);
    this.expressApp.use(express.static(path.join(__dirname, "../public")));
  }

  private initErrorHandling() {
    this.expressApp.use(errorHandler)
  }
}