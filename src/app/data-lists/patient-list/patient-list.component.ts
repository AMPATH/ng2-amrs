import {
  Component, OnInit, Input, Output,
  EventEmitter
} from '@angular/core';
import { PatientListColumns } from './patient-list-columns.data';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/Rx';

let _ = require('lodash');

@Component({
  selector: 'patient-list',
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {

  @Input() extraColumns: any;
  @Input() overrideColumns: any;
  @Input() data: any = [];
  @Input() newList: any;
  loadedTab: any;
  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  private _data = new BehaviorSubject<any>([]);
  constructor(private router: Router) {
  }

  ngOnInit() {
    this._data
      .subscribe(x => {
        this.loadedTab = x;
      });
  }

  columns() {
    let columns = PatientListColumns.columns();
    if (this.extraColumns && typeof Array.isArray(this.extraColumns)) {
      columns.concat(this.extraColumns);
    }

    if (this.overrideColumns && _.isArray(this.overrideColumns)) {
      _.each(this.overrideColumns, (col) => {
        _.each(columns, (_col) => {
          if (col['field'] === _col['field']) {
            _.extend(_col, col);
          }
        });
      });
    }

    return columns;
  }

  get rowData() {

    let d: any = this.data || [];
    let count = 1;

    _.forEach(d, function (row) {
      row['#'] = count;
      if (!row['person_name']) {
        row['person_name'] = row['given_name'] + ' ' + row['family_name']
          + ' ' + row['middle_name'];
      }
      count++;
    });

    return this.data || [];
  }

  loadSelectedPatient(event: any) {
    let patientUuid = '';
    if (event) {
      patientUuid = event.node.data.uuid;
    }

    if (patientUuid === undefined || patientUuid === null) {
      return;
    }

    this.router.navigate(['/patient-dashboard/' + patientUuid + '/patient-info']);
  }

}
