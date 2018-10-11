import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
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

  constructor(
    private cdmSummaryResourceService: CdmSummaryResourceService) {
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
    this.cdmSummaryResourceService.getCdmSummary(patientUuid, 0, 10).take(1).subscribe((results) => {
        this.loadingData = false;
        this.hasLoadedData = true;
        this.patientData = _.first(_.filter(results, (encounter: any) => {
          return encounter.is_clinical_encounter === 1;
        }));
    });
  }

}
