import { Component, OnInit } from '@angular/core';

import { AhdResourceService } from 'src/app/etl-api/ahd-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ahd-monthly-report-patientlist',
  templateUrl: './ahd-monthly-report-patientlist.component.html',
  styleUrls: ['./ahd-monthly-report-patientlist.component.css']
})
export class AhdMonthlyReportPatientlistComponent implements OnInit {
  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public selectedIndicatorGender: string;
  public hasLoadedAll = false;
  public hasError = false;
  public selectedMonth: String;
  locationUuid: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public ahdResourceService: AhdResourceService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.locationUuid = params['location_uuid'];
    });

    this.route.queryParams.subscribe(
      (params) => {
        // if (params && params.sDate) {
        if (params) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.selectedIndicatorGender = params.indicatorGender;
          this.getPatientList(params, this.locationUuid);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );

    this.addExtraColumns();
  }

  private getPatientList(params: any, location: string) {
    this.ahdResourceService
      .getAhdPatientList(params, location)
      .subscribe((data) => {
        this.isLoading = false;
        this.patientData = data.results.results;
        this.hasLoadedAll = true;
      });
  }

  public addExtraColumns() {
    const extraColumns = {
      phone_number: 'Phone',
      enrollment_date: 'Enrollment Date',

      who_stage: 'WHO stage',

      arv_first_regimen_start_date: 'First ARV start date',
      cur_meds: 'Current Regimen',
      cur_arv_line: 'Current ARV Line',
      cd4_date: 'CD4 Date',
      cd4_results: 'CD4 Results'
    };
    const status = this.selectedIndicatorGender.split(' - ')[0];
    if (status === 'Died') {
      Object.assign(extraColumns, {
        death_date: 'Death Date',
        cause_of_death: 'Cause of Death'
      });
    } else if (status === 'Transferred Out') {
      Object.assign(extraColumns, {
        transfer_out_date_v1: 'Transfer out date'
      });
    }
    for (const indicator in extraColumns) {
      if (indicator) {
        this.extraColumns.push({
          headerName: extraColumns[indicator],
          field: indicator
        });
      }
    }

    this.overrideColumns.push(
      {
        field: 'identifiers',
        cellRenderer: (column) => {
          return (
            '<a href="javascript:void(0);" title="Identifiers">' +
            column.value +
            '</a>'
          );
        }
      },
      {
        field: 'last_appointment',
        width: 200
      },
      {
        field: 'cur_prep_meds_names',
        width: 160
      }
    );
  }

  public goBack() {
    this._location.back();
  }
}
