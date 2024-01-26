import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from '../../services/patient.service';
import { HivSummaryResourceService } from 'src/app/etl-api/hiv-summary-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { LabsResourceService } from 'src/app/etl-api/labs-resource.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-otz-snapshot',
  templateUrl: './otz-snapshot.component.html',
  styleUrls: ['./otz-snapshot.component.css']
})
export class OtzSnapshotComponent implements OnInit {
  selectedItem = 'summary';
  subscription: any;
  patient: Patient;
  otzEnrollment = false;
  programManagerUrl: any;
  groupManagerUrl: any;
  otzProgramExit: any;
  dateEnrolled: any;
  dateCompleted: any;
  loadingData: boolean;
  hasLoadedData: boolean;
  patientCareStatus: any;
  clinicalEncounters: any;
  patientData: any;
  hasData: boolean;
  isHEIActive: boolean;
  viralLoadCategory: string;
  isOtzDiscontinued = false;
  reasonForDiscontinuation: string;
  otzDiscontinuationDate: any;
  viralLoadHistory: any[];
  isPatientEligibleForOtz = false;

  constructor(
    private patientService: PatientService,
    private hivSummaryResourceService: HivSummaryResourceService,
    private labsResourceService: LabsResourceService,
    private encounterResource: EncounterResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.isHEIActive = patient.enrolledPrograms.some((program) => {
            return (
              program.programUuid === 'a8e7c30d-6d2f-401c-bb52-d4433689a36b' &&
              program.isEnrolled === true
            );
          });
          this.programManagerUrl =
            '/patient-dashboard/patient/' +
            patient.uuid +
            '/general/general/program-manager/new-program';
          this.otzProgramExit =
            '/patient-dashboard/patient/' +
            patient.uuid +
            '/general/general/formentry/ab16711d-890d-4128-95ce-0e955babd711';
          this.groupManagerUrl =
            '/patient-dashboard/patient/' +
            patient.uuid +
            '/general/general/group-enrollment';
          this.getOtzEnrollments(patient.person.age, patient.enrolledPrograms);
          this.getHivSummary(patient);
          this.getHistoricalPatientLabResults(patient);
          this.getOtzDiscontinuation(patient);
        }
      }
    );
  }

  selectItem(item: string) {
    this.selectedItem = item;
  }

  private getOtzEnrollments(age, enrolledPrograms) {
    const otz = enrolledPrograms.filter(
      (program) =>
        program.concept.uuid === 'fd90d6b2-7302-4a9c-ad1b-1f93eff77afb'
    );
    if (otz.length > 0 && otz[0].isEnrolled) {
      this.dateEnrolled = otz[0].dateEnrolled;
      this.otzEnrollment = true;
    } else {
      this.dateCompleted = otz[0].dateCompleted;
    }
    if (age > 9 && age <= 24) {
      this.isPatientEligibleForOtz = true;
    }
  }

  private getOtzDiscontinuation(patient) {
    patient.encounters.filter((encounter) => {
      const reasonForDiscontinuation = encounter.obs.filter((obs) => {
        return obs.concept.uuid === 'a89e3f94-1350-11df-a1f1-0026b9348838';
      });
      console.log(reasonForDiscontinuation);
      if (reasonForDiscontinuation.length > 0) {
        this.isOtzDiscontinued = true;
        this.reasonForDiscontinuation =
          reasonForDiscontinuation[0].value.display;
        this.otzDiscontinuationDate = encounter.encounterDatetime;
      }
    });
  }

  public getHivSummary(patient) {
    this.loadingData = true;
    this.hivSummaryResourceService
      .getHivSummary(patient.uuid, 0, 10, false, this.isHEIActive)
      .pipe(take(1))
      .subscribe((results) => {
        let latestVlResult: any;
        let latestVlDate = '';
        let latestVl = null;
        this.loadingData = false;
        this.hasLoadedData = true;
        if (results[0]) {
          latestVlResult = this.getlatestVlResult(results);
          latestVlDate = latestVlResult.vl_1_date;
          latestVl = latestVlResult.vl_1;
          this.patientCareStatus = results[0].patient_care_status;
        }
        this.clinicalEncounters = this.getClinicalEncounters(results);
        this.patientData = _.first(this.clinicalEncounters);
        const patientDataCopy = this.patientData;

        if (!_.isNil(this.patientData)) {
          // assign latest vl and vl_1_date
          this.patientData = Object.assign(patientDataCopy, {
            vl_1_date: latestVlDate,
            vl_1: latestVl
          });
          this.hasData = true;
        }
        if (latestVl) {
          this.viralLoadCategory = this.getCategory(latestVl);
        }
      });
  }

  private getCategory(value: number): string {
    if (value <= 50) {
      return 'LDL';
    } else if (value <= 200) {
      return 'Low Risk Low Level Viremia';
    } else if (value <= 500) {
      return 'High Risk Low Level Viremia';
    } else {
      return 'Suspected Treatment Failure';
    }
  }

  public getHistoricalPatientLabResults(patient) {
    this.labsResourceService
      .getHistoricalPatientLabResults(patient.uuid, {
        startIndex: '0',
        limit: '20'
      })
      .pipe(take(1))
      .subscribe((results) => {
        this.getViralLoadHistory(results);
      });
  }

  private getViralLoadHistory(labResults: any[]): any {
    const filteredArray = labResults.filter((item) => {
      return item.hiv_viral_load !== null && item.test_datetime !== null;
    });

    filteredArray.sort((a, b) => {
      const dateA = new Date(a.test_datetime).getTime();
      const dateB = new Date(b.test_datetime).getTime();
      return dateB - dateA;
    });

    const result = filteredArray.map((item) => {
      return {
        hiv_viral_load: item.hiv_viral_load,
        test_datetime: item.test_datetime
      };
    });
    this.viralLoadHistory = result;
  }

  private getClinicalEncounters(summaries: any[]): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return summary.is_clinical_encounter === 1;
      });
    }
  }

  private getlatestVlResult(hivSummaryData) {
    const orderByVlDate = _.orderBy(
      hivSummaryData,
      (hivSummary) => {
        return moment(hivSummary.vl_1_date);
      },
      ['desc']
    );
    return orderByVlDate[0];
  }
}
