
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { VitalsResourceService } from '../../../etl-api/vitals-resource.service';
import { ZscoreService } from '../../../shared/services/zscore.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
@Injectable()
export class PatientVitalsService {

   private limit: number = 10;

  constructor(private vitalsResourceService: VitalsResourceService,
    private zscoreService: ZscoreService,
    private patientService: PatientService) { }

  public getvitals(patient: Patient, startIndex?: number, limit?: number): BehaviorSubject<any> {
    const patientUuid = patient.person.uuid;
    let vitals: BehaviorSubject<any> = new BehaviorSubject(null);

    this.vitalsResourceService.getVitals(patientUuid,
      startIndex, this.limit).pipe(take(1)).subscribe((data) => {
        if (data) {
          let weight: string;

          for (let r of  data) {
            if (r.height && r.weight) {
              const zscore = this.zscoreService.getZScoreByGenderAndAge(patient.person.gender,
                 patient.person.birthdate, r.encounter_datetime,
              r.height, r.weight);
              r['weightForHeight'] = zscore.weightForHeight;
              r['heightForAge'] =  zscore.heightForAge;
              r['bmiForAge'] =  zscore.bmiForAge;
              let BMI = (r.weight /
                (r.height / 100 * r.height / 100))
                .toFixed(1);
              r['BMI'] = BMI;
            }
            }
          vitals.next(data);
                  }
      }, (error) => {
        vitals.error(error);
        console.error(error);
      });

    return vitals;
  }
}
