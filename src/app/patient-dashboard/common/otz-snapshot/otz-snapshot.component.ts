import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from '../../services/patient.service';
import { HivSummaryResourceService } from 'src/app/etl-api/hiv-summary-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
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
  dateEnrolled: any;
  dateCompleted: any;
  loadingData: boolean;
  hasLoadedData: boolean;
  patientCareStatus: any;
  hivDisclosureStatus: string;
  clinicalEncounters: any;
  patientData: any;
  isVirallyUnsuppressed: boolean;
  hasData: boolean;
  isHEIActive: boolean;

  constructor(
    private patientService: PatientService,
    private hivSummaryResourceService: HivSummaryResourceService,
    private _encounterResource: EncounterResourceService
  ) {}

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.programManagerUrl =
            '/patient-dashboard/patient/' +
            patient.uuid +
            '/general/general/program-manager/new-program';
          this.getOtzEnrollments(patient.enrolledPrograms);
          // this.retrieveNonEnrollmentandExitEncounter(patient);
          // this.retrieveHivDisclosureStatus(patient);
          // this.getHivSummary(patient);
        }
      }
    );
  }

  selectItem(item: string) {
    this.selectedItem = item;
  }

  private getOtzEnrollments(enrolledPrograms) {
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
          latestVl = latestVlResult.vl_1;
          this.patientCareStatus = results[0].patient_care_status;
          this.hivDisclosureStatus =
            results[0].hiv_status_disclosed === 1 ? 'Yes' : 'No';
        }
        this.clinicalEncounters = this.clinicalEncounters(results);
        this.patientData = _.first(this.clinicalEncounters);
        const patientDataCopy = this.patientData;

        if (!_.isNil(this.patientData)) {
          // assign latest vl and vl_1_date
          this.patientData = Object.assign(patientDataCopy, {
            vl_1_date: latestVlDate,
            vl_1: latestVl
          });
          // flag red if VL > 1000 && (vl_1_date > (arv_start_date + 6 months))
          if (
            (this.patientData.vl_1 > 1000 &&
              moment(this.patientData.vl_1_date) >
                moment(this.patientData.arv_start_date).add(6, 'months')) ||
            this.patientData.prev_arv_line !== this.patientData.cur_arv_line
          ) {
            this.isVirallyUnsuppressed = true;
          }
          this.hasData = true;
        }
      });
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
