import { Component, OnInit } from '@angular/core';
import { OncologyReportService } from '../../../../etl-api/oncology-reports.service';

@Component({
  selector: 'oncology-monthly-indicators-summary',
  templateUrl: './oncology-monthly-indicators-summary.component.html',
  styleUrls: ['./oncology-monthly-indicators-summary.component.css']
})
export class OncologyMonthlyIndicatorSummaryComponent implements OnInit {

  public tittle: string  = '';
  public monthlySummary: any = [];
  public params: any;

  constructor() {
  }

  public ngOnInit() {
     console.log('Loaded Oncology indicator ...');
  }
}
