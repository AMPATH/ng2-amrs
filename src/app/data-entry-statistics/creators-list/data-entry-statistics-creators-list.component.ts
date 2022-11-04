import {
  Component,
  OnInit,
  AfterViewInit,
  OnChanges,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'data-entry-statistics-creators-list',
  templateUrl: './data-entry-statistics-creators-list.component.html',
  styleUrls: ['./data-entry-statistics-creators-list.component.css']
})
export class DataEntryStatisticsCreatorsListComponent
  implements OnInit, OnChanges, AfterViewInit
{
  public title = 'Encounters Per Type Per Creator';
  public pinnedBottomRowData: any = [];
  public allClicalEncounters: any = [];
  public totalEncounters = 0;

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

  constructor(private _cd: ChangeDetectorRef) {}

  public ngOnInit() {}
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
    const trackColumns = [];
    const dataEntryStats = this.dataEntryEncounters;
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
        headerName: 'Creator',
        field: 'creators'
      },
      {
        headerName: 'Is Provider',
        field: 'isProvider'
      },
      {
        headerName: 'Total',
        field: 'total',
        onCellClicked: (column) => {
          const patientListParams = {
            creatorUuid: column.data.creatorUuid,
            locationUuids: column.data.locationUuid,
            visitTypeUuids: this.params.visitTypeUuids,
            startDate: this.params.startDate,
            endDate: this.params.endDate
          };
          this.patientListParams.emit(patientListParams);
        },
        cellRenderer: (column) => {
          if (typeof column.value === 'undefined') {
            return '';
          } else {
            return (
              '<a href="javascript:void(0);" title="providercount">' +
              column.value +
              '</a>'
            );
          }
        }
      },
      {
        headerName: 'Total Clinical Encounters',
        field: 'total_clinical',
        onCellClicked: (column) => {
          const patientListParams = {
            creatorUuid: column.data.creatorUuid,
            locationUuids: column.data.locationUuid,
            encounterTypeUuids: column.data.clinicalEncounters,
            visitTypeUuids: this.params.visitTypeUuids,
            startDate: this.params.startDate,
            endDate: this.params.endDate
          };
          this.patientListParams.emit(patientListParams);
        },
        cellRenderer: (column) => {
          if (typeof column.value === 'undefined' || column.value === 0) {
            return '';
          } else {
            return (
              '<a href="javascript:void(0);" title="providercount">' +
              column.value +
              '</a>'
            );
          }
        }
      }
    );
    this.gridOptions.groupDefaultExpanded = -1;
    const creatorMap = new Map();
    _.each(dataEntryStats, (stat: any) => {
      const formId = stat.encounter_type_id;
      const creatorId = stat.creator_id;
      const encounterTypeUuid = stat.encounter_type_uuid;
      const isProvider = stat.is_provider;
      if (_.includes(trackColumns, formId) === false) {
        this.dataEntryEncounterColdef.push({
          headerName: stat.encounter_type,
          field: stat.encounter_type,
          onCellClicked: (column) => {
            const patientListParams = {
              creatorUuid: column.data.creatorUuid,
              encounterTypeUuids: encounterTypeUuid,
              visitTypeUuids: this.params.visitTypeUuids,
              locationUuids: column.data.locationUuid,
              startDate: this.params.startDate,
              endDate: this.params.endDate
            };
            this.patientListParams.emit(patientListParams);
          },
          cellRenderer: (column) => {
            if (typeof column.value === 'undefined' || column.value === 0) {
              return '';
            } else {
              return (
                '<a href="javascript:void(0);" title="providercount">' +
                column.value +
                '</a>'
              );
            }
          }
        });

        trackColumns.push(formId);
      }
      const creatorObj = {
        encounters: [
          {
            encounter_type: stat.encounter_type,
            encounterUuid: stat.encounter_type_uuid,
            encounters_count: stat.encounters_count,
            is_clinical: stat.is_clinical_encounter
          }
        ],
        creatorUuid: stat.user_uuid,
        creatorName: stat.creator_name,
        isProvider: stat.is_provider,
        location: stat.location,
        locationUuid: stat.location_uuid
      };

      const creatorSaved = creatorMap.get(creatorId);

      if (typeof creatorSaved !== 'undefined') {
        creatorSaved.encounters.push({
          encounter_type: stat.encounter_type,
          encounterUuid: stat.encounter_type_uuid,
          encounters_count: stat.encounters_count,
          is_clinical: stat.is_clinical_encounter,
          location: stat.location,
          locationUuid: stat.location_uuid
        });
      } else {
        creatorMap.set(creatorId, creatorObj);
      }
    });

    this.generatecreatorRowData(creatorMap);
  }

  public generatecreatorRowData(creatorMap) {
    const rowArray = [];
    const colSumMap = new Map();
    let totalCreatorEncounters = 0;
    let totalCreatorClinicalEncounters = 0;
    this.allClicalEncounters = [];
    creatorMap.forEach((creatorItem: any) => {
      const forms = creatorItem.encounters;
      let totalEncounters = 0;
      let totalClinical = 0;
      const specificcreator: any = {
        creators: creatorItem.creatorName,
        creatorUuid: creatorItem.creatorUuid,
        location: creatorItem.location,
        locationUuid: creatorItem.locationUuid,
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
        const colTotal = colSumMap.get(form.encounter_type);
        if (typeof colTotal === 'undefined') {
          colSumMap.set(form.encounter_type, form.encounters_count);
        } else {
          const newTotal = colTotal + form.encounters_count;
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
    const totalRow = this.createTotalsRow(
      colSumMap,
      totalCreatorEncounters,
      totalCreatorClinicalEncounters
    );
    const totalRowArray = [];
    totalRowArray.push(totalRow);
    this.creatorRowData = rowArray;
    this.pinnedBottomRowData = totalRowArray;
    this.setPinnedRow();
  }
  public createTotalsRow(
    totalsMap,
    totalCreatorEncounters,
    totalCreatorClinicalEncounters
  ) {
    const rowTotalObj = {
      creators: 'Totals',
      creatorUuid: '',
      total: totalCreatorEncounters,
      total_clinical: totalCreatorClinicalEncounters,
      clinicalEncounters: _.uniq(this.allClicalEncounters),
      locationUuid: this.params.locationUuids
    };
    totalsMap.forEach((monthTotal, index) => {
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
