import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  SimpleChanges
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'oncology-summary-indicators-table',
  templateUrl: 'oncology-summary-indicators-table.component.html',
  styleUrls: ['./oncology-summary-indicators-table.component.css']
})
export class OncologySummaryIndicatorsTableComponent
  implements OnInit, OnChanges {
  public startDate: any;
  public endDate: any;
  public locationUuids: any;
  public gridOptions: any = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    onGridSizeChanged: () => {},
    onGridReady: () => {},
    autoGroupColumnDef: {
      headerName: 'Location',
      pinned: true
    }
  };
  @Input() public monthlySummary: Array<any> = [];
  @Input() public params: any;
  @Input() public indicator = '';

  public columns: any = [];
  public data: any = [];
  public mockResults: any = [];
  public oncologySummaryColdef: any = [];
  public pinnedBottomRowData: any = [];

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.monthlySummary) {
      this.processSummaryData(this.monthlySummary);
    }
  }

  public onCellClicked(event) {
    if (event.value === 0 || _.isNull(event.value)) {
      return;
    }
    this.goToPatientList(event);
  }

  public processSummaryData(results) {
    this.data = results;
    const firstRow = results[0];
    this.generateColumns(firstRow);
    this.setRowData(results);
  }

  public generateColumns(firstRow) {
    const cols: any = [
      {
        headerName: 'location_uuid',
        field: 'location_uuid',
        hide: true
      },
      {
        headerName: 'Period',
        field: 'encounter_datetime',
        pinned: true,
        width: 100
      },
      {
        headerName: 'Location',
        field: 'location_name',
        width: 250,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'Gender',
        field: 'gender',
        hide: true
      },
      {
        headerName: 'Hiv Status',
        field: 'hiv_status',
        hide: true
      }
    ];

    _.each(firstRow, (data, index) => {
      if (
        index === 'encounter_datetime' ||
        index === 'location_uuid' ||
        index === 'location_name' ||
        index === 'location_id' ||
        index === 'gender' ||
        index === 'hiv_status'
      ) {
        return '';
      } else {
        cols.push({
          headerName: this.translateIndicator(index),
          field: index,
          cellRenderer: (column) => {
            if (typeof column.value === 'undefined') {
              return '';
            } else {
              let value;
              if (Number.isNaN(column.value)) {
                value = 0;
              }
              if (column.value === null) {
                value = 0;
              } else {
                value = column.value;
              }
              return (
                '<a href="javascript:void(0);" title="providercount">' +
                value +
                '</a>'
              );
            }
          }
        });
      }
    });
    this.gridOptions.groupDefaultExpanded = -1;
    this.oncologySummaryColdef = cols;
  }

  public translateIndicator(indicator: string) {
    return indicator
      .toLowerCase()
      .split('_')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  public setRowData(allRowsData) {
    const finalRows = [];
    _.each(allRowsData, (rowData) => {
      const rowObj = {};
      _.each(rowData, (data, index) => {
        rowObj[index] = data;
      });
      finalRows.push(rowObj);
    });
    this.data = finalRows;
    this.setTotalsRow(finalRows);
  }

  public setTotalsRow(rowData) {
    const totalObj = {
      location_name: ''
    };
    const totalRow = [];
    _.each(rowData, (row) => {
      Object.keys(row).map((key, index) => {
        if (Number.isInteger(row[key]) === true) {
          if (totalObj[key]) {
            totalObj[key] = row[key] + totalObj[key];
          } else {
            totalObj[key] = row[key];
          }
        } else {
          if (Number.isNaN(totalObj[key])) {
            totalObj[key] = 0;
          }
          if (totalObj[key] === null) {
            totalObj[key] = 0;
          }
          totalObj[key] = 0 + totalObj[key];
        }
      });
    });

    if (totalObj['normal_findings']) {
      const averageNormalBreastCallRate =
        (totalObj['normal_findings'] / totalObj['total_breast_screened']) * 100;
      const averageAbnormalBreastCallRate =
        (totalObj['abnormal_findings'] / totalObj['total_breast_screened']) *
        100;

      totalObj['normal_breast_call_rate%'] =
        averageNormalBreastCallRate.toFixed(2) + ' % ';
      totalObj['abnormal_breast_call_rate%'] =
        averageAbnormalBreastCallRate.toFixed(2) + ' % ';
    }

    if (totalObj['abnormal_findings']) {
      const averageCervicalNormalCallRate =
        (totalObj['normal_findings'] / totalObj['total_cervical_screened']) *
        100;
      const averageCervicalAbnormalCallRate =
        (totalObj['abnormal_findings'] / totalObj['total_cervical_screened']) *
        100;

      totalObj['normal_cervical_call_rate%'] =
        averageCervicalNormalCallRate.toFixed(2) + ' % ';
      totalObj['abnormal_cervical_call_rate%'] =
        averageCervicalAbnormalCallRate.toFixed(2) + ' % ';
    }
    totalObj.location_name = 'Totals';
    totalObj['encounter_datetime'] = 'Totals';
    totalRow.push(totalObj);
    this.pinnedBottomRowData = totalRow;
    this.setPinnedRow();
  }

  public goToPatientList(data) {
    switch (data.colDef.field) {
      case 'abnormal_breast_call_rate%':
        break;
      case 'normal_breast_call_rate%':
        break;
      case 'abnormal_cervical_call_rate%':
        break;
      case 'normal_cervical_call_rate%':
        break;
      case 'total_screens':
        break;
      default:
        let startDate;
        let endDate;
        let location;
        const period = this.params.period;

        if (data.data.location_name === 'Totals') {
          startDate = this.params.startDate;
          endDate = this.params.endDate;
          location = this.params.locationUuids;
        } else {
          if (period === 'daily') {
            startDate = moment(
              data.data.encounter_datetime,
              'DD-MM-YYYY'
            ).format('YYYY-MM-DD');
            endDate = moment(data.data.encounter_datetime, 'DD-MM-YYYY').format(
              'YYYY-MM-DD'
            );
          } else if (period === 'monthly') {
            startDate = moment(data.data.encounter_datetime, 'MM-YYYY')
              .startOf('month')
              .format('YYYY-MM-DD');
            endDate = moment(data.data.encounter_datetime, 'MM-YYYY')
              .endOf('month')
              .format('YYYY-MM-DD');
          }
          location = data.data.location_uuid;
        }

        const params: any = {
          startAge: this.params.startAge,
          endAge: this.params.endAge,
          gender: this.params.gender,
          locationUuids: location,
          locationName: data.data.location_name,
          type: this.params.type,
          startIndex: 0,
          limit: 1000,
          indicators: data.colDef.field,
          startDate: startDate,
          endDate: endDate,
          period: period
        };

        this.router.navigate(['patient-list'], {
          relativeTo: this.route,
          queryParams: params
        });
    }
  }

  public exportCountsListToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }

  public setPinnedRow() {
    if (this.gridOptions.api) {
      this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    }
    return true;
  }
}
