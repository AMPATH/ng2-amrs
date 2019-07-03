import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import { OncologySummaryResourceService
} from '../../../etl-api/oncology-summary-resource.service';

@Component({
  selector: 'oncology-snapshot',
  styleUrls: ['./oncology-program-snapshot.component.css'],
  templateUrl: './oncology-program-snapshot.component.html'
})
export class OncologyProgramSnapshotComponent implements OnInit, OnDestroy {
  @Input() public patient: Patient;
  @Input() public programUuid;
  public loadingSummary = false;
  public hasData = false;
  public hasError = false;
  public subscription: Subscription;
  public patientUuid: any;
  public errors: any = [];
  public summaryData: any;
  constructor(
    private oncolologySummary: OncologySummaryResourceService) {
  }

  public ngOnInit() {
    _.delay((patientUuid) => {
      if (_.isNil(this.patient)) {
        this.hasError = true;
      } else {
        this.hasData = false;
        this.loadOncologyDataSummary(patientUuid);
      }
    }, 0, this.patient.uuid);
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadOncologyDataSummary(patientUuid) {
    if (this.programUuid && patientUuid) {
      this.oncolologySummary.getOncologySummary('summary', patientUuid, this.programUuid).subscribe((summary) => {
        this.summaryData = summary[0];
        this.hasData =  true;
        this.hasError = false;
        this.loadingSummary = false;
      }, (error) => {
        this.loadingSummary = false;
        this.hasData = false;
        this.hasError = true;
        console.log(error);
        this.errors.push({
          id: 'summary',
          message: 'Error Fetching Summary'
        });
      });
    }
  }

}
