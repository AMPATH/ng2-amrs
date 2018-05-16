import { Component,
    OnInit , OnDestroy , AfterViewInit, OnChanges ,
    Output , EventEmitter, Input , ChangeDetectorRef,
    ViewChild , SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'data-entry-statistics-creators-list',
  templateUrl: './data-entry-statistics-creators-list.component.html',
  styleUrls: ['./data-entry-statistics-creators-list.component.css']
})
export class DataEntryStatisticsCreatorsListComponent
  implements OnInit , OnChanges , AfterViewInit {
  public title: string = 'Encounters Per Type Per Creator';
  public pinnedBottomRowData: any = [];
  public allClicalEncounters: any  = [];
  public totalEncounters: number = 0;

  public gridOptions: any = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300
  };
  @Input() public dataEntryEncounters: any = [];
  @Input() public params: any;
  @Output() public patientListParams = new EventEmitter<any>();

  public dataEntryEncounterColdef: any = [];

  public creatorStats: any = [];
  public creatorRowData: any = [];

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
          this.processCreatorData();
       } else {
         this.creatorRowData = [];
       }
  }

  public processCreatorData() {

    let dataEntryArray = [];
    let columnArray = [];
    let trackColumns = [];
    let dataEntryStats = this.dataEntryEncounters;
    this.dataEntryEncounterColdef = [];
    this.pinnedBottomRowData = [];
    this.dataEntryEncounterColdef.push(
      {
        headerName: 'Creator',
        field: 'creators'
      },
      {
        headerName: 'Total',
        field: 'total',
        onCellClicked: (column) => {
                    let patientListParams = {
                       'creatorUuid': column.data.creatorUuid,
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
      },
      {
        headerName: 'Total Clinical Encounters',
        field: 'total_clinical',
        onCellClicked: (column) => {
          let patientListParams = {
             'creatorUuid': column.data.creatorUuid,
             'locationUuids': this.params.locationUuids,
             'encounterTypeUuids': column.data.clinicalEncounters,
             'startDate': this.params.startDate,
             'endDate': this.params.endDate
             };
          this.patientListParams.emit(patientListParams);
        },
        cellRenderer: (column) => {
                    if (typeof column.value === 'undefined' || column.value === 0) {
                      return 0;
                    }else {
                      return '<a href="javascript:void(0);" title="providercount">'
                    + column.value + '</a>';
                    }
        }
      }
    );
    let creatorMap =  new Map();
    _.each(dataEntryStats, (stat: any) => {
          let form = stat.encounter_type;
          let formId = stat.encounter_type_id;
          let creatorId = stat.creator_id;
          let creatorUuid = stat.user_uuid;
          let encounterTypeUuid = stat.encounter_type_uuid;

          if (_.includes(trackColumns, formId) === false) {

            this.dataEntryEncounterColdef.push(
                {
                  headerName: stat.encounter_type,
                  field: stat.encounter_type,
                  onCellClicked: (column) => {
                    let patientListParams = {
                       'creatorUuid': column.data.creatorUuid,
                       'encounterTypeUuids': encounterTypeUuid,
                       'locationUuids': this.params.locationUuids,
                       'startDate': this.params.startDate,
                       'endDate': this.params.endDate
                    };
                    this.patientListParams.emit(patientListParams);
                  },
                  cellRenderer: (column) => {
                    if (typeof column.value === 'undefined' || column.value === 0) {
                       return 0;
                     }else {
                      return '<a href="javascript:void(0);" title="providercount">'
                     + column.value + '</a>';
                     }
                  }
                }
              );

            trackColumns.push(formId);
          }
          let creatorObj = {
            'encounters': [
             {
               'encounter_type' : stat.encounter_type,
               'encounterUuid': stat.encounter_type_uuid,
               'encounters_count' : stat.encounters_count,
               'is_clinical' : stat.is_clinical_encounter
              }
            ],
            'creatorUuid': stat.user_uuid,
            'creatorName': stat.creator_name
          };

          let creatorSaved = creatorMap.get(creatorId);

          if (typeof creatorSaved !== 'undefined') {

               creatorSaved.encounters.push( {
                'encounter_type' : stat.encounter_type,
                'encounterUuid': stat.encounter_type_uuid,
                'encounters_count' : stat.encounters_count,
                'is_clinical' : stat.is_clinical_encounter
               });

          }else {
              creatorMap.set(creatorId, creatorObj);
          }

      });

    this.generatecreatorRowData(creatorMap);

  }

  public generatecreatorRowData(creatorMap) {

    let rowArray = [];
    let colSumMap = new Map();
    let totalCreatorEncounters: number = 0;
    let totalCreatorClinicalEncounters: number = 0;
    this.allClicalEncounters = [];
    creatorMap.forEach( (creatorItem: any) => {

      let forms = creatorItem.encounters;
      let totalEncounters = 0;
      let totalClinical = 0;
      let specificcreator: any = {
        creators: creatorItem.creatorName,
        creatorUuid: creatorItem.creatorUuid,
        clinicalEncounters: []
      };

      _.each(forms, (form: any) => {
        specificcreator[form.encounter_type] = form.encounters_count;

        totalEncounters += form.encounters_count;
        if (form.is_clinical === 1) {

          totalClinical += form.encounters_count;
          specificcreator.clinicalEncounters.push(form.encounterUuid);
          this.allClicalEncounters.push(form.encounterUuid);
        }
        let colTotal = colSumMap.get(form.encounter_type);
        if (typeof colTotal === 'undefined') {
              colSumMap.set(form.encounter_type, form.encounters_count);
        }else {
                let newTotal = colTotal + form.encounters_count;
                colSumMap.set(form.encounter_type, newTotal);
        }
      });
      totalCreatorEncounters += totalEncounters;
      specificcreator.total = totalEncounters;
      specificcreator.total_clinical = totalClinical;
      totalCreatorClinicalEncounters += totalClinical;
      rowArray.push(specificcreator);
    });
    this.totalEncounters = totalCreatorEncounters;
    let totalRow = this.createTotalsRow(colSumMap, totalCreatorEncounters,
      totalCreatorClinicalEncounters);
    let totalRowArray = [];
    totalRowArray.push(totalRow);
    this.creatorRowData = rowArray;
    this.pinnedBottomRowData = totalRowArray;
    this.setPinnedRow();
  }
  public createTotalsRow(totalsMap, totalCreatorEncounters, totalCreatorClinicalEncounters) {

    let rowTotalObj = {
      'creators': 'Totals',
      'creatorUuid': '',
      'total': totalCreatorEncounters,
      'total_clinical': totalCreatorClinicalEncounters,
      'clinicalEncounters': _.uniq(this.allClicalEncounters)
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
