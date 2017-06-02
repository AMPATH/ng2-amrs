
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Rx';
@Component({
  selector: 'hiv-summary-tabular',
  templateUrl: 'hiv-summary-tabular.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class HivSummaryTabularComponent implements OnInit {
  routeParamsSubscription: Subscription;
  startDate: any;
  endDate: any;
  public gridOptions: any = {
    columnDefs: []
  };
  @Input('rowData')
  public data: Array<any> = [];

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;


  private _sectionDefs: Array<any>;
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }
  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    this._sectionDefs = v;
    this.setColumns(v);

  }
  private _dates: any;
  public get dates(): any {
    return this._dates;
  }
  @Input('dates')
  public set dates(v: any) {
    this._dates = v;
  }

  private _gender: any;
  public get gender(): any {
    return this._gender;
  }
  @Input('gender')
  public set gender(v: any) {
    this._gender = v;
  }

  private _age: any;
  public get age(): any {
    return this._age;
  }
  @Input('age')
  public set age(v: any) {
    this._age = v;
  }

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() { }
  setColumns(sectionsData: Array<any>) {
    let defs = [];
    defs.push({
      headerName: 'Location',
      field: 'location',
      pinned: 'left'
    });
    if (this.data[0]) {
      _.each(Object.keys(this.data[0]), (selected) => {
        _.each(sectionsData, (data) => {
          if (selected === data.name) {
            defs.push({
              headerName: this.titleCase(data.label),
              field: data.name
            });
          }
        });
      });
    }
    this.gridOptions.columnDefs = defs;
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }
  titleCase(str) {
    return str.toLowerCase().split(' ').map((word) => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  onCellClicked(event) {
    this.goToPatientList(event);
  }

  goToPatientList(data) {
    this.startDate = moment(this._dates.startDate);
    this.endDate = moment(this._dates.endDate);
    this.router.navigate(['../patient-list', data.colDef.field,
      this.startDate.format('DD/MM/YYYY') + '|' + this.endDate.format('DD/MM/YYYY'),
      this.gender ? this.gender : 'F,M', this.age.startAge + '|' + this.age.endAge],
      { relativeTo: this.route });
  }
}
