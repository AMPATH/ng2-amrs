import { Vital } from '../../../../models/vital.model';
import { CommonVitalsSource } from './common-vitals.source';
import { VitalSourceInterface } from './vital-source.interface';
import { Patient } from '../../../../models/patient.model';
import { VitalView } from '../vital-view';
import { VitalsDatasource } from '../vitals.datasource';

export class HivTriageSource extends CommonVitalsSource implements VitalSourceInterface {
  private recursive = false;
  constructor(public model: any | Vital,
              public patient: Patient) {
    super(model, patient);
  }

  public getVitals(ob: any, source?: VitalsDatasource): VitalView {
    // HIV Triage vitals stored in groupmembers property on obs property
    if (this.recursive || ob.concept.uuid === 'a899e6d8-1350-11df-a1f1-0026b9348838') {
      const vitals = ob.groupMembers;
      if (vitals && vitals.length > 0) {
        this.recursive = true;
        for (const vital of vitals) {
          super.getVitals(vital);
          source.addToVitalSource(this.vitalModel[this.vitalModel.model]);
        }
      }
    }
    return undefined;
  }
}
