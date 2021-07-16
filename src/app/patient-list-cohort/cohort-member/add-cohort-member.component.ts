/* tslint:disable:no-inferrable-types */
import { take } from "rxjs/operators/take";
import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
} from "@angular/core";

import { Patient } from "../../models/patient.model";
import { PatientResourceService } from "../../openmrs-api/patient-resource.service";
import { CohortMemberResourceService } from "../../openmrs-api/cohort-member-resource.service";
import { CohortResourceService } from "../../openmrs-api/cohort-resource.service";
import { CohortSelectorComponent } from "./cohort-selector.component";
@Component({
  selector: "add-cohort-member",
  templateUrl: "add-cohort-member.component.html",
  styleUrls: ["add-cohort-member.component.css"],
})
export class AddCohortMemberComponent implements OnInit {
  public isBusy = false;
  public hasError = false;
  public errorMessage = "";
  public hideResult = true;

  @Output()
  public saved: EventEmitter<any> = new EventEmitter();

  @Output()
  public cancelled: EventEmitter<any> = new EventEmitter();

  // @ViewChild('patientSearch')
  // public patientSearchComponent: PatientSearchComponent;
  public showPatientSearch = false;

  public showCohortSelector = false;

  // Should use either the object or the uuid for the input, and not both at the same time
  @Input()
  public patient: Patient;
  @Input()
  public cohort: any;

  @Input()
  public allowPatientEdit = false;

  @Input()
  public allowCohortEdit = false;

  private _cohortUuid: string;
  @Input()
  public get cohortUuid(): string {
    return this._cohortUuid;
  }
  public set cohortUuid(v: string) {
    this._cohortUuid = v;
    if (v && v !== "") {
      this.resolveCohortUuidToCohort();
    }
  }

  private _patientUuid: string;
  @Input()
  public get patientUuid(): string {
    return this._patientUuid;
  }
  public set patientUuid(v: string) {
    this._patientUuid = v;
    if (v && v !== "") {
      this.resolvePatientUuidToPatient();
    }
  }

  constructor(
    private cohortMemberResource: CohortMemberResourceService,
    private patientResourceService: PatientResourceService,
    private cohortResourceService: CohortResourceService
  ) {}

  public ngOnInit() {}

  public patientSelected(patient) {
    this.patient = patient;
    this._patientUuid = patient.uuid;
    this.showPatientSearch = false;
    this.hideResult = true;
  }

  public showPatientSearchComponent() {
    this.showPatientSearch = true;
  }

  public showCohortSelectorComponent() {
    this.showCohortSelector = true;
  }

  public cohortSelected(cohort) {
    this.cohort = cohort;
    this.showCohortSelector = false;
  }

  public save() {
    if (this.isValid()) {
      this.saveCohort(this.cohort.uuid, this.patient.uuid);
    }
  }

  public cancel() {
    this.cancelled.next();
  }

  public saveCohort(cohortUuid: string, patientUuid: string) {
    this.isBusy = true;
    this.hasError = false;
    this.errorMessage = "";

    this.cohortMemberResource
      .addCohortMember(cohortUuid, {
        patient: patientUuid,
      })
      .pipe(take(1))
      .subscribe(
        (saved) => {
          this.isBusy = false;
          this.saved.next();
        },
        (error) => {
          console.error("An error occured adding the new cohort member", error);
          this.isBusy = false;
          this.hasError = true;
          this.errorMessage = "An error occured adding the new cohort member";
        }
      );
  }

  public isValid(): boolean {
    if (!(this.patient && this.patient.uuid)) {
      this.errorMessage = "patient is required";
      this.hasError = true;
      return false;
    }

    if (!(this.cohort && this.cohort.uuid)) {
      this.errorMessage = "cohort isn required";
      this.hasError = true;
      return false;
    }
    return true;
  }

  public resolveCohortUuidToCohort() {
    this.cohortResourceService
      .getCohort(this._cohortUuid, "ref")
      .pipe(take(1))
      .subscribe(
        (cohort) => {
          this.cohort = cohort;
        },
        (error) => {
          console.error("Error occured while resolving cohort", error);
          this.hasError = true;
          this.errorMessage = "Error occured while resolving cohort";
        }
      );
  }

  public resolvePatientUuidToPatient() {
    this.patientResourceService
      .getPatientByUuid(this._patientUuid, true)
      .pipe(take(1))
      .subscribe(
        (patient) => {
          this.patient = new Patient(patient);
        },
        (error) => {
          console.error("Error occured while resolving patient", error);
          this.hasError = true;
          this.errorMessage = "Error occured while resolving patient";
        }
      );
  }
}
