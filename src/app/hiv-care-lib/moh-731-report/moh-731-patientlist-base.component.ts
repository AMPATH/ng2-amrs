import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Moh731ReportBaseComponent } from './moh-731-report-base.component';
import { Moh731ResourceService } from './moh-731-fake-resource';
import * as moment from 'moment';
import Moment = moment.Moment;

@Component({
  selector: 'moh-731-patientlist-base',
  template: `<div class="moh moh-731 patientlist"><moh-731-patientlist></moh-731-patientlist></div>`
})
export class Moh731PatientListBaseComponent extends Moh731ReportBaseComponent implements OnInit {
  constructor(public route: ActivatedRoute,
              public moh731Resource: Moh731ResourceService) {
    super(moh731Resource);
    if (this.locationUuids && this.locationUuids.length > 0) {
      this.locationUuids.push('18c343eb-b353-462a-9139-b16606e6b6c2');
    } else {
      this.locationUuids = [];
      this.locationUuids.push('18c343eb-b353-462a-9139-b16606e6b6c2');
    }
  }
}
