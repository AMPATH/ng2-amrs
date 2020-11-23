import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as rison from 'rison-node';
import * as Moment from 'moment';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';

@Component({
  selector: 'edit-contact-trace',
  styleUrls: ['./edit-contact-trace.component.css'],
  templateUrl: './edit-contact-trace.component.html'
})
export class EditContactTraceComponent implements OnInit {
  public contactType: Array<{ label: string; val: number }> = [
    { label: 'Phone tracing', val: 1555 },
    { label: 'Physical tracing', val: 10791 }
  ];
  public displayNotContactedReasons: boolean;
  public selectedContactType: number;
  public contactedDate: string = Moment(new Date()).format('YYYY-MM-DD');
  public contactStatus: Array<{ label: string; val: number }> = [
    { label: 'Contacted and linked', val: 1065 },
    { label: 'Contacted but not linked', val: 1066 },
    { label: 'Not contacted', val: 1118 }
  ];
  public selectedContactedStatus;
  public remarks;
  public physicalNotContactedReasons = [
    { label: 'No locator information', val: 1550 },
    { label: 'Incorrect locator information', val: 1561 },
    { label: 'Migrated ', val: 1562 },
    { label: 'Not found at home', val: 1563 },
    { label: 'Calls not going through', val: 1550 },
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
  public rowId: number;
  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      const contactInformation = rison.decode(params.state);
      this.contactedDate = Moment(contactInformation.contact_date).format(
        'YYYY-MM-DD'
      );
      this.remarks = contactInformation.remarks;
      this.selectedContactType =
        contactInformation.contact_type === 'Phone tracing' ? 1555 : 10791;
      this.selectedContactedStatus = Number(
        this.contactStatus.find(
          (status) => status.label === contactInformation.contact_status
        ).val
      );
      this.contactId = contactInformation.contact_id;
      this.rowId = contactInformation.id;
      this.getNotContactedReasons(contactInformation.reason_not_contacted);
    });
  }

  constructor(
    private familyTestingService: FamilyTestingService,
    private location: Location,
    private router: ActivatedRoute
  ) {}

  public updateContactTrace() {
    const payload = {
      id: this.rowId,
      contact_id: this.contactId,
      contact_date: this.contactedDate,
      contact_type: Number(this.selectedContactType),
      contact_status: Number(this.selectedContactedStatus),
      reason_not_contacted: Number(this.selectedNotContactedStatusReasons),
      remarks: this.remarks
    };
    this.familyTestingService.updatePatientContactTrace(payload).subscribe(
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
    if (Number(status.target.value) === 1118) {
      this.displayNotContactedReasons = true;
    } else {
      this.displayNotContactedReasons = false;
    }
  }

  public onNotContactedChange(reason) {
    this.selectedNotContactedStatusReasons = reason.target.value;
  }

  public goBack() {
    this.location.back();
  }

  public getNotContactedReasons(reasonNotContacted) {
    if (this.selectedContactedStatus === 1118) {
      this.displayNotContactedReasons = true;
    } else {
      this.displayNotContactedReasons = false;
    }

    if (this.selectedContactType === 1555) {
      this.notContactedStatusReasons = this.phoneNotContactedReasons;
      this.selectedNotContactedStatusReasons = this.phoneNotContactedReasons.find(
        (reason) => reason.label.includes(reasonNotContacted)
      ).val;
    } else {
      this.notContactedStatusReasons = this.physicalNotContactedReasons;
      this.selectedNotContactedStatusReasons = this.physicalNotContactedReasons.find(
        (reason) => reason.label.includes(reasonNotContacted)
      ).val;
    }
  }
}
