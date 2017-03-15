import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { VitalsResourceService } from '../../etl-api/vitals-resource.service';


@Injectable()
export class PatientVitalsService {

   private limit: number = 10;

  constructor(private vitalsResourceService: VitalsResourceService) { }

  getvitals(patientUuid: string,
    startIndex?: number, limit?: number): BehaviorSubject<any> {
    let vitals: BehaviorSubject<any> = new BehaviorSubject(null);

    this.vitalsResourceService.getVitals(patientUuid,
      startIndex, this.limit).subscribe((data) => {
        if (data) {
          let weight: string;

            for (let r = 0; r < data.length; r++) {
              if (data[r].height && data[r].weight) {
                let BMI = (data[r].weight /
                  (data[r].height / 100 * data[r].height / 100))
                  .toFixed(1);
                data[r]['BMI'] = BMI;
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

