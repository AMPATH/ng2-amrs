import { Vital } from '../../../../models/vital.model';
import { CommonVitalsSource } from './common-vitals.source';
import { VitalSourceInterface } from './vital-source.interface';
import { Patient } from '../../../../models/patient.model';

export class OncologyTriageSource extends CommonVitalsSource implements VitalSourceInterface {

  constructor(public model: any | Vital,
    public patient: Patient) {
    super(model, patient);
  }

  public getVitals(ob: any) {
    switch (ob.concept.uuid) {
      case 'd54c968d-6f74-4df2-a9dd-20a758597092':
        return this.vitalModel.createVital({
          name: 'ecogPI',
          label: ob.concept.name.display + ':',
          value: this.translateValue(ob.value.uuid)
        });
      case 'a8a6f71a-1350-11df-a1f1-0026b9348838':
        return this.vitalModel.createVital({
          name: 'rr',
          label: 'RR(Breath/Min):',
          value: ob.value
        });
      default:
        return this.vitalModel;
    }
  }

  private translateValue(value) {
    const translation = {
      'a899e7b4-1350-11df-a1f1-0026b9348838': 'Ecog 0 (Normal)',
      '7bbd88f0-39a3-4802-9923-06b762100800': 'Ecog 1',
      'c436e2c7-fd7f-4ed0-a06d-7cbef2733901': 'Ecog 2',
      'f7d5e61f-3307-42b2-9314-9040da12f29a': 'Ecog 3',
      'cc96cdb5-c62b-4d29-805d-3f48d5a285cb': 'Ecog 4'
    };
    return translation[value];
  }
}
