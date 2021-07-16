import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import * as Moment from "moment";
import { Subject } from "rxjs";
import { Patient } from "../../models/patient.model";

@Component({
  selector: "group-transfer-modal",
  template: `
    <div class="modal-header">
      Warning
      <button
        type="button"
        class="close pull-right"
        aria-label="Close"
        (click)="modalRef.hide()"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <h5>
        {{ patient.person.display }} is enrolled in
        {{ groupToUnenroll.cohort.name }} under DC program. Would you like to
        <b>unenroll</b> from <b>{{ groupToUnenroll.cohort.name }}</b> and
        <b>enroll</b> in <b>{{ groupToEnroll.name }}</b
        >?
      </h5>
    </div>
    <div class="modal-footer">
      <button class="btn btn-danger" (click)="confirm()">Yes</button>
      <button class="btn btn-default" (click)="hide()">Cancel</button>
    </div>
  `,
  styles: [``],
})
export class GroupTransferModalComponent implements OnInit {
  onConfirm: Subject<boolean> = new Subject();
  groupToEnroll: any;
  groupToUnenroll: any;
  patient: Patient;

  constructor(public modalRef: BsModalRef) {}

  ngOnInit() {}

  confirm() {
    this.modalRef.hide();
    this.onConfirm.next(true);
  }

  hide() {
    this.modalRef.hide();
  }
}
