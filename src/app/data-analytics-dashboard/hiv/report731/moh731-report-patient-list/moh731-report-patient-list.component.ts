import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { RegistersResourceService } from 'src/app/etl-api/registers-resource.service';

@Component({
  selector: 'app-moh731-report-patient-list',
  templateUrl: './moh731-report-patient-list.component.html',
  styleUrls: ['./moh731-report-patient-list.component.css']
})
export class Moh731ReportPatientListComponent implements OnInit {
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
  public busyIndicator: any = {
    busy: false,
    message: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public register: RegistersResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
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
    this.busyIndicator = {
      busy: true,
      message: 'Loading Patient List...please wait'
    };
    console.log('PARAMS: ' + JSON.stringify(params));
    this.register.getMoh731PatientList(params, indicator).subscribe((data) => {
      this.isLoading = false;
      this.patientData = data.results.results;
      if (data.results.results.length < 300) {
        this.hasLoadedAll = true;
      }
      this.busyIndicator = {
        busy: false,
        message: ''
      };
    });
  }

  public addExtraColumns() {
    const extraColumns = {
      weight: 'Weight',
      height: 'Height',
      stage: 'WHO Stage',
      location: 'Location',
      enrollment_date: 'Enrollment Date',
      arv_first_regimen_start_date: 'ARVs Initial Start Date',
      cur_regimen_arv_start_date: 'Current ARV Regimen Start Date (edited)',
      cur_arv_line: 'Current ARV Line (edited)',
      cur_arv_meds: 'Current ARV Regimen',
      has_pending_vl_test: 'Pending Viral Load Test',
      phone_number: 'Phone Number',
      last_appointment: 'Latest Appointment',
      patient_category: 'Patient Category',
      latest_rtc_date: 'Latest RTC Date',
      latest_vl: 'Latest VL',
      vl_category: 'VL Category',
      latest_vl_date: 'Latest VL Date',
      previous_vl: 'Previous VL',
      previous_vl_date: 'Previous VL Date',
      ipt_start_date: 'IPT Start Date',
      ipt_completion_date: 'IPT Completion Date',
      ipt_stop_date: 'IPT Stop Date',
      ovcid_id: 'OVCID',
      hiv_disclosure_status: 'Hiv Disclosure Status',
      discordant_status: 'Discordant Status',
      tb_screening_date: 'TB Screening Date',
      tb_screening_result: 'TB Screening Result',
      covid_19_vaccination_status: 'Covid-19 Assessment Status',
      cervical_screening_date: 'Cervical Screening Date',
      cervical_screening_method: 'Cervical Screening Method',
      cervical_screening_result: 'Cervical Screening Result',
      sms_consent_provided: 'SMS Consent Provided',
      sms_receive_time: 'SMS Time',
      nearest_center: 'Nearest Center',
      patient_categorization: 'DSD Model'
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

  public loadMorePatients() {
    this.isLoading = true;
    this.getPatientList(this.params, this.params.indicators);
  }

  public goBack() {
    this._location.back();
  }
}
