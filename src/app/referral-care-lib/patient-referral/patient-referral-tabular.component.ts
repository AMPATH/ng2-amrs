
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
import { Subscription } from 'rxjs/Rx';
import {
  PatientReferralResourceService
} from '../../etl-api/patient-referral-resource.service';
@Component({
  selector: 'patient-referral-tabular',
  templateUrl: 'patient-referral-tabular.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class PatientReferralTabularComponent implements OnInit {
  public startDate: any;
  public endDate: any;
  public locationUuids: any;
  public overrideColumns: Array<any> = [];
  public patientData: any;
  public startAge: any;
  public stateName: any;
  public endAge: any;
  public stateUuid: any;
  public startIndex: number = 0;
  public isLoading: boolean = false;
  public dataLoaded: boolean = false;
  public gridOptions: any = {
    columnDefs: []
  };
  @Input('rowData')
  public data: Array<any> = [];

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  private routeParamsSubscription: Subscription;
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
  private _programUuid: any;
  public get programUuids(): any {
    return this._programUuid;
  }
  @Input('programUuids')
  public set programUuids(v: any) {
    this._programUuid = v;
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
              private route: ActivatedRoute,
              public resourceService: PatientReferralResourceService) { }

  public ngOnInit() {

  }
  public setColumns(sectionsData: Array<any>) {
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
              headerName: this.titleCase(data.name),
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

  public titleCase(str) {
    return str.toLowerCase().split('_').map((word) => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  public onCellClicked(event) {
    let data = this.getSelectedStates(event);
    this.stateUuid = data;
    this.stateName = event.colDef.headerName.split('_').join(' ');
    this.generatePatientListReport(event);
  }

  public generatePatientListReport(data) {
    // this.patientData = [];
    this.isLoading = true;

    this.resourceService.getPatientReferralPatientList({
      endDate: this.toDateString(this._dates.endDate),
      locationUuids: data.data.locationUuids,
      startDate: this.toDateString(this._dates.startDate),
      startAge: this.startAge,
      endAge: this.endAge,
      gender: this.gender,
      programUuids: this.programUuids,
      stateUuids:  this.stateUuid,
      startIndex: this.startIndex
    }).subscribe((report) => {
      this.patientData = this.patientData ? this.patientData.concat(report) : report;
      this.isLoading = false;
      this.startIndex += report.length;
      if (report.length < 300) {
        this.dataLoaded = true;
      }
      this.overrideColumns.push({
        field: 'identifiers',
        onCellClicked: (column) => {
          this.redirectTopatientInfo(column.data.patient_uuid);
        },
        cellRenderer: (column) => {
          return '<a href="javascript:void(0);" title="Identifiers">'
            + column.value + '</a>';
        }
      });
    });
  }

  public loadMorePatients() {
   // this.generatePatientListReport();
  }

  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/general']);

  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }
  private getSelectedStates(event) {
    console.log('event', event);
    let stateUuid = '';
    let selectedField = event.colDef.field;
    let selectedUuid = selectedField + '_stateUuids';

    _.each(event.data, (v, k) => {
      if (k === selectedUuid) {

        stateUuid = v;
      }

    });
    return  stateUuid;
  }

}
