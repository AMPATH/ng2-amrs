import { Component,
    OnInit , OnDestroy , AfterViewInit, OnChanges ,
    Output , EventEmitter, Input , ChangeDetectorRef,
    ViewChild , SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { GridOptions, GridApi } from 'ag-grid/main';

@Component({
  selector: 'data-entry-statistics-daily-list',
  templateUrl: './data-entry-statistics-daily-list.component.html',
  styleUrls: ['./data-entry-statistics-daily-list.component.css']
})
export class DataEntryStatisticsDailyListComponent
  implements OnInit , OnChanges , AfterViewInit {
  public title: string = 'Encounter Types Per Day';
  public totalEncounters: number = 0;
  public pinnedBottomRowData: any = [];

  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    onGridSizeChanged : () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    onGridReady: (params) => {
        if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
        }
    }
  };

  @Input() public dataEntryEncounters: any;
  @Input() public params: any;
  @Output() public patientListParams = new EventEmitter<any>();

  public dataEntryEncounterColdef: any = [];

  public dataEntryStats: any = [];
  public dataEntryRowData: any[];

  constructor(
    private _cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
  }
  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges) {
       if (changes.dataEntryEncounters
        && this.dataEntryEncounters.length > 0) {
          this.processEncounterListData();
       } else {
         this.dataEntryRowData = [];
       }
  }

   // process encounter list data

   public processEncounterListData() {

    let dataEntryArray = [];
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

        // load the other columns based on date
        let encounterDate = Moment(stat.date).format('DD-MM-YYYY');
        let startDate = Moment(stat.date).toISOString();
        let encounterId = stat.encounter_type_id;

        if (_.includes(trackColumns, encounterDate) === false) {

              this.dataEntryEncounterColdef.push(
                {
                  headerName: encounterDate,
                  field: encounterDate,
                  onCellClicked: (column) => {
                    let patientListParams = {
                       'startDate': Moment(stat.date).format('YYYY-MM-DD'),
                       'encounterTypeUuids': column.data.encounterUuid,
                       'endDate': Moment(stat.date).format('YYYY-MM-DD'),
                       'locationUuids': this.params.locationUuids,
                       'providerUuid': this.params.providerUuid,
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

              trackColumns.push(encounterDate);

         }

        let encounterObj = {
          'encounterType': stat.encounter_type,
          'encounterUuid': stat.encounter_type_uuid,
          'encounterCounts': [
            {
              'encounterDate': encounterDate,
              'encounterCount': stat.encounters_count,

            }
          ]
      };

        let savedEncounter = encounterMap.get(encounterId);

        // console.log('Saved Encounter', savedEncounter);

        if (typeof savedEncounter !== 'undefined') {
          savedEncounter.encounterCounts.push({

              'encounterDate': encounterDate,
              'encounterCount': stat.encounters_count

          });
         }else {

          encounterMap.set(encounterId, encounterObj);
         }

    });

    this.processEncounterRows(encounterMap);

  }

  public processEncounterRows(encounterMap) {

      let allRows = [];
      let totalEncounters = 0;
      let colSumMap = new Map();

      encounterMap.forEach((encounterItem: any) => {
           // console.log('Encounter Item', encounterItem);
           let encounterRow = {
            encounterType : encounterItem.encounterType,
            'encounterUuid': encounterItem.encounterUuid,
            'rowTotals': 0
          };
           let rowTotal = 0;

           let encounterCounts = encounterItem.encounterCounts;

           _.each(encounterCounts, (encounterCount: any) => {
                encounterRow[encounterCount.encounterDate] = encounterCount.encounterCount;
                rowTotal += encounterCount.encounterCount;
                let colTotal = colSumMap.get(encounterCount.encounterDate);
                if (typeof colTotal === 'undefined') {
                    colSumMap.set(encounterCount.encounterDate, encounterCount.encounterCount);
                }else {
                      let newTotal = colTotal + encounterCount.encounterCount;
                      colSumMap.set(encounterCount.encounterDate, newTotal);
                }

            });

           encounterRow.rowTotals = rowTotal;
           totalEncounters += rowTotal;
           allRows.push(encounterRow);
      });

      this.totalEncounters = totalEncounters;

      let totalsRow = this.createTotalsRow(colSumMap, totalEncounters);
      let totalRowArray = [];
      totalRowArray.push(totalsRow);
      this.pinnedBottomRowData = totalRowArray;
      this.dataEntryRowData = allRows;
      this._cd.detectChanges();
      this.setPinnedRow();

  }

  public createTotalsRow(totalsMap, totalEncounters) {

      let rowTotalObj = {
        'encounterUuid' : '',
        'encounterType': 'Total',
        'rowTotals': totalEncounters
      };

      totalsMap.forEach( (dateTotal, index) => {
          rowTotalObj[index] = dateTotal;
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
