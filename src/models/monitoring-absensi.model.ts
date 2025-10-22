import { Document, Schema, model } from 'mongoose';

export interface IMonitoringAbsensi extends Document {
  data: {
    absensiMRI: {
      startpoint: string
      endpoint: string
      totalData: number
      lastScanned: string
    }
    absensiMIG: {
      startpoint: string
      endpoint: string
      totalData: number
      lastScanned: string
    }
  }
  misc: {
    dashboard: {
      mysql: {
        connected: boolean
        lastData: string
      }
      mariadb: {
        connected: boolean
        lastData: string
      }
      mongo: {
        connected: boolean
      }
    }
  }
}

const MonitoringAbsensiSchema = new Schema<IMonitoringAbsensi>({
  data: {
    absensiMRI: {
      startpoint: { type: String, default: null },
      endpoint: { type: String, default: null },
      totalData: { type: Number, default: 0 },
      lastScanned: { type: String, default: null }
    },
    absensiMIG: {
      startpoint: { type: String, default: null },
      endpoint: { type: String, default: null },
      totalData: { type: Number, default: 0 },
      lastScanned: { type: String, default: null }
    }
  },
  misc: {
    dashboard: {
      mysql: {
        connected: { type: Boolean, default: false },
        lastData: { type: String, default: null }
      },
      mariadb: {
        connected: { type: Boolean, default: false },
        lastData: { type: String, default: null }
      },
      mongo: {
        connected: { type: Boolean, default: false }
      }
    }
  }
},{
  collection: 'monitoring_absensi',
  timestamp: true
});

export const MonitoringAbsensiModel = model<IMonitoringAbsensi>('MonitoringAbsensi', MonitoringAbsensiSchema);