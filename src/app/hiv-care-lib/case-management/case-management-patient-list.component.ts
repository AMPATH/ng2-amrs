
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
  public patient: any;
  public patientUuid: any;
  public currentManager: any;
  public newManager: any;
  public caseManagers: any;
  public patientList = [];
  public errors: any = [];
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;
  public successAlert = '';
  public gridApi: any;
  public gridColumnApi: any;
  @Input() public rowData = [];
  public params: any;
  @Input() public locationUuids: any;
  public subscription: any;
  public busy: Subscription;
  public display = false;
  public displayMassAssign = false;
  public caseForManager: any;
  public caseAssignment = 0;
  public displayMassAssignBtn = true;
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    rowSelection: 'multiple',
    onRowSelected: this.rowSelected,
    onGridSizeChanged: () => {
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
      width: 150,
      suppressNavigable: true,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true
    },
    {
      headerName: 'Case Manager',
      field: 'case_manager',
      width: 400
    },
    {
      headerName: 'Name',
      field: 'patient_name',
      width: 200,
      onCellClicked: (column: any) => {
        const patientUuid = column.data.patient_uuid;
        this.redirectTopatientInfo(patientUuid);
      },
      cellRenderer: (column: any) => {
          return '<a href="javascript:void(0)";>' + column.value + '</a>';
      }
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
      width: 150
    },
    {
      headerName: 'Days Since Followup',
      field: 'days_since_follow_up',
      width: 170
    },
    {
      headerName: 'RTC',
      field: 'rtc_date',
      width: 150
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
      field: 'patients_due_for_vl',
      width: 100,
      cellRenderer: (column: any) => {
        if (column.value === 1) {
          return '<input type="checkbox" disabled="disabled" checked="checked">';
        } else {
           return '';
        }
       }
    },
    {
      headerName: 'Missed Appoitment',
      field: 'missed_appointment',
      cellRenderer: (column: any) => {
        if (column.value === 1) {
          return '<input type="checkbox" disabled="disabled" checked="checked">';
        } else {
           return '';
        }
    },
      width: 150
    },
    {
      headerName: 'Action',
      field: 'action',
      onCellClicked: (column: any) => {
        const patientUuid = column.data.patient_uuid;
        this.followUp(patientUuid);
      },
      cellRenderer: (column) => {
          return '<a> <i class="fa fa-phone-square" aria-hidden="true"></i> Follow Up </a>';
      },
      width: 150,
      pinned: 'right'

    },
    {
      headerName: '',
      field: 'action2',
      onCellClicked: (column: any) => {
        const data = column.data;
        this.changeManager(data);
      },
      cellRenderer: (column) => {
          return '<a> <i class="fa fa-user-md" aria-hidden="true"></i> Change Manager </a>';
      },
      width: 150,
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
    // Get managers
    this.caseForManager = [];
    this.caseManagers = [];
    this.route
    .queryParams
    .subscribe((params: any) => {
        if (params) {
          this.params = params;
          this.getCaseManagers();
          this.displayMassAssignBtn = params.hasCaseManager === false ? true : false;
        }
      }, (error) => {
        console.error('Error', error);
      });

  }

  public followUp(patientUuid) {
    console.log(patientUuid);
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/hiv/hiv/visit']);
  }
  public getCaseManagers() {
    const locationParams = this.getLocationParams();
    this.caseManagementResourceService.getCaseManagers(locationParams)
        .subscribe((data: any) => {
            this.caseManagers = data.result;
        });

}

public getLocationParams() {
    return {
        'locationUuid': this.params.locationUuid
    };
}
  public changeManager(data) {
    this.getCaseManagers();
    this.display = true;
    this.patient = data.patient_name;
    this.patientUuid = data.patient_uuid;
    this.currentManager = data.case_manager;
  }
  public setCaseManager(data) {
    this.newManager = data;
  }
  public updateCaseManager(multiple: boolean) {
    const caseManagerPayload = {'attributes': [{
            'attributeType': '9a6e12b5-98fe-467a-9541-dab11ad87e45',
            'value': this.newManager.user_uuid
          }]};
      this.caseManagementResourceService.updateCaseManagers(caseManagerPayload, this.patientUuid)
        .subscribe(
          data => { this.showSuccessAlert = true; this.display = false; this.successAlert = 'Case manager Changed Successfully'; },
          err => { this.showErrorAlert = true; this.errorAlert = 'Unable to change case managers'; }
        );
  }
  public rowSelected(event) {
    if (event.api.getSelectedRows().length > 0) {
      event.columnApi.setColumnsVisible(['action', 'action2'], false, 'api');
    } else {
      event.columnApi.setColumnsVisible  (['action', 'action2'], true, 'api');
    }
  }
  public massAssignCaseManagers(isSubmiting) {
    this.displayMassAssign = true;
    this.patientList = this.gridOptions.api.getSelectedRows();
    const massAssignPayload = {
      patients: this.patientList,
      caseManagers: this.caseForManager
    };
    console.log(massAssignPayload);
    if (isSubmiting === true) {
      this.caseManagementResourceService.massAssign(massAssignPayload).subscribe(response => {
       this.dismissDialog();
      });
    }
  }
  public dismissDialog() {
    this.display = false;
    this.displayMassAssign = false;
  }
  public incrementCases(data, element, patientList, user_id, user_name ) {
    this.caseAssignment += parseInt(data.target.value, 10);
    if (patientList >= this.caseAssignment) {
      this.caseForManager.push({count: this.caseAssignment, user_uuid: element.trim(), user_id: user_id , user_name: user_name});
      this.showErrorAlert = false;
    } else {
      this.caseAssignment = 0;
      this.showErrorAlert = true;
      this.errorAlert = 'You have exceeded the number of patients to be assigned';
    }

  }
  public trackByFn(index: any, item: any) {
    return index;
 }
 public redirectTopatientInfo(patientUuid) {
  if (patientUuid === undefined || patientUuid === null) {
    return;
  }
  this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
    '/general/general/landing-page']);
}
}
