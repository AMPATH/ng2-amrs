import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import {
  ClinicalSummaryVisualizationService
} from '../../services/clinical-summary-visualization.service';
import { GridOptions } from 'ag-grid';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'hiv-care-tabularview',
  templateUrl: './hiv-care-tabularview.component.html'
})
export class HivCareTabularViewComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
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

    // add dynamic column
    if (value) {
      let cols: Array<any> = _.pull(_.keys(value[0]),
        'location_uuid',
        'location_id',
        'reporting_date');
      _.each(cols, (col, index) => {
        if (_.filter(this.columns, {field: col}).length === 0) {
          this.columns.push({
            headerName: _.startCase(_.camelCase(col)),
            field: col,
            pinned: false,
            cellRenderer: (column) => {
              return column.value;
            },
            onCellClicked: (params) => {
            },
          });
        }
      });
    }

    // render data table
    this.renderDataTable(this.columns);

  }

  get data() {
    return this._data.getValue();
  }

  renderDataTable(columns) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = columns;

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(columns);
    }
    this.gridOptions.onGridReady = (event) => {
      this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.enableColResize = true;
      this.gridOptions.enableSorting = true;
      this.gridOptions.enableFilter = true;
      this.gridOptions.showToolPanel = false;
      this.gridOptions.getRowStyle = (params) => {
        return {'font-size': '14px', 'cursor': 'pointer'};
      };
    };
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
