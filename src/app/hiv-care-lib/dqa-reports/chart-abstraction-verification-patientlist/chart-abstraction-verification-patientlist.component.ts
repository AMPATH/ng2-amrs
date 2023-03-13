import { Component, OnInit } from '@angular/core';
import { DqaChartAbstractionService } from 'src/app/etl-api/dqa-chart-abstraction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-chart-abstraction-verification-patientlist',
  templateUrl: './chart-abstraction-verification-patientlist.component.html',
  styleUrls: ['./chart-abstraction-verification-patientlist.component.css']
})
export class VerificationChartAbstractionPatientlistComponent
  implements OnInit {
  public extraColumns: Array<any> = [];
  public params: any;
  public patientData: Array<any> = [];
  public nextStartIndex = 0;
  public overrideColumns: Array<any> = [];
  public hasLoadedAll = false;
  public allDataLoaded = false;
  public previousButton = false;
  public hasError = false;
  public isLoading = true;

  constructor(
    public dqaResource: DqaChartAbstractionService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    let requestParams: any;
    this.addExtraColumns();
    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.params = params;
          requestParams = {
            locations: this.params.locationUuids,
            limit: 300,
            offset: 0
          };

          this.getPatientList(requestParams);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }
  private getPatientList(params: any) {
    this.dqaResource
      .getDqaVerificationChartAbstractionReport(params)
      .subscribe((data) => {
        this.patientData = this.patientData.concat(data);
        this.isLoading = false;
        console.log(this.allDataLoaded);
        if (this.allDataLoaded) {
          this.hasLoadedAll = false;
        } else {
          this.hasLoadedAll = true;
        }
      });
  }
  public addExtraColumns() {
    const extraColumns = {
      error_description: 'Error Description'
    };
    for (const indicator in extraColumns) {
      if (indicator) {
        this.extraColumns.push({
          headerName: extraColumns[indicator],
          field: indicator
        });
      }
    }
    this.extraColumns.push({
      headerName: 'Re-Verify',
      field: 'action2',
      onCellClicked: (column: any) => {
        const data = column.data.patient_uuid;
        const upi = column.data.identifiers.split(',')[0];
        if (upi && column.data.status === 'false') {
          this.navigateToPatientInfo(data, upi);
        }
      },
      cellRenderer: (column) => {
        console.log('ireye', column);
        let assignBtn = '';
        if (column.data.identifiers && column.data.status === 'false') {
          assignBtn =
            '<a> <i class="fa fa-pencil" aria-hidden="true"> </i> Re-Verify Client</a>';
        } else {
          assignBtn =
            '<i class="fa fa-check" aria-hidden="true"></i>Re-Verified';
        }
        return assignBtn;
      },
      width: 150
    });
    this.overrideColumns.push({});
  }
  public loadMoreDQAList(option) {
    this.isLoading = true;
    let loadMoreParams: any;
    loadMoreParams = {
      locations: this.params.locationUuids,
      limit: 300,
      offset: 0
    };
    if (option === 'next') {
      this.nextStartIndex += this.patientData.length;
      loadMoreParams.offset = this.nextStartIndex;
      this.getPatientList(loadMoreParams);
    }
    if (option === 'all') {
      loadMoreParams.limit = 2000000000;
      this.nextStartIndex = 0;
      loadMoreParams.offset = this.nextStartIndex;
      this.patientData = [];
      this.getPatientList(loadMoreParams);
      this.allDataLoaded = true;
    }
  }
  public goBack() {
    this._location.back();
  }

  public navigateToPatientInfo(patientUuid, upi) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient-search/patient-registration',
      {
        editMode: 3,
        patientUuid: patientUuid,
        identifierType: `cba702b9-4664-4b43-83f1-9ab473cbd64d`,
        identifier: upi,
        label: 'UPI Number'
      }
    ]);
  }
}
