
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

  public subscription: any;
  public busy: Subscription;
  public display = false;
  public displayMassAssign = false;
  public caseForManager: any;
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
      width: 50,
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
      template: this.buttonRenderer(),
      width: 250,
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
    this.caseManagers = [
    ];
  }

  public followUp(patientUuid) {
    console.log(patientUuid);
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/general/general/formentry/6ffdf5c2-922a-4c4d-9349-bc6da6ea9d6c']);
  }
  public getManager() {
    this.subscription = this.caseManagementResourceService.getCaseManagers(
      (managers) => {
        if (managers) {
          this.caseManagers = managers;
        }
      });
  }
  public changeManager(data) {
    this.display = true;
    this.patient = data.patient_name;
    this.patientUuid = data.patient_uuid;
    this.currentManager = data.case_manager;
  }
  public setCaseManager(data) {
    this.newManager = data;
  }
  public updateCaseManager(multiple: boolean) {
    const caseManagerPayload = [];
    if (multiple) {

    } else {
      caseManagerPayload.push({
        attributes: [
          {
            attributeType: '9a6e12b5-98fe-467a-9541-dab11ad87e45',
            value: this.newManager.user_uuid
          }
        ]
      });
      this.caseManagementResourceService.updateCaseManagers(caseManagerPayload, this.patientUuid)
        .subscribe(
          data => { this.showSuccessAlert = true; this.display = false; this.successAlert = 'Case manager Changed Successfully'; },
          err => { this.showErrorAlert = true; this.errorAlert = 'Unable to change case managers'; }
        );
    }
  }
  public onCellClicked(e) {
    if (e.event.target !== undefined) {
      const data = e.data;
      const actionType = e.event.target.getAttribute('data-action-type');

      switch (actionType) {
        case 'followup':
          return this.followUp(data.patient_uuid);
        case 'changemanager':
          return this.changeManager(data);
      }
    }
  }
  public rowSelected(event) {
    if (event.api.getSelectedRows().length > 0) {
      event.columnApi.setColumnVisible('action', false, 'api');
    } else {
      event.columnApi.setColumnVisible  ('action', true, 'api');
    }
  }
  public massAssignCaseManagers(isSubmiting) {
    this.displayMassAssign = true;
    this.patientList = this.gridOptions.api.getSelectedRows();
    this.caseManagers = [
      { label: 'A', 'uuid': 'uiuid', current_cases: 10 },
      { label: 'B', 'uuid': 'uiuidb', current_cases: 1 }
    ];
    const massAssignPayload = {
      patients: this.patientList,
      caseManagers: this.caseForManager
    };
    if (isSubmiting) {
      console.log(massAssignPayload);
    }
  }
  public dismissDialog() {
    this.display = false;
    this.displayMassAssign = false;
  }
  public incrementCases(data, element) {
    this.caseForManager.push({count: data.target.value, user_uuid: element});
  }
  public trackByFn(index: any, item: any) {
    return index;
 }
  public buttonRenderer() {
    return '<div class="button" style="padding-left:2%"><span>' +
      '<button type="button" data-action-type="followup" class="btn btn-primary btn-sm">Follow Up</button>' +
      '</span>' +
      '<span>' +
      '<button type="button" data-action-type="changemanager" class="btn btn-default btn-sm" style="margin-left:5px;">' +
      'Change Manager</button>' +
      '</span>' +
      '</div>';
  }
}
