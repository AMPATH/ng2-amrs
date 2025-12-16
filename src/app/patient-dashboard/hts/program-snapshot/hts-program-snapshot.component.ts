import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

import { Patient } from '../../../models/patient.model';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { HTSModuleResourceService } from 'src/app/etl-api/hts-module-resource.service';

@Component({
  selector: 'hts-snapshot',
  styleUrls: ['./hts-program-snapshot.component.css'],
  templateUrl: './hts-program-snapshot.component.html'
})
export class HtsProgramSnapshotComponent implements OnInit, OnDestroy {
  @Input() public patient: Patient;
  @Input() public programUuid;
  public loadingSummary = false;
  public hasData = false;
  public hasLoadedData = false;
  public isIntegratedProgram = false;
  public hasError = false;
  public subscription: Subscription;
  public patientUuid: any;
  public errors: any = [];
  public latestHTSEncounterDetails: any;

  constructor(private htsModuleService: HTSModuleResourceService) {}

  public ngOnInit(): void {
    _.delay(
      (patientUuid) => {
        if (_.isNil(this.patient)) {
          this.hasError = true;
        } else {
          this.hasData = false;
          this.loadHTSLatestEncounterDetails(patientUuid);
        }
      },
      0,
      this.patient.uuid
    );
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadHTSLatestEncounterDetails(patientUuid: any): any {
    if (patientUuid) {
      this.loadingSummary = true;
      this.htsModuleService
        .getHTSLatestEncounterDetails(patientUuid)
        .pipe(take(1))
        .subscribe(
          (summary) => {
            this.hasLoadedData = true;
            this.loadingSummary = false;
            if (summary.result) {
              this.latestHTSEncounterDetails = summary.result[1][0];
              this.hasData = true;
            } else {
              this.hasData = false;
            }
          },
          (error) => {
            this.loadingSummary = false;
            this.hasData = false;
            this.hasError = true;
            console.error('Error fetching oncology summary: ', error);
            this.errors.push({
              id: 'summary',
              message: 'Error Fetching Summary'
            });
          }
        );
    }
  }
}
