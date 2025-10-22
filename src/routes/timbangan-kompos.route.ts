import { Request, Response, Router } from 'express';
import { TimbanganKomposController } from '../controllers/timbangan_kompos-controller';
import { validateObjectId } from './../middlewares/validateObjectId.middleware';

export class TimbanganKomposRoutes {
  public router = Router();
  private controller = new TimbanganKomposController();

  constructor() {
    this.init()
  }

  private init() {
    this.router.get('/', this.controller.findAll);
    this.router.post('/', this.controller.create);
    this.router.get('/:_id/detail', this.controller.findById);
    this.router.put('/:_id/update', this.controller.update);
    this.router.get('/number', this.controller.createNumber);
    this.router.get('/customers', this.controller.customers);
    this.router.get('/nopols', this.controller.nopols);
    this.router.get('/products', this.controller.products);
    this.router.get('/operators',this.controller.operators);
    this.router.post('/customer', this.controller.createCustomer);
    this.router.post('/vehicle', this.controller.createVehicle);
    this.router.post('/product', this.controller.createProduct);
    this.router.post('/operator',this.controller.createOperator);
    this.router.put('/customer/:_id', validateObjectId, this.controller.updateCustomer);
    this.router.put('/vehicle/:_id', validateObjectId, this.controller.updateVehicle);
    this.router.put('/product/:_id', validateObjectId, this.controller.updateProduct);
    this.router.put('/operator/:_id', validateObjectId, this.controller.updateOperator);
  }
}