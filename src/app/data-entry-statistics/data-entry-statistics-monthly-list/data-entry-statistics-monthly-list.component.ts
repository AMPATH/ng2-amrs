import { Component,
    OnInit , OnDestroy , AfterViewInit, OnChanges ,
    Output , EventEmitter, Input , ChangeDetectorRef,
    ViewChild , SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { GridOptions } from 'ag-grid/main';

@Component({
  selector: 'data-entry-statistics-monthly-list',
  templateUrl: './data-entry-statistics-monthly-list.component.html',
  styleUrls: ['./data-entry-statistics-monthly-list.component.css']
})
export class DataEntryStatisticsMonthlyListComponent
  implements OnInit , OnChanges , AfterViewInit {
  public title: string = 'Encounters Per Type Per Month';
  public pinnedBottomRowData: any = [];
  @Input() public params: any;

  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300
  };

  @Input() public dataEntryEncounters: any = [];
  @Output() public patientListParams = new EventEmitter<any>();
  public monthlyStats: any = [];
  public monthlyRowData: any[];
  public dataEntryEncounterColdef: any = [];
  public totalMonthlyEncounters: number = 0;

  constructor(
    private _cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
  }
  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges) {
       if (changes.dataEntryEncounters && this.dataEntryEncounters.length > 0) {
          this.procesMonthlyData();
       }else {
          this.monthlyRowData = [];
       }
  }

  public procesMonthlyData() {

    let monthlyEntryArray = [];
    let columnArray = [];
    let trackColumns = [];
    let dataEntryEncounters = this.dataEntryEncounters;
    let encounterMap = new Map();

    this.dataEntryEncounterColdef = [];
    this.pinnedBottomRowData = [];

    this.dataEntryEncounterColdef.push(
      {
        headerName: 'Encounter Types',
        field: 'encounterType'
      },
      {
        headerName: 'Total',
        field: 'rowTotals',
        onCellClicked: (column) => {
          let patientListParams = {
             'providerUuid': this.params.providerUuid,
             'locationUuids': this.params.locationUuids,
             'startDate': this.params.startDate,
             'endDate': this.params.endDate
             };
          this.patientListParams.emit(patientListParams);
        },
        cellRenderer: (column) => {
                  if (typeof column.value === 'undefined') {
                    return 0;
                  }else {
                    return '<a href="javascript:void(0);" title="providercount">'
                  + column.value + '</a>';
                  }
        }
      }
    );

    _.each(dataEntryEncounters, (stat: any) => {
          let encounterId = stat.encounter_type_id;
          let month = stat.month;
          let monthStart = Moment(month).startOf('month').format('YYYY-MM-DD');
          let monthEnd = Moment(month).endOf('month').format('YYYY-MM-DD');

          if (_.includes(trackColumns, month) === false) {

            this.dataEntryEncounterColdef.push(
                {
                  headerName: month,
                  field: month,
                  onCellClicked: (column) => {
                    let patientListParams = {
                       'startDate': monthStart,
                       'encounterTypeUuids': column.data.encounterUuid,
                       'locationUuids': this.params.locationUuids,
                       'providerUuid': this.params.providerUuid,
                       'endDate': monthEnd

                    };
                    this.patientListParams.emit(patientListParams);
                  },
                  cellRenderer: (column) => {
                    if (typeof column.value === 'undefined') {

                       return 0;
                     }else {

                      return '<a href="javascript:void(0);" title="Identifiers">'
                     + column.value + '</a>';

                     }
                  }
                }
              );

            trackColumns.push(month);

            }

          let monthlyObj = {
                encounterType: stat.encounter_type,
                'encounterUuid': stat.encounter_type_uuid,
                'encounterCounts': [
                  {
                  'encounterMonth' : stat.month ,
                  'encounterCount': stat.encounters_count
                  }
                ]

           };

          let savedEncounter = encounterMap.get(encounterId);

           // console.log('Saved Encounter', savedEncounter);
          if (typeof savedEncounter !== 'undefined') {
             savedEncounter.encounterCounts.push({
              'encounterMonth' : stat.month ,
              'encounterCount': stat.encounters_count
             });
            }else {
             encounterMap.set(encounterId, monthlyObj);
            }

      });

    this.processMonthlyRows(encounterMap);

  }

  public processMonthlyRows(encounterMap) {

    let allRows = [];
    let totalEncounters = 0;
    let colSumMap = new Map();
    encounterMap.forEach((encounterItem: any) => {
         let encounterRow = {
           encounterType : encounterItem.encounterType,
           'encounterUuid': encounterItem.encounterUuid,
           'rowTotals': 0
         };
         let rowTotal = 0;

         let encounterCounts = encounterItem.encounterCounts;

         _.each(encounterCounts, (encounterCount: any) => {

              encounterRow[encounterCount.encounterMonth] = encounterCount.encounterCount;
              rowTotal += encounterCount.encounterCount;
              let colTotal = colSumMap.get(encounterCount.encounterMonth);
              if (typeof colTotal === 'undefined') {
                    colSumMap.set(encounterCount.encounterMonth, encounterCount.encounterCount);
              }else {
                      let newTotal = colTotal + encounterCount.encounterCount;
                      colSumMap.set(encounterCount.encounterMonth, newTotal);
              }

          });

         encounterRow.rowTotals = rowTotal;
         totalEncounters += rowTotal;

         allRows.push(encounterRow);
    });

    this.totalMonthlyEncounters = totalEncounters;

    let totalsRow = this.createTotalsRow(colSumMap, totalEncounters);
    let totalRowArray = [];
    totalRowArray.push(totalsRow);
    this.pinnedBottomRowData = totalRowArray;
    this.monthlyRowData = allRows;
    this.setPinnedRow();

}
public createTotalsRow(totalsMap, totalEncounters) {

  let rowTotalObj = {
    'encounterUuid' : '',
    'encounterType': 'Total',
    'rowTotals': totalEncounters
  };

  totalsMap.forEach( (monthTotal, index) => {
      rowTotalObj[index] = monthTotal;
  });

  return rowTotalObj;

}

 public setPinnedRow() {

  if (this.gridOptions.api) {
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }
  return true;

  }

}
