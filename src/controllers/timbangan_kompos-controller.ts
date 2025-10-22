import { Request, Response, NextFunction } from 'express';
import { TimbanganKomposService } from './../services/timbangan_kompos-service';
import { ITimbanganKompos, ResponseTimbanganKompos } from '../types/timbangan-kompos.types';

export class TimbanganKomposController {
  private service = new TimbanganKomposService();

  public customers = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents = await this.service.findAllCustomer();
      res.json(documents);
    } catch (e) {
      _next(e);
    }
  };

  public nopols = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents = await this.service.findAllNopol();
      res.json(documents);
    } catch (e) {
      _next(e);
    }
  };

  public products = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents = await this.service.findAllProduct();
      res.json(documents);
    } catch (e) {
      _next(e);
    }
  };
  
  public operators = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents = await this.service.findAllOperator();
      res.json(documents);
    } catch (e:any) {
      console.log(e)
      _next(e);
    }
  };

  public findAll = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const documents: ResponseTimbanganKompos[] = await this.service.findAll();
      res.json(documents);
    } catch (e) {
      _next(e);
    }
  };

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      let document_number: string = '';
      let updatedFormData: any = null;
      const isRevision = req.body['isRevision'];
      let formData = req.body['formData'];
      const _id = formData['_id'];

      if(isRevision) {
        document_number = await this.service.createDocNumber(isRevision);
        delete formData['_id'];
        formData['document_number'] = document_number;
        formData['correction_doc_number'] = [];
        formData['print_count'] = 0;
        formData['sync_status'] = 0;
        formData['sync_datetime'] = '';
      }

      const responseCreate = await this.service.create(formData);

      if(_id) {
        updatedFormData = await this.service.findById(_id);
        if(updatedFormData.length) {
          let correction_doc_number = updatedFormData[0]['correction_doc_number'];
          let new_correction_doc_number = [document_number, ...correction_doc_number]

          updatedFormData[0]['correction_doc_number'] = new_correction_doc_number;
          updatedFormData[0]['revision_stat'] = isRevision;

        }
        
        await this.service.update(_id, updatedFormData[0]);
      }

      res.json(responseCreate);
    } catch (e) {
      console.error(e)
      _next(e);
    }
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { _id, formData } = req.body;
      const updated = await this.service.update(_id, formData);
      res.json(updated)
    } catch (error) {
      _next(error)
    }
  };

  public findById = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const document = await this.service.findById(req.params._id);
      res.json(document);
    } catch (error) {
      _next(error)
    }
  };

  public createCustomer = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const row = req.body;
      const created = await this.service.createCustomer(row);
      res.json(created);
    } catch (e) {
      _next(e);
    }
  };

  public createProduct = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const row = req.body;
      const created = await this.service.createProduct(row);
      res.json(created);
    } catch (e) {
      _next(e);
    }
  };

  public createOperator = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const row = req.body;
      const created = await this.service.createOperator(row);
      res.json(created);
    } catch (e) {
      _next(e);
    }
  };

  public createVehicle = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const row = req.body;
      const created = await this.service.createVehicle(row);
      res.json(created);
    } catch (e) {
      _next(e);
    }
  };

  public createNumber = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const number = await this.service.createDocNumber(true);
      res.json(number);
    } catch (error) {
      _next(error);
    }
  };

  public updateCustomer = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const _id = req.params._id;
      const updated = await this.service.updateCustomer(_id, req.body)
      res.json(updated);
    } catch (error) {
      _next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const _id = req.params._id;
      const updated = await this.service.updateProduct(_id, req.body)
      res.json(updated);
    } catch (error) {
      _next(error);
    }
  };

  public updateVehicle = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const _id = req.params._id;
      const updated = await this.service.updateVehicle(_id, req.body)
      res.json(updated);
    } catch (error) {
      _next(error);
    }
  };

  public updateOperator = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const _id = req.params._id;
      const updated = await this.service.updateOperator(_id, req.body)
      res.json(updated);
    } catch (error) {
      _next(error);
    }
  };
}