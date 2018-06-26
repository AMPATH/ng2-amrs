import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import { AppSettingsService } from '../../../app-settings';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'cdm-snapshot',
  styleUrls: ['./cdm-program-snapshot.component.css'],
  templateUrl: './cdm-program-snapshot.component.html'
})
export class CdmProgramSnapshotComponent implements OnInit {
  @Input() public patient: Patient;
  public hasError: boolean = false;
  public hasData: boolean = false;
  public patientData: any = {};
  public loadingData: boolean = false;
  public hasLoadedData: boolean = false;
  public location: any = {};

  constructor(
    private cdmSummaryResourceService: CdmSummaryResourceService,
    private http: Http,
    private appSettingsService: AppSettingsService) {
    }

  public ngOnInit() {
    _.delay((patientUuid) => {
      if (_.isNil(this.patient)) {
        this.hasError = true;
      } else {
        this.hasData = false;
        this.getCdmSummary(patientUuid);
      }
    }, 0, this.patient.uuid);
  }

  public getCdmSummary(patientUuid) {
    this.loadingData = true;
    this.cdmSummaryResourceService.getCdmSummary(patientUuid, 0, 10).subscribe((results) => {
      this.getLocation().subscribe((locations) => {
        this.loadingData = false;
        this.hasLoadedData = true;
        this.patientData = _.first(_.filter(results, (encounter: any) => {
          return encounter.is_clinical_encounter === 1;
        }));
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

  public getLocation(): Observable<any> {
    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';
    return this.http.get(api).map((response: Response) => {
      return response.json().results;
    });
  }

}
