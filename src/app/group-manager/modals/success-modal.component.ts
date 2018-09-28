import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';


@Component({
    selector: 'success-modal',
    template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">Success</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="modalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <span><i class="fa fa-check-circle" style="color:green"></i> {{successMsg}} </span>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="modalRef.hide()"> OK </button>
    </div>
  `,
    styles: [``]
})

export class SuccessModalComponent implements OnInit {
  public successMsg: string;
  constructor(public modalRef: BsModalRef) {}

  ngOnInit() {

  }
}
