import { Component, OnInit } from '@angular/core';
import { PatientGainLoseResourceService } from 'src/app/etl-api/patient-gain-lose-resource.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-patient-gains-and-loses-patient-list',
  templateUrl: './patient-gains-and-loses-patient-list.component.html',
  styleUrls: ['./patient-gains-and-loses-patient-list.component.css']
})
export class PatientGainsAndLosesPatientListComponent implements OnInit {
  public params: any;
  public patientData: any;
  public isLoadingReport = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public hasLoadedAll = false;
  public hasError = false;
  public indicatorHeader: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public patientGainLose: PatientGainLoseResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.startingMonth) {
          this.params = params;
          this.selectedIndicator = params.indicator;
          this.indicatorHeader = params.indicatorHeader;
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }
  public extraColumns() {
    return [
      {
        headerName: 'Phone Number',
        width: 150,
        field: 'phone_number'
      },
      {
        headerName: 'Latest Appointment',
        width: 200,
        field: 'last_appointment'
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date'
      },
      {
        headerName: 'Current Regimen',
        width: 200,
        field: 'cur_meds'
      },
      {
        headerName: 'Latest VL',
        width: 75,
        field: 'latest_vl'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'latest_vl_date'
      },
      {
        headerName: 'Previous VL',
        width: 75,
        field: 'previous_vl'
      },
      {
        headerName: 'Previous VL Date',
        width: 150,
        field: 'previous_vl_date'
      },
      {
        headerName: 'Nearest Center',
        width: 150,
        field: 'nearest_center'
      }
    ];
  }
  private getPatientList(params: any) {
    this.patientGainLose
      .getPatientGainAndLosePatientList(params)
      .subscribe((data) => {
        this.isLoadingReport = false;
        this.patientData = data.results.results;
        this.hasLoadedAll = true;
      });
  }
  public goBack() {
    this._location.back();
  }
}
