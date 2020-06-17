
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() public updatePatientList = new EventEmitter();
  public subscription: any;
  public busy: Subscription;
  public display = false;
  public displayMassAssign = false;
  public caseForManager: any;
  public caseAssignment = 0;
  public displayMassAssignBtn = true;
  public unAssignFlag = false;
  public attributeUuid: any;
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    rowSelection: 'multiple',
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
      width: 70,
      suppressNavigable: true,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true
    },
    {
      headerName: 'Follow Up',
      field: 'action',
      onCellClicked: (column: any) => {
        const patientUuid = column.data.patient_uuid;
        this.redirectTopatientInfo(patientUuid);
      },
      cellRenderer: (column) => {
        return '<a> <i class="fa fa-phone-square" aria-hidden="true"></i> Follow Up </a>';
      },
      width: 100

    },
    {
      headerName: 'Change Manager',
      field: 'action2',
      onCellClicked: (column: any) => {
        const data = column.data;
        this.changeManager(data);
      },
      cellRenderer: (column) => {
        let assignBtn = '';
        if (column.data.case_manager_user_id) {
          assignBtn = '<a> <i class="fa fa-user-md" aria-hidden="true"></i> Update Manager </a>';
        } else {
          assignBtn = '<a> <i class="fa fa-user-md" aria-hidden="true"></i> Assign Manager </a>';
        }
        return assignBtn;
      },
      width: 150

    },
    {
      headerName: 'Case Manager',
      field: 'case_manager',
      width: 200
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
      headerName: 'Identifiers',
      field: 'identifiers',
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
      headerName: 'Enrollment Date',
      field: 'enrollment_date',
      width: 150
    },
    {
      headerName: 'Days since Enrollment',
      field: 'days_since_enrollment',
      width: 170
    },
    {
      headerName: 'Last Followup Date',
      field: 'last_follow_up_date',
      width: 200
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
      headerName: 'Medication Pickup Date',
      field: 'med_pickup_rtc_date',
      width: 200
    },
    {
      headerName: 'Phone RTC',
      field: 'next_phone_appointment',
      width: 200
    },
    {
      headerName: 'Last VL',
      field: 'last_vl',
      width: 150
    },
    {
      headerName: 'Last VL Date',
      field: 'last_vl_date',
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
      headerName: 'Days Since Missed Appointment',
      field: 'days_since_missed_appointment',
      width: 250
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
    this.attributeUuid = data.attribute_uuid;
    this.caseForManager = [];
  }
  public setCaseManager(data) {
    this.newManager = data;
    if (data && !this.unAssignFlag) {
      this.caseForManager.push({ count: 1, user_uuid: data.user_uuid, user_id: data.user_id, user_name: data.person_name });
    }

  }
  public updateCaseManager(multiple: boolean) {
    let massAssignPayload = {};
    if (this.unAssignFlag) {
       massAssignPayload = {
        patients: [{patient_uuid: this.patientUuid, attribute_uuid: this.attributeUuid}]
      };
      this.unAssignManager(massAssignPayload);
    } else {
      massAssignPayload = {
        patients: [{ patient_uuid: this.patientUuid }],
        caseManagers: this.caseForManager
      };
    this.caseManagementResourceService.massAssign(massAssignPayload)
      .subscribe(
        data => {
          this.showSuccessAlert = true;
          this.successAlert = 'Case Manager Assigned Successfully"';
          this.caseAssignment = 0;
          this.updatePatientList.emit(true);
          setTimeout(() => {
            this.dismissDialog();
          }, 2000);
        },
        err => { this.showErrorAlert = true; this.errorAlert = 'Unable to change case managers'; }
      );
    }
  }
  public unAssignManager(payload) {
    this.caseManagementResourceService.massUnAssign(payload)
    .subscribe(
      data => {
        this.showSuccessAlert = true;
        this.successAlert = 'Case manager Unassigned Successfully';
        this.caseAssignment = 0;
        this.updatePatientList.emit(true);
        setTimeout(() => {
          this.dismissDialog();
        }, 2000);
      },
      err => { this.showErrorAlert = true; this.errorAlert = 'Unable to unassign case managers'; }
    );
  }
  public massAssignCaseManagers(isSubmiting) {
    this.getCaseManagers();
    this.displayMassAssign = true;
    this.patientList = this.gridOptions.api.getSelectedRows();
    const massAssignPayload = {
      patients: this.patientList,
      caseManagers: this.caseForManager
    };
    if (isSubmiting === true) {
      this.caseManagementResourceService.massAssign(massAssignPayload).subscribe(response => {
        this.showSuccessAlert = true;
        this.successAlert = 'Case manager Changed Successfully';
        setTimeout(() => {
          this.updatePatientList.emit(true);
          this.dismissDialog();
        }, 2000);
      });
    }
  }
  public dismissDialog() {
    this.display = false;
    this.displayMassAssign = false;
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.caseManagers = [];
    this.caseForManager = [];
    this.caseAssignment = 0;
    this.unAssignFlag = false;
  }
  public incrementCases(data, element, patientList, user_id, user_name) {
    let assignedCase = 0;
    if (((patientList - this.caseAssignment) >= 0) && (data.target.value <= patientList)) {
      assignedCase = data.target.value ? parseInt(data.target.value, 10) : 0;
      this.handleDuplicates(assignedCase, element, user_id, user_name);
      this.showErrorAlert = false;
    } else {
      this.handleDuplicates(data.target.value ? parseInt(data.target.value, 10) : 0, element, user_id, user_name);
      this.showErrorAlert = true;
      this.errorAlert = 'You have exceeded the number of patients to be assigned';
    }
  }
  public trackByFn(index: any, item: any) {
    return index;
  }

  public handleDuplicates(assignedCase, element, user_id, user_name) {
    const position = this.caseForManager.findIndex(v => v.user_id === user_id);
    if (position !== -1) {
      this.showErrorAlert = false;
      this.caseForManager.splice(position, 1);
      this.caseForManager.push({ count: assignedCase, user_uuid: element.trim(), user_id: user_id, user_name: user_name });
      this.caseAssignment = this.getSum();
    } else {
      this.caseForManager.push({ count: assignedCase, user_uuid: element.trim(), user_id: user_id, user_name: user_name });
      this.caseAssignment = this.getSum();
    }
  }
  public getSum() {
    return this.caseForManager.map(m => m.count).reduce((a, b) => a + b, 0);
  }
  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/general/general/landing-page']);
  }
  public exportPatientListToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }
  public getPatientList(params) {
   const finalParams = {caseManagerUserId: `${params}`, locationUuid: this.getLocationParams().locationUuid};
   this.updatePatientList.emit(finalParams);
   this.dismissDialog();
  }
}
