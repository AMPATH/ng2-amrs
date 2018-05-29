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
    onGridSizeChanged : () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    onGridReady: (params) => {
        if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
        // this.gridOptions.groupDefaultExpanded = -1;
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
        headerName: 'Location',
        field: 'location',
        // pinned: 'left',
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'Encounter Types',
        field: 'encounter_type' // 'encounterType'
      },
      {
        headerName: 'Total',
        field: 'rowTotals', // 'rowTotals',
        onCellClicked: (column) => {
          let patientListParams = {
             'providerUuid': this.params.providerUuid,
             'locationUuids': column.data.locationUuid,
             'encounterTypeUuids': column.data.encounterTypeUuid,
             'startDate': this.params.startDate,
             'endDate': this.params.endDate
             };
          this.patientListParams.emit(patientListParams);
        },
        cellRenderer: (column) => {
                  if (typeof column.value === 'undefined') {
                    return ' ';
                  }else {
                    return '<a href="javascript:void(0);" title="providercount">'
                  + column.value + '</a>';
                  }
        }
      }
    );
    this.gridOptions.groupDefaultExpanded = -1;
    let dynamicCols = [];

    _.each(dataEntryEncounters, (stat: any) => {
        // load the other columns based on date
        let encounterDate = Moment(stat.date).format('DD-MM-YYYY');
        let startDate = Moment(stat.date).toISOString();
        let encounterId = stat.encounter_type_id;

        if (_.includes(trackColumns, encounterDate) === false) {

              dynamicCols.push(
                {
                  headerName: encounterDate,
                  field:  encounterDate,
                  onCellClicked: (column) => {
                    let patientListParams = {
                       'startDate': Moment(stat.date).format('YYYY-MM-DD'),
                       'encounterTypeUuids': column.data.encounterTypeUuid,
                       'endDate': Moment(stat.date).format('YYYY-MM-DD'),
                       'locationUuids': column.data.locationUuid,
                       'providerUuid': this.params.providerUuid,
                    };
                    this.patientListParams.emit(patientListParams);
                  },
                  cellRenderer: (column) => {
                    if (typeof column.value === 'undefined') {

                       return ' ';
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
          'location': stat.location,
          'locationUuid': stat.locationUuid,
          'encounterTypes' : []
        };

        let e = {
          'encounterTypeUuid': stat.encounter_type_uuid,
          'encounterName': stat.encounter_type,
          'encounterCounts': [
            {
             'encounterDate' : encounterDate ,
             'encounterCount': stat.encounters_count
            }
          ]
         };

        let savedEncounter = encounterMap.get(stat.location);

        if (typeof savedEncounter !== 'undefined') {

          let savedEncounterTypes: any =  savedEncounter.encounterTypes;
          let savedSpecificEncounter = savedEncounterTypes[stat.encounter_type];

          if (typeof savedSpecificEncounter !== 'undefined') {

           savedEncounter.encounterTypes[stat.encounter_type].encounterCounts.push({
               'encounterDate': encounterDate,
               'encounterCount': stat.encounters_count
           });

          } else {

            savedEncounter.encounterTypes[stat.encounter_type] = e;

          }
          encounterMap.set(stat.location, savedEncounter);

       }else {

         encounterObj.encounterTypes[stat.encounter_type] = e;

         encounterMap.set(stat.location, encounterObj);
       }

    });

    // sort col defs based on dates i.e first to last date
    let sortedDymanicCols = this.sortColumnHeadersByDate(dynamicCols);
    this.mergeColsDef(sortedDymanicCols);

    this.processEncounterRows(encounterMap);

  }

  public sortColumnHeadersByDate(columns) {
   return columns.sort((a: any, b: any) => {

      let dateA = Moment(a.field).format();
      let dateB = Moment(b.field).format();

      if (dateA < dateB) {            // a comes first
        return -1;
       } else if (dateB < dateA) {     // b comes first
        return 1;
      } else {                // equal, so order is irrelevant
        return 0 ;           // note: sort is not necessarily stable in JS
      }
   });

  }

  public mergeColsDef(dynamicCols) {

      _.each(dynamicCols, (col) => {
          this.dataEntryEncounterColdef.push(col);
      });

  }

  public processEncounterRows(encounterMap) {

    let allRows = [];
    let totalEncounters = 0;
    let colSumMap = new Map();
    let encountersRows = [];
    encounterMap.forEach((encounterItem: any, encounterIndex) => {
        let locationName = encounterItem.location;
        let locationUuid = encounterItem.locationUuid;
        let encounterTypes = encounterItem.encounterTypes;
        Object.keys(encounterTypes).forEach((key) => {
          let encounterRow = {
            'rowTotals': 0
          };
          encounterRow['location'] =  locationName;
          encounterRow['locationUuid'] =  locationUuid;
          encounterRow['encounter_type'] =  key;
          encounterRow['encounterTypeUuid'] = encounterTypes[key].encounterTypeUuid;
          let encounterType = encounterTypes[key];
          let encounterCounts = encounterType.encounterCounts;
          let rowTotal = 0;
          _.each(encounterCounts, (encounterCount) => {
            encounterRow[encounterCount.encounterDate] = encounterCount.encounterCount;
            rowTotal += encounterCount.encounterCount;

           });
          encounterRow['rowTotals'] = rowTotal;
          totalEncounters += rowTotal;
          allRows.push(encounterRow);
        });

    });
    this.dataEntryRowData = allRows;
    this.totalEncounters = totalEncounters;

    /*

      let totalsRow = this.createTotalsRow(colSumMap, totalEncounters);
      let totalRowArray = [];
      totalRowArray.push(totalsRow);
      this.pinnedBottomRowData = totalRowArray;
      this.dataEntryRowData = allRows;
      this._cd.detectChanges();
      this.setPinnedRow();
    */

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
