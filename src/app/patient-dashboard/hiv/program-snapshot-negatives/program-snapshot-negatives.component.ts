import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

import * as _ from 'lodash';

import { Patient } from '../../../models/patient.model';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';

@Component({
  selector: 'hiv-snapshot-negatives',
  templateUrl: './program-snapshot-negatives.component.html',
  styleUrls: ['./program-snapshot-negatives.component.css']
})
export class ProgramSnapshotNegativesComponent implements OnInit {
  private HivNegativesProgram = [
    'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
    '96047aaf-7ab3-45e9-be6a-b61810fe617d'
  ];

  @Input() public set program(program) {
    this.programUuid = program.uuid;

    _.each(this.HivNegativesProgram, (p) => {
      if (p === program.uuid) {
        this.displayProgram = true;
      } else {
        this.displayProgram = false;
      }
    });
  }
  @Input() public patient: Patient;
  @Output() public addBackground = new EventEmitter();

  public hasError = false;
  public hasData = false;
  public clinicalEncounters: any[] = [];
  public patientData: any = {};
  public loadingData = false;
  public hasLoadedData = false;
  public prev_encounter_date: any = '';
  public hasTransferEncounter = false;
  public latestEncounterLocation: any = {};
  public hasSubsequentClinicalEncounter = false;
  public resolvedCareStatus: any;
  public showCareStatus = true;
  public backgroundColor: any = {
    pink: '#FFC0CB',
    yellow: '#FFFF00'
  };
  public currentPatientSub: Subscription;

  public _patient: Patient = new Patient({});
  private gbvScreeningResult: any;
  private programUuid = '';
  public displayProgram = false;
  public displayPrep = false;
  public displayPep = false;
  public gbvScreeningLabel: String;

  constructor(
    private hivSummaryResourceService: HivSummaryResourceService,
    private locationResource: LocationResourceService
  ) {}

  public ngOnInit() {
    _.delay(
      (patientUuid) => {
        if (_.isNil(this.patient)) {
          this.hasError = true;
        } else {
          this.hasData = false;
          this.getPatientSummary(patientUuid);
          this.patient.person.age > 19
            ? (this.gbvScreeningLabel = 'GBV Screening')
            : (this.gbvScreeningLabel = 'VAC Screening');
        }
      },
      0,
      this.patient.uuid
    );
  }

  public getPatientSummary(patientUuid) {
    this.loadingData = true;
    this.hivSummaryResourceService
      .getHivNegativesPatientSummary(
        this.generateParams(patientUuid, this.programUuid)
      )
      .pipe(take(1))
      .subscribe((summary) => {
        this.loadingData = false;
        this.hasLoadedData = true;
        this.hasData = true;
        if (!_.isEmpty(summary.PrEP.result)) {
          this.displayPrep = true;
          this.clinicalEncounters = this.getClinicalEncounters(
            summary.PrEP.result
          );
        } else if (!_.isEmpty(summary.PEP.result)) {
          this.displayPep = true;
          this.clinicalEncounters = summary.PEP.result;
        }

        this.patientData = _.first(this.clinicalEncounters);
        this.latestEncounterLocation = null;
        if (this.patientData.location_uuid) {
          this.resolveLastEncounterLocation(this.patientData.location_uuid);
        }
        this.gbvScreeningResult = this.checkGbvScreening(
          this.patientData.gbv_screening_result
        );
        this.hasTransferEncounter = this.checkIfHasTransferEncounter(
          this.clinicalEncounters
        );
      });
  }

  public generateParams(patientUuid, programUuid) {
    const params = {
      patientUuid: patientUuid,
      offset: 0,
      limit: 10
    };
    if (programUuid === 'c19aec66-1a40-4588-9b03-b6be55a8dd1d') {
      params['program'] = 'PrEP';
    } else if (programUuid === '96047aaf-7ab3-45e9-be6a-b61810fe617d') {
      params['program'] = 'PEP';
    }
    return params;
  }

  public resolveLastEncounterLocation(location_uuid) {
    this.locationResource
      .getLocationByUuid(location_uuid, true)
      .pipe()
      .subscribe(
        (location) => {
          this.latestEncounterLocation = location;
        },
        (error) => {
          console.error('Error resolving locations', error);
        }
      );
  }

  private checkIfHasTransferEncounter(summaries: any[]): boolean {
    if (summaries) {
      return _.some(summaries, (summary: any) => {
        return (
          summary.encounter_type === 116 &&
          summary.encounter_type_name === 'TRANSFERENCOUNTER'
        );
      });
    }
  }

  private getClinicalEncounters(summaries: any[]): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return summary.is_prep_clinical_encounter === 1;
      });
    }
  }

  private checkGbvScreening(screeningResult) {
    switch (screeningResult) {
      case 1:
        return 'POSITIVE';
      default:
        return false;
    }
  }
}
