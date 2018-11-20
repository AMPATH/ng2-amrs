import LabAdapter from './lab-adapter';

export class VLAdapter extends LabAdapter {
  
  constructor (labResults, patientUuid) {
    super(labResults);
    this.patientUuid = patientUuid;
  }
  
  getLabResults () {
    return Promise.all(this.results.map((result) => this.mapResult(this.transformLabResult(result))));
  }
  
  mapResult (result) {
    return this.payloadFormatter.convertViralLoadPayloadToRestConsumableObs(result, this.patientUuid);
  }
}