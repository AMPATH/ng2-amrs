
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid';

import { CaseManagementResourceService } from './../../etl-api/case-management-resource.service';


@Component({
    selector: 'case-management-patient-list',
    templateUrl: './case-management-patient-list.component.html',
    styleUrls: ['./case-management-patient-list.component.css']
})

export class CaseManagementPatientListComponent implements OnInit {

  public title = '';
  public patients: any = [];
  public patientList = [];
  @Input() public rowData = [];

  public params: any;
  public busy: Subscription;
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    onGridSizeChanged: () => {
      if (this.gridOptions.api) {
       // this.gridOptions.api.sizeColumnsToFit();
      }
    },
    onGridReady: () => {
      if (this.gridOptions.api) {
        // this.gridOptions.api.sizeColumnsToFit();
      }
    }
  };
  public caseMgmtColdef: any = [
    {
      lockPosition: true,
      headerName: 'No',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'locked-col',
      width: 50,
      suppressNavigable: true,
      pinned: 'left'
    },
    {
      headerName: 'Case Manager',
      field: 'case_manager',
      width: 400
    },
    {
      headerName: 'Name',
      field: 'patient_name',
      width: 200
    },
    {
      headerName: 'Age',
      field: 'age',
      width: 50
    },
    {
      headerName: 'Gender',
      field: 'gender',
      width: 70
    },
    {
      headerName: 'Last Followup Date',
      field: 'last_follow_up_date',
      width: 100
    },
    {
      headerName: 'Days Since Followup',
      field: 'days_since_follow_up',
      width: 170
    },
    {
      headerName: 'RTC',
      field: 'rtc_date',
      width: 250
    },
    {
      headerName: 'Phone RTC',
      field: 'phone_rtc_date',
      width: 200
    },
    {
      headerName: 'Last VL',
      field: 'last_vl',
      width: 150
    },
    {
      headerName: 'Due for VL',
      field: 'due_for_vl',
      width: 100
    },
    {
      headerName: 'Missed Appoitment',
      field: 'current_vl_date',
      width: 150
    },
    {
      headerName: 'Action',
      field: 'action',
      width: 100,
      pinned: 'right'
    },
    {
      headerName: 'Patient Uuid',
      field: 'patient_uuid',
      width: 300,
      hide: true
    }

  ];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private caseManagementResourceService: CaseManagementResourceService) {

  }

  public ngOnInit() {

  }

}
