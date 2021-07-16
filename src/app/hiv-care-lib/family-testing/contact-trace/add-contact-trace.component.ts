import { take } from "rxjs/operators";
import { Component, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EventEmitter } from "events";
import { Location } from "@angular/common";

import * as _ from "lodash";
import * as Moment from "moment";
import { FamilyTestingService } from "src/app/etl-api/family-testing-resource.service";
import { EncounterResourceService } from "./../../../openmrs-api/encounter-resource.service";
@Component({
  selector: "add-contact-trace",
  templateUrl: "./add-contact-trace.component.html",
  styleUrls: ["./add-contact-trace.component.css"],
})
export class AddContactTraceComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public patientUuid: string;
  public patientEncounters: Array<any> = [];

  public contactType: Array<{ label: string; val: number }> = [
    { label: "Phone tracing", val: 1555 },
    { label: "Physical tracing", val: 10791 },
  ];
  public displayNotContactedReasons: boolean;
  public selectedContactType: number;
  public contactedDate: string = Moment(new Date()).format("YYYY-MM-DD");
  public contactStatus: Array<{ label: string; val: number }> = [
    { label: "Contacted", val: 1065 },
    { label: "Not contacted", val: 1118 },
  ];
  public selectedContactedStatus: string;
  public selectedNotContactedStatusReasons: string;
  public remarks;
  public contactInfo: any;

  public physicalNotContactedReasons = [
    { label: "Incorrect locator information", val: 1 },
    { label: "Not found/Travelled", val: 2 },
    { label: "Not known in the area", val: 3 },
    { label: "Relocated ", val: 4 },
    { label: "Deceased", val: 5 },
    { label: "Other ", val: 6 },
  ];

  public phoneNotContactedReasons = [
    { label: "Invalid phone number", val: 7 },
    { label: "Phone off", val: 8 },
    { label: "Wrong phone number", val: 9 },
    { label: "other", val: 6 },
  ];

  public notContactedStatusReasons = [];
  public contactId: number;
  public openFamilyTestingForm = false;
  public showAlertSuccess = false;
  public disableSaveButton = true;
  public familyAndPartnerTestingFormUuid =
    "3fbc8512-b37b-4bc2-a0f4-8d0ac7955127";

  public ngOnInit() {
    this.route.parent.queryParams.subscribe((param) => {
      if (param.contact_id) {
        this.contactId = Number(param.contact_id);
        this.getContactInfo(this.contactId);
      }

      this.patientUuid = localStorage.getItem("family_testing_patient_uuid");
      if (this.patientUuid != null) {
        this.getPatientEncounters(this.patientUuid);
      }
    });
  }

  constructor(
    private familyTestingService: FamilyTestingService,
    private location: Location,
    private route: ActivatedRoute,
    public router: Router,
    private encounterResourceService: EncounterResourceService
  ) {}

  public saveContactTrace() {
    const payload = {
      contact_id: this.contactId,
      contact_date: this.contactedDate,
      contact_type: this.selectedContactType
        ? this.selectedContactType
        : this.selectedContactType,
      contact_status: this.selectedContactedStatus
        ? this.selectedContactedStatus
        : 0,
      reason_not_contacted: this.selectedNotContactedStatusReasons
        ? this.selectedNotContactedStatusReasons
        : 0,
      remarks: this.remarks ? this.remarks : "",
    };
    this.familyTestingService.savePatientContactTrace(payload).subscribe(
      (response: Response) => {
        this.showAlertSuccess = true;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public onContactTypeChange(contact) {
    this.selectedContactType = contact.target.value;
    if (Number(contact.target.value) === 10791) {
      this.notContactedStatusReasons = this.physicalNotContactedReasons;
    } else {
      this.notContactedStatusReasons = this.phoneNotContactedReasons;
    }
  }

  public onContactStatusChange(status) {
    this.selectedContactedStatus = status.target.value;
    this.disableSaveButton = false;
    if (Number(status.target.value) === 1065) {
      this.openFamilyTestingForm = true;
      this.displayNotContactedReasons = false;
    } else {
      this.openFamilyTestingForm = false;
      this.displayNotContactedReasons = true;
    }
  }

  public onNotContactedChange(event) {
    this.selectedNotContactedStatusReasons = event.target.value;
  }

  public openFamilyHistoryForm() {
    const encounterUuid = _.first(this.patientEncounters).uuid;
    const url = `/patient-dashboard/patient/${this.patientUuid}/general/general/formentry/${this.familyAndPartnerTestingFormUuid}`;
    this.router.navigate([url], {
      queryParams: { encounter: encounterUuid, visitTypeUuid: "" },
    });
  }

  public getPatientEncounters(patientUuid) {
    this.encounterResourceService
      .getEncountersByPatientUuid(patientUuid, false, null)
      .pipe(take(1))
      .subscribe((resp) => {
        this.patientEncounters = resp.reverse().filter((encounter) => {
          if (encounter.form) {
            return encounter.form.uuid === this.familyAndPartnerTestingFormUuid;
          }
        });
      });
  }

  public getContactInfo(contact_id) {
    this.familyTestingService
      .getContactTraceHistory(contact_id)
      .subscribe((res) => {
        if (res) {
          this.contactInfo = res.result[0];
          this.getPatientEncounters(this.patientUuid);
        }
      });
  }

  public goBack() {
    this.location.back();
  }
}
