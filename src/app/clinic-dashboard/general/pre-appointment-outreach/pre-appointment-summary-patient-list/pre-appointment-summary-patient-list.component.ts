import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { PreAppointmentOutreachResourceService } from 'src/app/etl-api/pre-appointment-outreach-resource.service';

@Component({
  selector: 'app-pre-appointment-summary-patient-list',
  templateUrl: './pre-appointment-summary-patient-list.component.html',
  styleUrls: ['./pre-appointment-summary-patient-list.component.css']
})
export class PreAppointmentSummaryPatientListComponent implements OnInit {
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private preAppointmentResourceService: PreAppointmentOutreachResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        console.log('params-p[ist: ', params);
        if (params && params.month) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.selectedIndicatorGender = params.indicatorGender;
          this.getPatientList(params, params.indicators);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
    this.addExtraColumns();
  }

  private getPatientList(params: any, indicator: string) {
    this.preAppointmentResourceService
      .getMlSummaryPatientList(params, indicator)
      .subscribe((data) => {
        this.isLoading = false;
        this.patientData = data.results.results;
        this.hasLoadedAll = true;
      });
  }

  public addExtraColumns() {
    const extraColumns = {
      phone_number_one: 'Phone',
      cur_arv_meds: 'Current Regimen',
      nearest_center: 'Nearest Center'
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
