import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

import { Patient } from '../../../models/patient.model';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { OncologySummaryResourceService } from '../../../etl-api/oncology-summary-resource.service';

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
  public oncologyScreeningAndDiagnosisProgramUuid =
    '37ff4124-91fd-49e6-8261-057ccfb4fcd0';

  constructor(
    private oncologySummary: OncologySummaryResourceService,
    private locationResourceService: LocationResourceService
  ) {}

  public ngOnInit(): void {
    _.delay(
      (patientUuid) => {
        if (_.isNil(this.patient)) {
          this.hasError = true;
        } else {
          this.hasData = false;
          if (
            this.programUuid === this.oncologyScreeningAndDiagnosisProgramUuid
          ) {
            this.loadScreeningAndDiagnosisData(patientUuid);
          } else {
            this.loadOncologyDataSummary(patientUuid);
          }
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

  public loadOncologyDataSummary(patientUuid: any): any {
    if (this.programUuid && patientUuid) {
      this.loadingSummary = true;
      this.oncologySummary
        .getOncologySummary('summary', patientUuid, this.programUuid)
        .pipe(take(1))
        .subscribe(
          (summary) => {
            this.hasLoadedData = true;
            this.loadingSummary = false;
            if (summary.length) {
              if (this.programUuid === this.generalOncologyProgramUuid) {
                const generalOncologyEncounters = this.getGeneralOncologyEncounters(
                  summary
                );
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

  private translateConcept(conceptId): string {
    const conceptMap = {
      '109': 'Wound, septic',
      '115': 'Mastitis',
      '582': 'Mass, other',
      '664': 'Negative',
      '703': 'Positive',
      '1067': 'Unknown',
      '1115': 'Normal',
      '1116': 'Abnormal',
      '1118': 'Not done',
      '1481': 'Breast abscess',
      '5245': 'Pallor',
      '5313': 'Muscle tenderness',
      '5622': 'Other, non-coded',
      '6249': 'Cracked nipple',
      '6250': 'Breast lumps',
      '6493': 'Nipple discharge',
      '6497': 'Dysfunctional uterine bleeding',
      '6499': 'Breast skin changes',
      '6729': 'Breast engorgement',
      '7293': 'Ulcer',
      '7469': 'Acetowhite lesion',
      '7470': 'Punctuated capillaries',
      '7472': 'Atypical blood vessels',
      '8188': 'Calor',
      '8189': "Peau D'Orange",
      '9591': 'Oysterwhite lesion',
      '9592': 'Bright white lesion',
      '9593': 'Friable tissue',
      '9687': 'Skin edema',
      '9688': 'Nipple areolar change',
      '9689': 'Fine nodularity',
      '9690': 'Dense nodularity',
      '9691': 'Benign',
      '10945': 'Retracted nipple associated with childbirth',
      '10946': 'Mastitis, associated with childbirth',
      '10948': 'Caeserean wound disruption',
      '10949': 'Surgical wound healed'
    };

    return conceptMap[conceptId];
  }

  private getGeneralOncologyEncounters(summaries: any): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return (
          summary.is_clinical === 1 &&
          summary.program_id === 6 &&
          (summary.encounter_type === 38 || summary.encounter_type === 39)
        );
      });
    }
  }

  private getMultipleMyelomaEncounters(summaries: any): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return (
          summary.is_clinical === 1 &&
          (summary.encounter_type === 89 || summary.encounter_type === 90)
        );
      });
    }
  }

  private resolveLocation(locationUuid: any): any {
    this.locationResourceService
      .getLocationByUuid(locationUuid, true)
      .subscribe(
        (location) => {
          this.latestEncounterLocation = location;
        },
        (error) => {
          console.error('Error resolving location: ', error);
        }
      );
  }

  private loadScreeningAndDiagnosisData(patientUuid: any): any {
    this.hasData = false;
    this.hasError = false;
    this.oncologySummary.getIntegratedProgramSnapshot(patientUuid).subscribe(
      (screeningSummary) => {
        this.loadingSummary = false;
        this.hasLoadedData = true;
        if (screeningSummary.length) {
          this.summaryData = screeningSummary;
          this.isIntegratedProgram = true;
          this.hasData = true;
          this.hasError = false;
        }
      },
      (error) => {
        this.loadingSummary = false;
        this.hasData = false;
        this.hasError = true;
        console.error('Error fetching integrated screening summary: ', error);
        this.errors.push({
          id: 'summary',
          message: 'Error Fetching Summary'
        });
      }
    );
  }
}
