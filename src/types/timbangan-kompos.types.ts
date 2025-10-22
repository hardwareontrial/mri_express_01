import { Document } from 'mongoose';

export interface Log {
  text: string
  timestamp: string
}

export interface ITimbanganKompos extends Document {
  vehicle_number: string
  document_number: string
  operator: string
  customer: string
  product: string
  send_to: string
  note: string
  print_count: number
  scaling_1_value: number
  scaling_1_type: string
  scaling_1_datetime: string
  scaling_2_value: number
  scaling_2_type: string
  scaling_2_datetime: string
  correction_doc_number: string[]
  sync_status: number
  sync_datetime: string
  revision_stat: boolean
  created_by: string
  logs: Log[]
  created_at: string
  updated_at: string
}

export interface ResponseTimbanganKompos extends ITimbanganKompos {
  bruto?: number
  bruto_timestamp?: string
  tare?: number
  tare_timestamp?: string
  netto?: number
  correction_doc_details?: ResponseTimbanganKompos[]
}

export interface CustomerRow extends Document {
  customer: string
}

export interface NopolRow extends Document {
  nopol: string
  weight: number
}

export interface OperatorRow extends Document {
  operator: string;
}

export interface ProductRow extends Document {
  product: string;
}