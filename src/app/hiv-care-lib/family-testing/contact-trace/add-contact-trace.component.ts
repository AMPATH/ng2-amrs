import { take } from 'rxjs/operators';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from 'events';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import * as Moment from 'moment';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';
import { EncounterResourceService } from './../../../openmrs-api/encounter-resource.service';
import { LocalStorageService } from './../../../utils/local-storage.service';
@Component({
  selector: 'add-contact-trace',
  templateUrl: './add-contact-trace.component.html',
  styleUrls: ['./add-contact-trace.component.css']
})
export class AddContactTraceComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public patientUuid: string;
  public patientEncounters: Array<any> = [];

  public contactType: Array<{ label: string; val: number }> = [
    { label: 'Phone tracing', val: 1555 },
    { label: 'Physical tracing', val: 10791 }
  ];
  public displayNotContactedReasons: boolean;
  public selectedContactType: number;
  public contactedDate: string = Moment(new Date()).format('YYYY-MM-DD');
  public contactStatus: Array<{ label: string; val: number }> = [
    { label: 'Contacted', val: 1065 },
    { label: 'Not contacted', val: 1118 }
  ];
  public selectedContactedStatus: string;
  public remarks;
  public physicalNotContactedReasons = [
    { label: 'No locator information', val: 1550 },
    { label: 'Incorrect locator information', val: 1561 },
    { label: 'Migrated ', val: 1562 },
    { label: 'Not found at home', val: 1563 },
    { label: 'Died ', val: 1593 },
    { label: 'other ', val: 5622 }
  ];

  public phoneNotContactedReasons = [
    { label: 'No locator information', val: 1550 },
    { label: 'Calls not going through', val: 1560 },
    { label: 'Incorrect locator information', val: 1561 },
    { label: 'Died', val: 1593 },
    { label: 'other', val: 5622 }
  ];
  public notContactedStatusReasons = [];
  // concept 1107 === None
  public selectedNotContactedStatusReasons = 1107;
  public contactId: number;

  public ngOnInit() {
    this.route.parent.queryParams.subscribe((param) => {
      if (param) {
        this.contactId = Number(param.contact_id);
      }
    });
    this.patientUuid = localStorage.getItem('family_testing_patient_uuid');
    if (this.patientUuid != null) {
      this.getPatientEncounters(this.patientUuid);
    }
  }

  constructor(
    private familyTestingService: FamilyTestingService,
    private location: Location,
    private route: ActivatedRoute,
    public router: Router,
    private encounterResourceService: EncounterResourceService,
    private localStorageService: LocalStorageService
  ) {}

  public saveContactTrace() {
    const payload = {
      contact_id: this.contactId,
      contact_date: this.contactedDate,
      contact_type: this.selectedContactType,
      contact_status: this.selectedContactedStatus,
      reason_not_contacted: this.selectedNotContactedStatusReasons,
      remarks: this.remarks
    };
    this.familyTestingService.savePatientContactTrace(payload).subscribe(
      (response: Response) => {
        this.location.back();
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
    if (Number(status.target.value) === 1065) {
      // this.saveContactTrace();
      this.openFamilyHistoryForm();
      this.displayNotContactedReasons = true;
    }
  }

  public openFamilyHistoryForm() {
    const encounterUuid = _.first(this.patientEncounters).uuid;
    const familyPartnerHistoryFormV1 = `3fbc8512-b37b-4bc2-a0f4-8d0ac7955127`;
    const url = `/patient-dashboard/patient/${this.patientUuid}/general/general/formentry/${familyPartnerHistoryFormV1}`;
    this.router.navigate([url], {
      queryParams: { encounter: encounterUuid, visitTypeUuid: '' }
    });
  }

  public getPatientEncounters(patientUuid) {
    const familyAndPartnerTestingFormUuid =
      '3fbc8512-b37b-4bc2-a0f4-8d0ac7955127';
    this.encounterResourceService
      .getEncountersByPatientUuid(patientUuid, false, null)
      .pipe(take(1))
      .subscribe((resp) => {
        this.patientEncounters = resp.reverse().filter((encounter) => {
          if (encounter.form) {
            return encounter.form.uuid === familyAndPartnerTestingFormUuid;
          }
        });
      });
  }

  public goBack() {
    this.location.back();
  }
}
