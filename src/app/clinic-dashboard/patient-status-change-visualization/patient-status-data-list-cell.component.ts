import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
@Component({
  selector: 'patient-status-data-list-cell',
  templateUrl: 'patient-status-data-list-cell.component.html'
})

export class PatientStatusDatalistCellComponent {
  public indicatorDefiniton: any = {};
  private params: any;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  agInit(params: any): void {
    this.params = params;
  }

  clicked() {
    // console.log('Clicked', this.params);
    if (this.params.column.colId === 'patients_gained' ||
      this.params.column.colId === 'patients_lost'
      || this.params.column.colId === 'state_change'
      || this.params.column.colId === 'patient_change_from_past_month') return true;

    let analysisType = this.params.colDef.analysisType;
    let dateMoment = Moment(this.params.data.reporting_date);
    let startOfMonth = dateMoment.startOf('month').format('YYYY-MM-DD');
    let endOfMonth = dateMoment.endOf('month').format('YYYY-MM-DD');
    let indicator = this.params.column.colId;
    switch (analysisType) {
      case 'cohortAnalysis':
        this.router.navigate(['./patient-list'], {
            relativeTo: this.route, queryParams: {
              startDate: this.params.data.from_month,
              endDate: this.params.data.to_month,
              indicator: this.params.data.indicator,
              analysis: analysisType
            }
          });
        break;
      default:
        this.router.navigate(['./patient-list']
          , {
            relativeTo: this.route, queryParams: {
              startDate: startOfMonth,
              endDate: endOfMonth,
              indicator: indicator,
              analysis: analysisType
            }
          });

    }

  }
}
