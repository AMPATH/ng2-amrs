import { OnInit, Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';

import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'hiv-snapshot',
  styleUrls: ['./hiv-program-snapshot.component.css'],
  templateUrl: './hiv-program-snapshot.component.html',
})
export class HivProgramSnapshotComponent implements OnInit {
  @Input('patient') currentlyLoadedPatient: Patient;
  hasError: boolean = false;
  hasData: boolean = false;
  patientData: any = {};
  loadingData: boolean = false;
  hasLoadedData: boolean = false;
  location: any = {};
  constructor(private hivSummaryResourceService: HivSummaryResourceService
    , private http: Http
    , private appSettingsService: AppSettingsService) {

  }

  ngOnInit() {
    _.delay((patientUuid) => {
      if (_.isNil(this.currentlyLoadedPatient)) {
        this.hasError = true;
      } else {
        this.hasData = false;
        this.getHivSummary(patientUuid);
      }
    }, 0, this.currentlyLoadedPatient.uuid);
  }

  getHivSummary(patientUuid) {
    this.loadingData = true;
    this.hivSummaryResourceService.getHivSummary(patientUuid, 0, 1).subscribe((results) => {
      this.getLocation().subscribe((locations) => {
        this.loadingData = false;
        this.hasLoadedData = true;
        this.patientData = _.first(results);
        if (!_.isNil(this.patientData)) {
          this.hasData = true;
          let encounterLocations = _.filter(locations, (location, key) => {
            return location['uuid'] === this.patientData.location_uuid;
          });
          this.location = _.first(encounterLocations);
        }
      });
    });
  }

  getLocation(): Observable<any> {
    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';
    return this.http.get(api).map((response: Response) => {
      return response.json().results;
    });
  }
}
