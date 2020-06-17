import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from '../../services/patient.service';
import { HivSummaryResourceService } from 'src/app/etl-api/hiv-summary-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';

@Component({
  selector: 'app-ovc-snapshot',
  templateUrl: './ovc-snapshot.component.html',
  styleUrls: ['./ovc-snapshot.component.css']
})
export class OvcSnapshotComponent implements OnInit {
  loadingData: boolean;
  hasLoadedData: boolean;
  patientCareStatus: any;
  public hasError = false;
  hivDisclosureStatus: string;
  subscription: any;
  patient: Patient;
  public addBackground: any = 'white';
  clinicalEncounters: any;
  hasTransferEncounter: any;
  hasSubsequentClinicalEncounter: boolean;
  patientData: any;
  isVirallyUnsuppressed: boolean;
  hasData: boolean;
  latestEncounterLocation: any;
  searchIdentifiers: any;
  ovcEnrollment = false;
  dateEnrolled: any;
  dateCompleted: any;
  programManagerUrl: any;
  nonEnrollmentFormUrl: any;
  public exitedCare = false;
  public exitReason: any;
  nonEnrollmentFormFilled = false;
  nonEnrollmentReason: string;
  constructor(private patientService: PatientService, private hivSummaryResourceService: HivSummaryResourceService,
    private _encounterResource: EncounterResourceService) { }

  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.programManagerUrl = '/patient-dashboard/patient/' + patient.uuid + '/general/general/program-manager';
          this.nonEnrollmentFormUrl = '/patient-dashboard/patient/' + patient.uuid + '/general/general/' +
          'formentry/59c77f30-325b-4887-9e23-457b51cc5495';
          this.searchIdentifiers = patient.searchIdentifiers;
            this.getOvcEnrollments(patient.enrolledPrograms);
            this.retrieveNonEnrollmentandExitEncounter(patient);
            this.retrieveHivDisclosureStatus(patient);
            this.getHivSummary(patient);
        }
      }
    );
  }
  retrieveHivDisclosureStatus(patient: Patient) {
    const disclosureEncounter = patient.encounters.filter(encounter => {
      if (encounter.encounterType.uuid === 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7') {
        return encounter;
      }
    });
    if (disclosureEncounter.length > 0) {
      this._encounterResource.getEncounterByUuid(disclosureEncounter[0].uuid).subscribe(data => {
        data.obs.filter(ob => {
          if (ob.concept.uuid === 'cd8ead74-96fc-4764-a9fa-c9ee059c59c5') {
            this.hivDisclosureStatus = ob.value.display;
          }
        });
      });
    }
  }
  public getHivSummary(patient) {
    this.loadingData = true;
    this.hivSummaryResourceService.getHivSummary(patient.uuid, 0, 10).pipe(take(1)).subscribe((results) => {
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
        this.hivDisclosureStatus = results[0].hiv_status_disclosed === 1 ? 'Yes' : 'No';
      }
      this.clinicalEncounters = this.getClinicalEncounters(results);
      this.patientData = _.first(this.clinicalEncounters);
      const patientDataCopy = this.patientData;

      if (!_.isNil(this.patientData)) {
        // assign latest vl and vl_1_date
        this.patientData = Object.assign(patientDataCopy,
          { vl_1_date: latestVlDate, vl_1: latestVl });
        // flag red if VL > 1000 && (vl_1_date > (arv_start_date + 6 months))
        if ((this.patientData.vl_1 > 1000 && (
          moment(this.patientData.vl_1_date) >
          moment(this.patientData.arv_start_date).add(6, 'months')
        )) || (this.patientData.prev_arv_line !== this.patientData.cur_arv_line)) {
          this.isVirallyUnsuppressed = true;
        }
        this.hasData = true;
      }
    });
  }
  private getClinicalEncounters(summaries: any[]): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return summary.is_clinical_encounter === 1;
      });
    }
  }
  private getlatestVlResult(hivSummaryData) {
    const orderByVlDate = _.orderBy(hivSummaryData, (hivSummary) => {
      return moment(hivSummary.vl_1_date);
    }, ['desc']);
    return orderByVlDate[0];
  }
  public onAddBackground(color) {
    setTimeout(() => {
      this.addBackground = color;
    });

  }
  private getOvcEnrollments(enrolledPrograms) {
    const ovc = enrolledPrograms.filter(program => program.concept.uuid === 'a89fbb12-1350-11df-a1f1-0026b9348838');
    if (ovc.length > 0 && ovc[0].isEnrolled) {
      this.dateEnrolled = ovc[0].dateEnrolled;
      this.ovcEnrollment = true;
    } else {
      this.dateCompleted = ovc[0].dateCompleted;
    }
  }
  private retrieveNonEnrollmentandExitEncounter(patient) {
    const encounters = patient.encounters;
    const encounterUuid = encounters.filter(enc => {
      if (enc.encounterType.uuid === '824ca90d-c313-4d7e-bc99-119871d927cb') {
        return enc.uuid;
      }
    });
    const exitEncounter = encounters.filter(enc => {
      if (enc.encounterType.uuid === '06e5321e-fc08-4995-aaa3-19c76b48cd22') {
        return enc.uuid;
      }
    });
    if (exitEncounter.length > 0) {
      this._encounterResource.getEncounterByUuid(exitEncounter[0].uuid).subscribe(data => {
        data.obs.filter(ob => {
          if (ob.concept.uuid === 'a89e3f94-1350-11df-a1f1-0026b9348838') {
            console.log(ob.value.display);
            this.exitReason = `Exited:  ${ob.value.display}`;
            this.exitedCare = true;
          }
        });
      });
    }
    if (encounterUuid.length > 0) {
      this._encounterResource.getEncounterByUuid(encounterUuid[0].uuid).subscribe(data => {
        data.obs.filter(ob => {
          if (ob.concept.uuid === '33d36d0a-4d1b-404c-8f09-e891af4dadbe') {
            this.nonEnrollmentFormFilled = true;
            this.nonEnrollmentReason = `Decline Reason: ${ob.value}`;
          } else if (ob.concept.uuid === '06bbb2b0-e2a8-42bc-978f-5dc1eb16ebc1') {
            this.nonEnrollmentFormFilled = true;
            this.nonEnrollmentReason = `Decline Reason: ${ob.value.display}`;
          }
        });
      });

    } else {
      this.nonEnrollmentReason = 'Not enrolled. Refer to social worker';
    }
}
}
