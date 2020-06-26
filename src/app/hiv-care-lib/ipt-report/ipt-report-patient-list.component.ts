import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { IptReportService } from 'src/app/etl-api/ipt-report.service';

@Component({
  selector: 'ipt-patient-list',
  templateUrl: './ipt-report-patient-list.component.html',
  styleUrls: ['./ipt-report-patient-list.component.css'],
})
export class IptReportPatientListComponent implements OnInit {
  public params: IptReportParams;
  public isLoading = false;
  public selectedIndicator: string;
  public patientData: Array<any> = [];
  public overrideColumns: Array<any> = [];
  public extraColumns: Array<any> = [];
  public hasLoadedAll = false;
  public hasError = false;

  constructor(
    private route: ActivatedRoute,
    private _location: Location,
    public iptReportService: IptReportService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe((params: IptReportParams) => {
      if (params) {
        this.params = params;
        this.selectedIndicator = params.indicatorHeader;
        this.getPatientList(params);
      }
    });
  }

  public getPatientList(params: any) {
    this.isLoading = true;
    this.iptReportService.getIptReportPatientList(params).subscribe((data) => {
      if (data.error) {
        this.hasError = true;
        this.isLoading = false;
      } else {
        this.patientData = data.result;
        this.isLoading = false;
      }
    });
  }

  public goBack() {
    this._location.back();
  }
}

interface IptReportParams {
  locationUuids: string;
  endDate: Date;
  indicators: string;
  indicatorHeader: string;
}
