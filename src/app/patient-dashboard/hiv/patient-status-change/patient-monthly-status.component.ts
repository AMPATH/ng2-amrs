import { take } from "rxjs/operators";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import * as Moment from "moment";
import { PatientCareStatusResourceService } from "../../../etl-api/patient-care-status-resource.service";
import { PatientService } from "../../services/patient.service";
import { Patient } from "../../../models/patient.model";

@Component({
  selector: "patient-monthly-status",
  templateUrl: "./patient-monthly-status.component.html",
})
export class PatientMonthlyStatusComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public loadingHistory = true;
  public historySubscription: Subscription;
  public subscription: Subscription;
  public careStatusHistory = [];
  public statusMap = {
    active_return: "Active",
    new_enrollment: "New Enrollment",
    transfer_in: "Transferred In",
    LTFU: "LTFU",
    transfer_out: "Transferred Out",
    dead: "Dead",
    HIV_negative: "HIV negative",
    self_disengaged: "Self Disengaged",
    node: "None",
  };
  public error = false;
  constructor(
    private patientService: PatientService,
    private patientCareStatusResourceService: PatientCareStatusResourceService
  ) {}

  public ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.getCareStatusHistory();
        }
      }
    );
  }
  public ngOnDestroy(): void {
    this.resetSubscriptions();
  }
  public getCareStatusHistory() {
    if (this.patient) {
      const endDate = Moment().format("YYYY-MM-DD");
      const startDate = Moment().subtract(12, "months").format("YYYY-MM-DD");
      this.loadingHistory = true;
      this.historySubscription = this.patientCareStatusResourceService
        .getMonthlyPatientCareStatus({
          startDate: startDate,
          endDate: endDate,
          patient_uuid: this.patient.uuid,
        })
        .pipe(take(1))
        .subscribe(
          (result) => {
            this.loadingHistory = false;
            this.careStatusHistory = result.result;

            if (Array.isArray(this.careStatusHistory)) {
              this.careStatusHistory = this.careStatusHistory.reverse();
            }
          },
          (error) => {
            this.loadingHistory = false;
            this.error = true;
          }
        );
    }
  }

  private resetSubscriptions() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
    }
  }
}
