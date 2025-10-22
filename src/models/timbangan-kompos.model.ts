import { Document, model, Schema } from 'mongoose';
import { Log, ITimbanganKompos, CustomerRow, NopolRow, OperatorRow, ProductRow } from './../types/timbangan-kompos.types'

const CustomerSchema = new Schema<CustomerRow>({
  customer: { type: String, default: '' }
},{
  timestamps: false,
  collection: 'timbangan_kompos_customer'
});

const NopolSchema = new Schema<NopolRow>({
  nopol: { type: String, default: '' },
  weight: { type: Number, default: 0 },
},{
  timestamps: false,
  collection: 'timbangan_kompos_nopol'
});

const OperatorSchema = new Schema<OperatorRow>({
  operator: { type: String, default: '' }
},{
  timestamps: false,
  collection: 'timbangan_kompos_operator'
});

const ProductSchema = new Schema<ProductRow>({
  product: { type: String, default: '' }
},{
  timestamps: false,
  collection: 'timbangan_kompos_product'
});

const LogSchema = new Schema<Log>({
  text: { type: String, default: '' },
  timestamp: { type: String, default: '' },
},{
  _id: false
});

const TimbanganKomposSchema = new Schema<ITimbanganKompos>({
  vehicle_number: { type: String, default: '' },
  document_number: { type: String, default: '' },
  operator: { type: String, default: '' },
  customer: { type: String, default: '' },
  product: { type: String, default: '' },
  send_to: { type: String, default: '' },
  note: { type: String, default: '' },
  print_count: { type: Number, default: 0 },
  scaling_1_value: { type: Number, default: 0 },
  scaling_1_type: { type: String, default: '' },
  scaling_1_datetime: { type: String, default: '' },
  scaling_2_value: { type: Number, default: 0 },
  scaling_2_type: { type: String, default: '' },
  scaling_2_datetime: { type: String, default: '' },
  correction_doc_number: [{ type: String }],
  sync_status: { type: Number, default: 0 },
  sync_datetime: { type: String, default: '' },
  revision_stat: { type: Boolean, default: false },
  created_by: { type: String, default: '' },
  logs: [LogSchema],
  created_at: { type: String, default: '' },
  updated_at: { type: String, default: '' },
},{
  timestamps: false,
  collection: 'timbangan_kompos'
});

export const TimbanganKomposModel = model<ITimbanganKompos>('TimbanganKompos', TimbanganKomposSchema);
export const TimbanganKomposNopolModel = model<NopolRow>('TimbanganKomposNopol', NopolSchema);
export const TimbanganKomposOperatorModel = model<OperatorRow>('TimbanganKomposOperator', OperatorSchema);
export const TimbanganKomposCustomerModel = model<CustomerRow>('TimbanganKomposCustomer', CustomerSchema);
export const TimbanganKomposProductModel = model<ProductRow>('TimbanganKomposProduct', ProductSchema);