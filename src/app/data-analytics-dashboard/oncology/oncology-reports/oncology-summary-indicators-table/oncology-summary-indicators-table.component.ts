import {
    Component, OnInit, OnChanges, Input, ViewChild,
    SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
@Component({
    selector: 'oncology-summary-indicators-table',
    templateUrl: 'oncology-summary-indicators-table.component.html',
    styleUrls: ['./oncology-summary-indicators-table.component.css']
})

export class OncologySummaryIndicatorsTableComponent implements OnInit, OnChanges {
    public startDate: any;
    public endDate: any;
    public locationUuids: any;
    public gridOptions: any = {
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        showToolPanel: false,
        onGridSizeChanged : () => {
        },
        onGridReady: () => {
        }
    };
    @Input() public monthlySummary: Array<any> = [];
    @Input() public params: any;
    @Input() public indicator: string = '';

    public columns: any = [];
    public data: any = [];
    public mockResults: any = [];
    public oncologySummaryColdef: any = [
    ];
    public pinnedBottomRowData: any = [];

    @ViewChild('agGrid')
    public agGrid: AgGridNg2;
    constructor(
        private router: Router,
        private route: ActivatedRoute) { }

    public ngOnInit() {

    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.monthlySummary) {
            this.processSummaryData(this.monthlySummary);
        }
    }
    public onCellClicked(event) {
        this.goToPatientList(event);
    }
    public processSummaryData(results) {
      this.data = results;
      let firstRow = results[0];
      this.generateColumns(firstRow);
      this.setRowData(results);

    }
    public generateColumns(firstRow) {
        let cols: any = [
            {
                headerName: 'location_uuid',
                field : 'location_uuid',
                hide: true
            },
           {
            headerName: 'Month',
            field : 'encounter_datetime'
           },
           {
            headerName: 'Location',
            field : 'location_name',
            width: 250,
            rowGroup: true,
            hide: true
           }
      ];
        _.each(firstRow, (data, index) => {
            // console.log('Index', index);

            if ( index === 'encounter_datetime' || index === 'location_uuid' ||
            index === 'location_name' || index === 'location_id') {

            }else {

                cols.push(
                    {
                        'headerName': this.translateIndicator(index),
                        'field': index,
                         cellRenderer: (column) => {
                            if (typeof column.value === 'undefined') {
                               return '';
                             }else {
                                 let value;
                                 if (column.value === null) {
                                        value = 0;
                                 }else {
                                       value = column.value;
                                 }
                                 return '<a href="javascript:void(0);" title="providercount">'
                                + value + '</a>';
                             }
                          }
                    }
            );

            }
        });

        this.gridOptions.groupDefaultExpanded = -1;

        this.oncologySummaryColdef = cols;

    }

    public translateIndicator(indicator: string) {
        return indicator.toLowerCase().split('_').map((word) => {
            return (word.charAt(0) + word.slice(1));
        }).join(' ');
    }

    public setRowData(allRowsData) {
        let finalRows = [];
        _.each(allRowsData, (rowData) => {
            let rowObj = {
            };
            _.each(rowData, (data, index) => {
                rowObj[index] = data;

            });
            finalRows.push(rowObj);

        });

        this.data = finalRows;
        let rowData = finalRows;
        this.setTotalsRow(rowData);

    }

    public setTotalsRow(rowData) {
        let totalObj = {
            'location_name': ''
        };
        let totalRow = [];
        _.each(rowData, (row) => {
            Object.keys(row).map((key, index) => {
                if (Number.isInteger(row[key]) === true) {

                    if (totalObj[key]) {
                        totalObj[key] = row[key] + totalObj[key];
                    }else {
                        totalObj[key] = row[key];
                    }
                } else {
                    totalObj[key] = row[key];
                }
             });
        });

        if (totalObj['normal_breast_screening_findings']) {
             let averageNormalRate = (totalObj['normal_breast_screening_findings'] /
             totalObj['total_breast_screened']) * 100;

             let averageAbNormalRate = (totalObj['abnormal_breast_screening_findings'] /
             totalObj['total_breast_screened']) * 100;

             totalObj['normal_breast_call_rate%'] = averageNormalRate.toFixed(2) + ' % ';
             totalObj['abnormal_breast_call_rate%'] = averageAbNormalRate.toFixed(2) + ' % ';
        }

        if (totalObj['abnormal_cervical_screening']) {
            let averageCervicalNormalRate = (totalObj['normal_cervical_screening'] /
            totalObj['total_cervical_screened']) * 100;

            let averageCervicalAbNormalRate = (totalObj['abnormal_cervical_screening'] /
            totalObj['total_cervical_screened']) * 100;

            totalObj['normal_cervical_call_rate%'] = averageCervicalNormalRate.toFixed(2) + ' % ';
            totalObj['abnormal_cervical_call_rate%'] =
            averageCervicalAbNormalRate.toFixed(2) + ' % ';
       }

        totalObj.location_name = 'Totals';
        totalObj['encounter_datetime'] = 'Totals';
        totalRow.push(totalObj);
        this.pinnedBottomRowData = totalRow;

        this.setPinnedRow();
    }

    public goToPatientList(data) {
        console.log('Patient List Data', data);

        switch (data.colDef.field) {

            case 'abnormal_breast_call_rate%':
              break;
            case 'normal_breast_call_rate%':
              break;
            case 'abnormal_cervical_call_rate%':
              break;
            case 'normal_cervical_call_rate%':
              break;
            default:

            let startDate;
            let endDate;
            let location;

            if (data.data.location_name === 'Totals') {
                startDate = this.params.startDate;
                endDate  = this.params.endDate;
                location = this.params.locationUuids;
            }else {
                startDate =
                moment(data.data.encounter_datetime, 'MM-YYYY').startOf('month')
                .format('YYYY-MM-DD');
                endDate =
                moment(data.data.encounter_datetime, 'MM-YYYY').endOf('month').format('YYYY-MM-DD');
                location = data.data.location_uuid;
            }

            // let queryParams = this.route.snapshot.params;
            let params: any = {
                startAge: this.params.startAge,
                endAge: this.params.endAge,
                gender: this.params.gender,
                locationUuids: location,
                locationName: data.data.location_name,
                type: this.params.type,
                startIndex : 0,
                limit : 1000,
                indicators: data.colDef.field,
                startDate: startDate,
                endDate: endDate
            };
            this.router.navigate(['patient-list']
                , {
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
