import { Component, OnInit, Input, Output,
      EventEmitter } from '@angular/core';
import { PatientListColumns } from './patient-list-columns.data';

@Component({
  selector: 'patient-list',
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {

  @Input() extraColumns: any;
  @Input() data: any = [];

  constructor() {
  }

  ngOnInit() {}

  columns() {

    if (this.extraColumns && typeof Array.isArray(this.extraColumns)) {
      return PatientListColumns.columns().concat(this.extraColumns);
    }

    return PatientListColumns.columns();
  }

  get rowData() {

    return this.data || [];
  }
}
