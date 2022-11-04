import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ClinicalSummaryVisualizationService } from '../services/clinical-summary-visualization.service';
@Component({
  selector: 'hiv-care-tabularview',
  templateUrl: 'hiv-care-tabularView.component.html'
})
export class HivCareTabularViewComponent implements OnInit, OnDestroy {
  public _data = new BehaviorSubject<Array<any>>([]);
  public columns = [];

  constructor(
    private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.columns = [];
  }

  public ngOnInit() {
    if (this.clinicalSummaryVisualizationService.colCallback) {
      this.clinicalSummaryVisualizationService.colCallback.subscribe((col) => {
        if (col) {
          this.goToPatientList(col.column.colId, col.data);
        }
      });
    }
  }

  public ngOnDestroy() {
    this._data.complete();
  }

  @Input()
  set data(value) {
    this._data.next([]);
    this.columns = [];
    this._data.next(
      this.clinicalSummaryVisualizationService.generateTableData(value)
    );
    this.columns =
      this.clinicalSummaryVisualizationService.generateTabularViewColumns;
  }

  get data() {
    return this._data.getValue();
  }

  public goToPatientList(indicator, col) {
    const dateRange =
      this.clinicalSummaryVisualizationService.getMonthDateRange(
        col.reporting_month.split('/')[0],
        col.reporting_month.split('/')[1] - 1
      );

    this.router.navigate(
      [
        './patient-list',
        'clinical-hiv-comparative-overview',
        indicator,
        dateRange.startDate.format('DD/MM/YYYY') +
          '|' +
          dateRange.endDate.format('DD/MM/YYYY')
      ],
      { relativeTo: this.route }
    );
  }
}
