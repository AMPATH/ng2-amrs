import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';
import {
  PatientReferralResourceService
} from '../../etl-api/patient-referral-resource.service';
import { SelectDepartmentService } from '../../shared/services/select-department.service';

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
  public extraColumns: Array<any> = [];
  public patientData: Array<any> = [];
  public programName: any;
  public startIndex = 0;
  public isLoading = false;
  public dataLoaded = false;
  public gridOptions: any = {
    columnDefs: []
  };
  public department: any;

  /* tslint:disable:no-input-rename */
  @Input('rowData')
  public set data(v: any[]) {
    if (v.length > 0) {
      this._data = v;
      // Clear patientData whenever you receive new data from the server
      this.patientData = [];
    }
  }

  public get data(): Array<any> {
    return this._data;
  }

  private _data: Array<any>;

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  private _notificationStatus = 'All';

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

  constructor(
    private router: Router,
    public selectDepartmentService: SelectDepartmentService,
    public resourceService: PatientReferralResourceService) {
  }

  public ngOnInit() { }

  public setColumns(sectionsData: Array<any>) {
    const defs = [];
    defs.push({
      headerName: 'Location',
      field: 'location',
      // pinned: 'left',
      rowGroup: true,
      hide: true
    },
      {
        headerName: 'Program',
        field: 'program'
      });
    if (this.data) {
      _.each(sectionsData, (data) => {
        defs.push({
          headerName: this.titleCase(data.name),
          field: data.name
        });
      });
    }

    this.gridOptions.columnDefs = defs;

    this.gridOptions.groupDefaultExpanded = -1;
    this.gridOptions.enableColResize = true;
    this.gridOptions.enableSorting = false;
    this.gridOptions.enableFilter = false;
    this.gridOptions.toolPanelSuppressSideButtons = true;
    this.gridOptions.getRowStyle = (params) => {
      return { 'font-size': '14px', 'cursor': 'pointer' };
    };

    this.gridOptions.onGridReady = (event) => {
      setTimeout(() => {
        if (this.gridOptions.api) {
          this.agGrid.api.setColumnDefs(defs);
          this.gridOptions.api.sizeColumnsToFit();
          // this.gridOptions.groupDefaultExpanded = -1;
        }
      }, 500, true);
    };

  }

  public titleCase(str) {
    return str.toLowerCase().split('_').map((word) => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  public onCellClicked(event) {
    this.programName = event.data.program;
    this.generatePatientListReport(event);
  }

  public generatePatientListReport(data) {
    this.isLoading = true;
    const filterLocation = data.data.locationUuids ? data.data.locationUuids : null;
    this.department = this.selectDepartmentService.getUserSetDepartment();
    this.resourceService.getPatientReferralPatientList({
      endDate: this.toDateString(this._dates.endDate),
      locationUuids: filterLocation,
      startDate: this.toDateString(this._dates.startDate),
      programUuids: data.data.programUuids ? data.data.programUuids : null,
      startIndex: this.startIndex ? this.startIndex : null,
      notificationStatus: null,
      department: this.department
    }).take(1).subscribe((report) => {
      this.patientData = report;
      // this.patientData ? this.patientData.concat(report) : report;
      this.isLoading = false;
      this.startIndex += report.length;
      if (report.length < 300) {
        this.dataLoaded = true;
      }
      this.overrideColumns.push(
        {
          field: 'identifiers',
          headerName: 'Identifier',
          onCellClicked: (column) => {
            this.redirectToPatientInfo(column.data.patient_uuid);
          },
          cellRenderer: (column) => {
            return '<a href="javascript:void(0);" title="Identifiers">'
              + column.value + '</a>';
          }
        }
      );
      this.extraColumns.push(
        {
          field: 'date_referred',
          headerName: 'Date Referred'
        },
        {
          field: 'referred_from',
          headerName: 'Referred From'
        },
        {
          field: 'referred_to',
          headerName: 'Referred To'
        },
        {
          field: 'review_status',
          headerName: 'Review Status',
          cellStyle: function (params) {
            if (params.value === 'PENDING') {
              return { color: '#202124' };
            } else if (params.value === 'DONE') {
              return { color: '#5F6368' };
            } else {
              return null;
            }
          }
        },
        {
          field: 'phone_number',
          headerName: 'Phone Number'
        }
      );
    });
  }

  public loadMorePatients() {
    // this.generatePatientListReport();
  }

  public redirectToPatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/general']);

  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

}
