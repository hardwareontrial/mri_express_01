import moment from 'moment-timezone';
import { Types } from 'mongoose'
import {
  TimbanganKomposCustomerModel, TimbanganKomposNopolModel, TimbanganKomposProductModel, 
  TimbanganKomposOperatorModel, TimbanganKomposModel
} from '../models/timbangan-kompos.model'
import { CustomerRow, NopolRow, ProductRow, OperatorRow, ITimbanganKompos } from '../types/timbangan-kompos.types'

export class TimbanganKomposService {
  public async findAllCustomer() {
    return TimbanganKomposCustomerModel.find().lean();
  };

  public async findAllNopol() {
    return TimbanganKomposNopolModel.find().lean();
  };

  public async findAllProduct() {
    return TimbanganKomposProductModel.find().lean();
  };

  public async findAllOperator() {
    return TimbanganKomposOperatorModel.find().lean();
  };

  public async findAll() {
    return await TimbanganKomposModel.aggregate([
      {
        $lookup: {
          from: "timbangan_kompos",
          let: {
            correctionNumbers: "$correction_doc_number"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$document_number", "$$correctionNumbers"]
                }
              }
            }
          ],
          as: "correction_doc_details"
        }
      },
      {
        $addFields: {
          bruto: {
            $cond: {
              if: { $eq: ["$scaling_1_type", "timbang-in"] },
              then: "$scaling_1_value",
              else: "$scaling_2_value"
            }
          },
          tare: {
            $cond: {
              if: { $eq: ["$scaling_1_type", "timbang-out"] },
              then: "$scaling_1_value",
              else: "$scaling_2_value"
            }
          }
        }
      },
      {
        $addFields: {
          netto: {
            $subtract: ["$bruto", "$tare"]
          }
        }
      }
    ])
  };

  public async create(data: Partial<ITimbanganKompos>) {
    const result = new TimbanganKomposModel(data);
    return result.save();
  };

  public async update(_id: string, data: Partial<ITimbanganKompos>) {
    const objectID = new Types.ObjectId(_id);
    const { revision_stat, correction_doc_number, print_count } = data;
    await TimbanganKomposModel.updateOne(
      { _id: objectID },
      { $set: {
          print_count: print_count,
          revision_stat: revision_stat,
          correction_doc_number: correction_doc_number,
          updated_at: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
        }
      },
      { upsert: false }
    );
    return await this.findById(_id);
  };

  public async findById(_id: string) {
    const objectID = new Types.ObjectId(_id);
    return await TimbanganKomposModel.aggregate([
      { $match: { _id: objectID } },
      {
        $lookup: {
          from: "timbangan_kompos",
          let: {
            correctionNumbers: "$correction_doc_number"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$document_number", "$$correctionNumbers"]
                }
              }
            }
          ],
          as: "correction_doc_details"
        }
      },
      {
        $addFields: {
          bruto: {
            $cond: {
              if: { $eq: ["$scaling_1_type", "timbang-in"] },
              then: "$scaling_1_value",
              else: "$scaling_2_value"
            }
          },
          bruto_timestamp: {
            $cond: {
              if: { $eq: ["$scaling_1_type", "timbang-in"] },
              then: "$scaling_1_datetime",
              else: "$scaling_2_datetime"
            }
          },
          tare: {
            $cond: {
              if: { $eq: ["$scaling_1_type", "timbang-out"] },
              then: "$scaling_1_value",
              else: "$scaling_2_value"
            }
          },
          tare_timestamp: {
            $cond: {
              if: { $eq: ["$scaling_1_type", "timbang-out"] },
              then: "$scaling_1_datetime",
              else: "$scaling_2_datetime"
            }
          },
        }
      },
      {
        $addFields: {
          netto: {
            $subtract: ["$bruto", "$tare"]
          }
        }
      }
    ])
  };

  public async createCustomer(data: Partial<CustomerRow>) {
    const result = new TimbanganKomposCustomerModel(data);
    return result.save();
  };

  public async createProduct(data: Partial<ProductRow>) {
    const result = new TimbanganKomposProductModel(data);
    return result.save();
  };

  public async createVehicle(data: Partial<NopolRow>) {
    const result = new TimbanganKomposNopolModel(data);
    return result.save();
  };

  public async createOperator(data: Partial<OperatorRow>) {
    const result = new TimbanganKomposOperatorModel(data);
    return result.save();
  };

  public async createDocNumber(isRevision: boolean = false) {
    try {
      const prefix = isRevision ? 'B-' : 'A-';
      const document = await TimbanganKomposModel.findOne(
        { document_number: { $regex: '^' + prefix } }
      ).sort({ document_number: -1 });

      let startNumber = 1000;
      if(document) {
        const parts = document.document_number.split('-');
        if(parts.length === 2 && !isNaN(Number(parts[1]))) {
          startNumber = Number(parts[1]);
        }
      }
      const newNumber = `${prefix}${startNumber +1}`;
      return newNumber;
    } catch (e) {
      throw e;
    }
  };

  public async updateCustomer(_id: string, data: Partial<CustomerRow>) {
    const update = await TimbanganKomposCustomerModel.updateOne(
      { _id: _id },
      { 
        $set: {
          customer: data.customer
        }
      },
      { upsert: false }
    );

    return await TimbanganKomposCustomerModel.findById(_id);
  };

  public async updateProduct(_id: string, data: Partial<ProductRow>) {
    const update = await TimbanganKomposProductModel.updateOne(
      { _id: _id },
      { 
        $set: {
          product: data.product
        }
      },
      { upsert: false }
    );

    return await TimbanganKomposProductModel.findById(_id);
  };

  public async updateOperator(_id: string, data: Partial<OperatorRow>) {
    const update = await TimbanganKomposOperatorModel.updateOne(
      { _id: _id },
      { 
        $set: {
          operator: data.operator
        }
      },
      { upsert: false }
    );

    return await TimbanganKomposOperatorModel.findById(_id);
  };

  public async updateVehicle(_id: string, data: Partial<NopolRow>) {
    const update = await TimbanganKomposNopolModel.updateOne(
      { _id: _id },
      { 
        $set: {
          nopol: data.nopol,
          weight: data.weight
        }
      },
      { upsert: false }
    );

    return await TimbanganKomposNopolModel.findById(_id);
  };
}