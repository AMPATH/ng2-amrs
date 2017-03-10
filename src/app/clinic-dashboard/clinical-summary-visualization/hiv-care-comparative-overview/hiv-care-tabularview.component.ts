import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ClinicalSummaryVisualizationService
} from '../../services/clinical-summary-visualization.service';

@Component({
  selector: 'hiv-care-tabularview',
  templateUrl: './hiv-care-tabularview.component.html'
})
export class HivCareTabularViewComponent implements OnInit, OnDestroy {
  private _data = new BehaviorSubject<Array<any>>([]);
  private columns = [];

  constructor(private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService,
              private route: ActivatedRoute,
              private router: Router) {
    this.columns = [];
  }

  ngOnInit() {
    if (this.clinicalSummaryVisualizationService.colCallback) {
      this.clinicalSummaryVisualizationService.colCallback.subscribe((col) => {
        if (col) {
          this.goToPatientList(col.column.colId, col.data);
        }
      });
    }
  }

  ngOnDestroy() {
    this._data.complete();
  }

  @Input()
  set data(value) {
    this._data.next([]);
    this.columns = [];
    this._data.next(this.clinicalSummaryVisualizationService.generateTableData(value));
    this.columns = this.clinicalSummaryVisualizationService.generateTabularViewColumns;
  }

  get data() {
    return this._data.getValue();
  }

  goToPatientList(indicator, col) {
    let dateRange = this.clinicalSummaryVisualizationService.getMonthDateRange(
      col.reporting_month.split('/')[1],
      col.reporting_month.split('/')[0] - 1
    );
    this.router.navigate(['./patient-list', 'clinical-hiv-comparative-overview', indicator,
        dateRange.startDate.format('DD/MM/YYYY') + '|' + dateRange.endDate.format('DD/MM/YYYY')]
      , {relativeTo: this.route});
  }
}
