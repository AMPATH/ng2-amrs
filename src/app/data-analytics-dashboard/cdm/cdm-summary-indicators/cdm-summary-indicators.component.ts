
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CdmSummaryIndicatorsResourceService } from
'./../../../etl-api/cdm-summary-indicators-resource.service';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import * as Moment from 'moment';

@Component({
  selector: 'cdm-summary-indicators',
  styleUrls: ['cdm-summary-indicators.component.css'],
  templateUrl: 'cdm-summary-indicators.component.html'
})

export class CdmSummaryIndicatorsComponent implements OnInit {
  public data = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public startAge: number;
  public endAge: number;
  public indicators: string ;
  public selectedIndicators  = [];
  public selectedGender = [];
  public enabledControls = 'indicatorsControl,datesControl,' +
    'ageControl,genderControl,locationControl';
  public isLoadingReport: boolean = false;
  public encounteredError: boolean = false;
  public errorMessage: string = '';
  public currentView: string = 'tabular'; // can be pdf or tabular or patientList
  public reportName: string = 'cdm-summary-report';
  public dates: any;
  public age: any;
  public title: string =  'CDM Summary Indicators';

  constructor() {
  }

  public ngOnInit() {
    console.log(' CdmSummaryIndicatorsComponent ...');
  }

  public generateReport() {
  }
}
