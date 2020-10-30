import LabAdapter from './lab-adapter';

export class VLAdapter extends LabAdapter {
  constructor(labResults, patientUuid) {
    super(labResults);
    this.patientUuid = patientUuid;
  }

  getLabResults() {
    return Promise.all(
      this.results.map((result) =>
        this.mapResult(this.transformLabResult(result))
      )
    );
  }

  mapResult(result) {
    const valid = this.payloadFormatter.checkStatusOfViralLoad(result);
    if (valid === 1) {
      return this.payloadFormatter.convertViralLoadPayloadToRestConsumableObs(
        result,
        this.patientUuid
      );
    } else if (valid === 0) {
      return this.payloadFormatter.convertViralLoadWithLessThanToRestConsumableObs(
        result,
        this.patientUuid
      );
    } else if (valid === 2) {
      return this.payloadFormatter.convertViralLoadExceptionToRestConsumableObs(
        result,
        this.patientUuid
      );
    }
  }
}
