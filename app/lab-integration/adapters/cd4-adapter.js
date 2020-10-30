import LabAdapter from './lab-adapter';

export class CD4Adapter extends LabAdapter {
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
    const cd4PanelHasValidData = this.payloadFormatter.cd4PanelHasValidData(
      result
    );
    const cd4PanelHasErrors = this.payloadFormatter.cd4PanelHasErrors(result);
    if (cd4PanelHasValidData) {
      return this.payloadFormatter.convertCD4PayloadTORestConsumableObs(
        result,
        this.patientUuid
      );
    }
    if (cd4PanelHasErrors) {
      return this.payloadFormatter.convertCD4ExceptionTORestConsumableObs(
        result,
        this.patientUuid
      );
    }
  }
}
