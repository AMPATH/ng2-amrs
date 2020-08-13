import {
    Component, OnInit, OnChanges, Input, ViewChild,
    SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'retention-report-tabular',
    templateUrl: 'retention-report-tabular.component.html',
    styleUrls: ['./retention-report-tabular.component.css']
})

export class RetentionReportTabularComponent implements OnInit, OnChanges {
    public startDate: any;
    public endDate: any;
    public locationUuids: any;
    public gridOptions: any = {
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        groupDefaultExpanded: -1,
        showToolPanel: false,
        onGridSizeChanged : () => {
        },
        onGridReady: () => {
        }
    };
    @Input() public retentionSummary: Array<any> = [];
    @Input() public sectionDefs: Array<any> = [];
    @Input() public params: any;
    @Input() public indicator = '';

    public columns: any[] = [];
    public data: any[] = [];
    public mockResults: any[] = [];
    public retentionSummaryColdef: any[] = [];
    public pinnedBottomRowData: any[] = [];
    public reportRows: any = {};
    public urlParams: any;
    public rowDefs: any;

    @ViewChild('agGrid')
    public agGrid: AgGridNg2;
    constructor(
        private router: Router,
        private route: ActivatedRoute) { }

    public ngOnInit() {
        this.route
        .queryParams
        .subscribe((params) => {
          if (params) {
               this.urlParams = params;
             }
         }, (error) => {
            console.error('Error', error);
         });

    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.retentionSummary) {
            this.generateColumns(this.retentionSummary);
        }
        if (changes.sectionDefs) {
            this.generateRows(this.sectionDefs);
            this.setRowData(this.retentionSummary);
        }
    }
    public generateRows(sectionDefs) {
        const row = [];
        _.each(sectionDefs, (sectionDef: any) => {
             const sectionTitle = sectionDef.sectionTitle;
             const sectionIndicators = sectionDef.indicators;
             _.each(sectionIndicators, (sectionIndicator: any) => {
                  row[sectionIndicator.indicator] = {
                      'indicator' : sectionIndicator.indicator,
                      'section': sectionTitle,
                      'data' : [],
                      'location_uuid': ''
                  };
             });
        });
        this.rowDefs = row;
    }

    public setRowData(results: any) {
        const finalRows = [];
        if (results && results.length > 0) {
                _.each(results, (result: any) => {
                    const report_date = result.report_date;
                    const location_uuid = result.location_uuid;
                    Object.keys(result).forEach((key, index) => {
                        if (key !== 'report_date' && key !== 'location_id'
                        && key !== 'location_name' && key !== 'location_uuid') {
                            const obj = { };
                            obj[report_date] = result[key];
                            // dynamically add the object
                            this.rowDefs[key].data.push(obj);
                            this.rowDefs[key]['location_uuid'] = location_uuid;
                        }
                    });
                });
        }
        this.generateGridRows(this.rowDefs);
    }
    public generateGridRows(rowDefs) {
       const finalRows = [];
        Object.keys(rowDefs).forEach((key, index) => {
            const finalObj = {
                'indicator': rowDefs[key].indicator,
                'section': rowDefs[key].section,
                'location_uuid': rowDefs[key]['location_uuid']
            };
            const data = rowDefs[key].data;
             _.each(data, (d) => {
                  Object.keys(d).forEach((key2, index2) => {
                       finalObj[key2] = d[key2];
                  });
             });

            finalRows.push(finalObj);
        });

     this.data = finalRows;
    }
    public onCellClicked(event) {
        // console.log('cellClicked', event);
        this.goToPatientList(event);
    }

    public resetData() {
        this.retentionSummaryColdef = [];
        this.data =  [];
    }
    public generateColumns(retentionSummary: any) {
        const defs = [];
            defs.push(
            {
                headerName: 'Report',
                field: 'section',
                pinned: 'left',
                rowGroup: true,
                hide: true
            },
            {
                headerName: 'Indicator',
                field: 'indicator',
                width: 400,
                cellRenderer: (column: any) => {
                        // console.log('column', column);
                        if (typeof column.value !== 'undefined') {
                             return this.translateIndicator(column.value);
                        }
                }
            });
            const reportDates = [];
            _.each(retentionSummary, (summary: any) => {
               reportDates.push(moment(summary.report_date).format('YYYY-MM-DD'));
            });

            const sortedDates = this.sortDateCols(reportDates);
            _.each(sortedDates, (reportDate: any) => {

                defs.push({
                    headerName: moment(reportDate).format('DD-MM-YYYY'),
                    field: reportDate,
                });

            });

            this.retentionSummaryColdef = defs;
  }

  public sortDateCols(datesArray) {

    const sortedDates = datesArray.sort((a, b) => {
        const c = new Date(a);
        const d = new Date(b);
        return c.getTime() - d.getTime();
    });

    return sortedDates;

  }



    public goToPatientList(data: any) {
        const startDate = data.colDef.field;
        const endDate = data.colDef.field;
        const indicator = data.data.indicator;
        const locationUuid = data.data.location_uuid;

        const params = {
              startDate: startDate,
              endDate: endDate,
              locationUuids: locationUuid,
              indicators: indicator,
              gender: this.urlParams.gender,
              startAge: this.urlParams.startAge,
              endAge: this.urlParams.endAge,
        };

        this.router.navigate(['patient-list']
        , {
            relativeTo: this.route,
            queryParams: params
        });

    }
    public translateIndicator(indicator: string) {
        const indicatorArray = indicator.toLowerCase().split('_');
          return indicatorArray.map((word) => {
                return ((word.charAt(0).toUpperCase()) + word.slice(1));
          }).join(' ');
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
