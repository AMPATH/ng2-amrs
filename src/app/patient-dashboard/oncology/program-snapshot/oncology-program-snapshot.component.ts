import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

import { Patient } from '../../../models/patient.model';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import {
  OncologySummaryResourceService
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
  public hasLoadedData = false;
  public isIntegratedProgram = false;
  public hasError = false;
  public subscription: Subscription;
  public patientUuid: any;
  public errors: any = [];
  public summaryData: any;
  public latestEncounterLocation: any;
  public generalOncologyProgramUuid = '725b5193-3452-43fc-aca3-6a80432d9bfa';
  public multipleMyelomaProgramUuid = '698b7153-bff3-4931-9638-d279ca47b32e';
  public oncologyScreeningAndDiagnosisProgramUuid = '37ff4124-91fd-49e6-8261-057ccfb4fcd0';

  constructor(
    private oncologySummary: OncologySummaryResourceService,
    private locationResourceService: LocationResourceService,
    private integratedProgramSnapshot: OncologySummaryResourceService) {
  }

  public ngOnInit(): void {
    _.delay((patientUuid) => {
      if (_.isNil(this.patient)) {
        this.hasError = true;
      } else {
        this.hasData = false;
        if (this.programUuid === this.oncologyScreeningAndDiagnosisProgramUuid) {
          this.loadScreeningAndDiagnosisData(patientUuid);
        } else {
          this.loadOncologyDataSummary(patientUuid);
        }
      }
    }, 0, this.patient.uuid);
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadOncologyDataSummary(patientUuid: any): any {
    if (this.programUuid && patientUuid) {
      this.loadingSummary = true;
      this.oncologySummary.getOncologySummary(
        'summary', patientUuid, this.programUuid
      ).pipe(take(1)).subscribe((summary) => {
        this.hasLoadedData = true;
        this.loadingSummary = false;
        if (summary.length) {
          if (this.programUuid === this.generalOncologyProgramUuid) {
            const generalOncologyEncounters = this.getGeneralOncologyEncounters(summary);
            if (generalOncologyEncounters) {
              this.summaryData = _.first(generalOncologyEncounters);
            }
          } else if (this.programUuid === this.multipleMyelomaProgramUuid) {
            const mmEncounters = this.getMultipleMyelomaEncounters(summary);
            this.summaryData = _.first(mmEncounters);
          } else {
            this.summaryData = summary[0];
          }
          if (this.summaryData) {
            this.hasData = true;
            this.hasError = false;
            if (this.summaryData.location_uuid) {
              this.resolveLocation(this.summaryData.location_uuid);
            }
          }
        }
      }, (error) => {
        this.loadingSummary = false;
        this.hasData = false;
        this.hasError = true;
        console.error('Error fetching oncology summary: ', error);
        this.errors.push({
          id: 'summary',
          message: 'Error Fetching Summary'
        });
      });
    }
  }

  private translateConcept(conceptId): string {
    const conceptMap = {
      '115': 'MASTITIS',
      '582': 'MASS, OTHER',
      '1067': 'UNKNOWN',
      '1115': 'NORMAL',
      '1116': 'ABNORMAL',
      '1118': 'NOT DONE',
      '1481': 'ABSCESS, BREAST',
      '5245': 'PALLOR',
      '5313': 'MUSCLE TENDERNESS',
      '5622': 'OTHER, NON-CODED',
      '6250': 'BREAST LUMPS',
      '6493': 'NIPPLE DISCHARGE',
      '6497': 'DYSFUNCTIONAL UTERINE BLEEDING',
      '6499': 'BREAST SKIN CHANGES',
      '6729': 'BREAST ENGORGEMENT',
      '7293': 'ULCER',
      '7469': 'ACETOWHITE LESION',
      '7470': 'PUNCTUATED CAPPILARIES',
      '7472': 'ATYPICAL BLOOD VESSELS',
      '8188': 'CALOR',
      '8189': 'PEAU D\'ORANGE',
      '9591': 'OYSTERWHITE LESION',
      '9592': 'BRIGHT WHITE LESION',
      '9593': 'FRIABLE TISSUE',
      '9687': 'SKIN EDEMA',
      '9688': 'NIPPLE AREOLAR CHANGE',
      '9689': 'FINE NODULARITY',
      '9690': 'DENSE NODULARITY',
      '9691': 'BENIGN'
    };

    return conceptMap[conceptId];
  }

  private getGeneralOncologyEncounters(summaries: any): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return summary.is_clinical === 1 && summary.program_id === 6 && (summary.encounter_type === 38 || summary.encounter_type === 39);
      });
    }
  }

  private getMultipleMyelomaEncounters(summaries: any): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return summary.is_clinical === 1
          && (summary.encounter_type === 89 || summary.encounter_type === 90);
      });
    }
  }

  private resolveLocation(locationUuid: any): any {
    this.locationResourceService.getLocationByUuid(locationUuid, true)
      .subscribe((location) => {
        this.latestEncounterLocation = location;
      }, (error) => {
        console.error('Error resolving location: ', error);
      });
  }

  private loadScreeningAndDiagnosisData(patientUuid: any): any {
    this.hasData = false;
    this.hasError = false;
    this.integratedProgramSnapshot.getIntegratedProgramSnapshot(patientUuid)
      .subscribe((screeningSummary) => {
        this.loadingSummary = false;
        this.hasLoadedData = true;
        if (screeningSummary.length) {
          this.summaryData = screeningSummary;
          this.isIntegratedProgram = true;
          this.hasData = true;
          this.hasError = false;
        }
      }, (error => {
        this.loadingSummary = false;
        this.hasData = false;
        this.hasError = true;
        console.error('Error fetching integrated screening summary: ', error);
        this.errors.push({
          id: 'summary',
          message: 'Error Fetching Summary'
        });
      }));
  }
}
