import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid';
import { RetentionReportResourceService } from '../../etl-api/retention-report-resource.service';
import * as _ from 'lodash';

@Component({
  selector: 'retention-report-patient-list',
  templateUrl: './retention-report-patient-list.component.html',
  styleUrls: ['./retention-report-patient-list.component.css']
})
export class RetentionReportPatientListComponent implements OnInit {
  public title = '';
  public patients: any = [];
  public rowData: any = [];
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
  public retentionSummaryColdef: any = [
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
      headerName: 'Identifiers',
      field: 'identifiers',
      width: 400,
      pinned: 'left'
    },
    {
      headerName: 'Name',
      field: 'person_name',
      width: 200,
      pinned: 'left'
    },
    {
      headerName: 'Gender',
      field: 'gender',
      width: 70
    },
    {
      headerName: 'Age',
      field: 'age',
      width: 50
    },
    {
      headerName: 'Phone No',
      field: 'phone_number',
      width: 100
    },
    {
      headerName: 'Alternate phone number',
      field: 'alternate_phone_number',
      width: 170
    },
    {
      headerName: 'Program',
      field: 'program',
      width: 250
    },
    {
      headerName: 'Visit Type',
      field: 'visit_type',
      width: 200
    },
    {
      headerName: 'Patient Category',
      width: 150,
      field: 'patient_category'
    },
    {
      headerName: 'Latest RTC date',
      field: 'latest_rtc_date',
      width: 150
    },
    {
      headerName: 'Latest VL',
      field: 'current_vl',
      width: 100
    },
    {
      headerName: 'Latest VL Date',
      field: 'current_vl_date',
      width: 150
    },
    {
      headerName: 'Previous VL',
      field: 'previous_vl',
      width: 100
    },
    {
      headerName: 'Previous VL Date',
      field: 'previous_vl_date',
      width: 150
    },
    {
      headerName: 'Current Regimen',
      field: 'cur_arv_meds',
      width: 200
    },
    {
      headerName: 'Latest appointment',
      field: 'last_appointment',
      width: 200
    },
    {
      headerName: 'Estate/Nearest Center',
      field: 'estate',
      width: 200
    },
    {
      headerName: 'Patient Uuid',
      field: 'patient_uuid',
      width: 300,
      hide: true
    }
  ];

  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public errorObj = {
    isError: false,
    message: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private retentionReportService: RetentionReportResourceService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.getPatientList(params);
          this.title = this.translateIndicator(params.indicators);
          this.params = params;
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  public getPatientList(params) {
    this.loading();
    this.busy = this.retentionReportService
      .getRetentionReportPatientList(params)
      .subscribe(
        (result: any) => {
          if (result) {
            const patients = result.result;
            this.createPatientRowData(patients);
            this.endLoading();
          }
        },
        (error) => {
          this.endLoading();
          this.errorObj = {
            isError: true,
            message:
              'An error occurred while trying to load the patient list.Please reload page'
          };
          console.error('ERROR', error);
        }
      );
  }

  public translateIndicator(indicator: string) {
    const indicatorArray = indicator.toLowerCase().split('_');
    return indicatorArray
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  public createPatientRowData(patients) {
    this.rowData = patients;
  }
  public navigateBack() {
    this.location.back();
  }
  public onCellClicked($event: any) {
    const patientUuid = $event.data.patient_uuid;
    this.redirectTopatientInfo(patientUuid);
  }
  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/landing-page'
    ]);
  }
  public loading() {
    this.busyIndicator = {
      busy: true,
      message: 'Fetching patient list...please wait'
    };
  }

  public endLoading() {
    this.busyIndicator = {
      busy: false,
      message: ''
    };
  }

  public resetErrorMsg() {
    this.errorObj = {
      isError: false,
      message: ''
    };
  }

  public exportPatientListToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }
}
