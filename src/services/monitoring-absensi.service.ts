import moment from 'moment-timezone';
import { MonitoringAbsensiModel, IMonitoringAbsensi } from './../models/monitoring-absensi.model'

export class MonitoringAbsensiService {
  public async init() {
    let existing = await MonitoringAbsensiModel.findOne();
    if(!existing) {
      existing = new MonitoringAbsensiModel();
      await existing.save();
    }

    return existing;
  }

  public async getData() {
    return MonitoringAbsensiModel.findOne();
  }

  public async updateField(path, value) {
    return MonitoringAbsensiModel.findOneAndUpdate({},
      { $set: { [path]: value } },
      { new: true }
    )
  }

  public async resetData() {
    await MonitoringAbsensiModel.deleteMany({});
    return await this.init();
  }

  public async exportToTxtCsv (isFull: boolean, dataArray, filename: string) {
    function formatV1(array) {
      return array.map(obj => `${obj.pin || obj.nik}, ${moment(obj.scan_date).format('DD/MM/YYYY HH:mm')}`).join('\n')
    }
    //
  }

  public async exportXls(isFull, dataArray, filename, startDatetime, endDatetime) {}
}