import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { Subject } from 'rxjs';

@Component({
    selector: 'date-picker-modal',
    template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="modalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="start-date">{{label}}</label>
        <div class="input-group">
          <input class="form-control" style="float:none" placeholder="Select a date" ngx-mydatepicker name="mydate"
            [(ngModel)]="date" #dp="ngx-mydatepicker" required/>

          <span class="input-group-btn">
            <button type="button" class="btn btn-default" (click)="dp.toggleCalendar()">
              <i class="glyphicon glyphicon-calendar"></i>
            </button>
          </span>
        </div>

      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="save(date.jsdate)" [disabled]="!date">{{okBtnText}}</button>
      <button type="button" class="btn btn-danger" (click)="modalRef.hide()"> {{closeBtnText}} </button>
    </div>
  `,
    styles: [``]
})

export class DatePickerModalComponent implements OnInit {
   onSave: Subject<Date> = new Subject();
   successMsg: string;
   label: string;
   okBtnText = 'OK';
   closeBtnText = 'Cancel';
   title = '';
   date = {
        date: {
            'year': Moment().year(),
            'month': Moment().month(),
            'day': Moment().date()
        },
        jsdate: new Date()
   };


  constructor(public modalRef: BsModalRef) {}

  ngOnInit() {

  }

  save(date) {
      this.modalRef.hide();
      this.onSave.next(date);
  }
}
