import { Vital } from '../../../../models/vital.model';
import { CommonVitalsSource } from './common-vitals.source';
import { Patient } from '../../../../models/patient.model';
import * as _ from 'lodash';
import { ZscoreService } from '../../../../shared/services/zscore.service';
import { VitalSourceInterface } from './vital-source.interface';
import { VitalView } from '../vital-view';

export class ZScoreSource extends CommonVitalsSource implements VitalSourceInterface {

  constructor(public model: any | Vital,
    public patient: Patient) {
    super(model, patient);
  }

  public getVitals(ob: any, source?): VitalView {
    const age = this.patient.person.age;
    const zscoreService = new ZscoreService();
    const height = _.find(source.vitalSources, (s) => s && s.name === 'height');
    const weight = _.find(source.vitalSources, (s) => s && s.name === 'weight');
    if (height && weight) {
      const zscore = zscoreService.getZScoreByGenderAndAge(
        this.patient.person.gender,
        this.patient.person.birthdate, new Date(), height.value, weight.value);
      source.addToVitalSource(this.vitalModel.createVital({
        name: 'weightForHeight',
        label: 'Weight for Height:',
        show: !_.isNil(zscore.weightForHeight) && age < 5,
        value: zscore.weightForHeight,
        color: (zscore.weightForHeight < 0) ? 'red' : ''
      }).weightForHeight);

      source.addToVitalSource(this.vitalModel.createVital({
        name: 'heightForAge',
        label: 'Height For Age:',
        show: !_.isNil(zscore.heightForAge) && age < 5,
        value: zscore.heightForAge,
        color: (zscore.heightForAge < 0) ? 'red' : ''
      }).heightForAge);
      source.addToVitalSource(this.vitalModel.createVital({
        name: 'bmiForAge',
        label: 'BMI For Age:',
        show: !_.isNil(zscore.bmiForAge) && age >= 5 && age < 18,
        value: zscore.bmiForAge,
        color: (zscore.bmiForAge) ? 'red' : ''
      }).bmiForAge);
    }

    return undefined;
  }
}
