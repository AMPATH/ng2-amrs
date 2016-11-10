import { Component, OnInit, Input } from '@angular/core';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { VitalsResourceService } from '../../etl-api/vitals-resource.service';
import { Helpers } from '../../utils/helpers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.css']
})
export class PatientVitalsComponent implements OnInit {

  encounters: Array<any> = [];

  isBusy: Subscription;

  nextStartIndex: string = '0';

  dataLoaded: boolean = false;

  experiencedLoadingError: boolean = false;

  patientUuid: string = '';
  constructor(private vitalsResource: VitalsResourceService,
    private appFeatureAnalytics: AppFeatureAnalytics) { }

  ngOnInit() {

    let _this = this;

    this.loadVitals('de662c03-b9af-4f00-b10e-2bda0440b03b', '0', '10', (err, data) => {
      if (err)
        console.error(err);
      else {

        _this.encounters = [];

        _this.appFeatureAnalytics.trackEvent('Patient Dashboard', 'Vitals Loaded', 'ngOnInit');

        let membersToCheck = ['weight', 'height', 'temp', 'oxygen_sat', 'systolic_bp',
          'diastolic_bp', 'pulse'];
        if (data.result) {
          for (let r in data.result) {

            let vital = data.result[r];

            if (!Helpers.hasAllMembersUndefinedOrNull(vital, membersToCheck))
              _this.encounters.push(vital);
          }
        }
      }

    });


  }

  loadMoreVitals() {

    this.loadVitals(this.patientUuid, this.nextStartIndex, '10', (err, data) => {
      if (err) console.error(err);

    });

  }

  loadVitals(patientUuid: string, startIndex: string, limit: string, cb: Function) {

    let _this = this;

    this.isBusy = this.vitalsResource.getVitals(patientUuid,
      startIndex, limit).subscribe((data) => {

        let _data = data.json();

        if (+_data['size'] === 0)
          _this.dataLoaded = true;

        _this.patientUuid = patientUuid;
        _this.nextStartIndex = (+_this.nextStartIndex + +_data['size']).toString();

        cb(null, _data);

      }, (err) => {

        _this.experiencedLoadingError = true;

        cb(err, null);

      });

  }

}
