
import { Component, OnInit, OnChanges , Input, ViewChild ,
   SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Rx';
@Component({
  selector: 'cdm-summary-monthly-indicator-table',
  templateUrl: 'cdm-summary-monthly-indicators-table.component.html',
  styleUrls: ['./cdm-summary-monthly-indicators-table.component.css']
})

export class CdmSummaryMonthlyTableComponent implements OnInit, OnChanges {
  public startDate: any;
  public endDate: any;
  public locationUuids: any;
  public gridOptions: any = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    onGridReady: () => {
    }
  };
  @Input() public monthlySummary: Array<any> = [];
  @Input() public params: any;

  public columns: any = [];
  public data: any = [];

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  constructor(private router: Router,
              private route: ActivatedRoute) { }

  public ngOnInit() {

  }

  public ngOnChanges(changes: SimpleChanges) {
    console.log('Changes', changes);
    if (changes.monthlySummary) {
         this.processSummaryData(this.monthlySummary);
    }
}
  public onCellClicked(event) {
    this.goToPatientList(event);
  }
  public processSummaryData(summaryData) {
    let firstRow = summaryData[0];
    console.log('Process Summary Data', summaryData);
    this.generateColumns(firstRow);
    this.setRowData(summaryData);

  }
  public generateColumns(firstRow) {
    console.log('generateColumn', firstRow);
    let cols = [];
    _.each(firstRow, (data, index ) => {
          console.log('Index', index);
          cols.push(
            {
              headerName: index,
              field: index
            }
         );
      });

    this.columns = cols;

  }

  public setRowData(allRowsData) {
    console.log('SetRowData', allRowsData);
    let finalRows = [];
    _.each(allRowsData, (rowData) => {
        let rowObj = {};
        _.each(rowData, (data, index) => {
          rowObj[index] = data;

        });
        finalRows.push(rowObj);

    });

    console.log('Final Row', finalRows);
    this.data = finalRows;

  }

  public goToPatientList(data) {
    console.log('Data', data);
    /*
    let endDate = moment(data.data.month).endOf('month').format('DD/MM/YYYY');
    let startDate = moment(data.data.month).startOf('month').format('DD/MM/YYYY');
    this.locationUuids = data.data.location_uuid;
    */
    let queryParams = this.route.snapshot.params;
    let params: any = {
      startAge : this.params.startAge,
      endAge: this.params.endAge,
      locationUuids: this.params.locationUuids,
      indicators : data.colDef.field,
      startDate: moment(data.data.reporting_month, 'DD/MM/YYYY').startOf('month').format(),
      endDate : moment(data.data.reporting_month , 'DD/MM/YYYY').endOf('month').format()
    };
    console.log('Query params', queryParams);
    console.log('Query-params', params);
    this.router.navigate(['patient-list']
      , {
           relativeTo: this.route,
           queryParams: params
        });
  }

}
