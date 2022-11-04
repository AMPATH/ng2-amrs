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
  selector: 'data-entry-statistics-provider-list',
  templateUrl: './data-entry-statistics-providers-list.component.html',
  styleUrls: ['./data-entry-statistics-providers-list.component.css']
})
export class DataEntryStatisticsProviderListComponent
  implements OnInit, OnChanges, AfterViewInit
{
  public title = 'Encounters Per Type Per Provider';
  public totalProviderEncounters = 0;
  public pinnedBottomRowData: any = [];
  public allClicalEncounters: any = [];

  public gridOptions: any = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    onGridReady: () => {}
  };

  @Input() public dataEntryEncounters: any = [];
  @Input() public params: any;
  @Output() public patientListParams = new EventEmitter<any>();

  public dataEntryEncounterColdef: any = [];

  public providerStats: any = [];
  public providerRowData: any[];

  constructor(private _cd: ChangeDetectorRef) {}

  public ngOnInit() {}
  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.dataEntryEncounters && this.dataEntryEncounters.length > 0) {
      this.processProviderData();
    } else {
      this.providerRowData = [];
    }
  }

  public processProviderData() {
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
        headerName: 'Provider',
        field: 'providers'
      },
      {
        headerName: 'providerUuid',
        field: 'providerUuid',
        hide: true
      },
      {
        headerName: 'Total',
        field: 'total',
        onCellClicked: (column) => {
          const patientListParams = {
            providerUuid: column.data.providerUuid,
            locationUuids: column.data.locationUuid,
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
              '<a href="javascript:void(0);" title="Total Encounters">' +
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
            providerUuid: column.data.providerUuid,
            locationUuids: this.params.locationUuids,
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
              '<a href="javascript:void(0);" title="Total Clinical Encounters">' +
              column.value +
              '</a>'
            );
          }
        }
      }
    );
    this.gridOptions.groupDefaultExpanded = -1;

    const providerMap = new Map();

    _.each(dataEntryStats, (stat: any) => {
      const formId = stat.encounter_type_id;
      const providerId = stat.provider_id;
      const encounterTypeUuid = stat.encounter_type_uuid;

      if (_.includes(trackColumns, formId) === false) {
        this.dataEntryEncounterColdef.push({
          headerName: stat.encounter_type,
          field: stat.encounter_type,
          onCellClicked: (column) => {
            const patientListParams = {
              providerUuid: column.data.providerUuid,
              encounterTypeUuids: encounterTypeUuid,
              visitTypeUuids: this.params.visitTypeUuids,
              locationUuids: column.data.locationUuid,
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
        });

        trackColumns.push(formId);
      }
      const providerObj = {
        encounters: [
          {
            encounterUuid: stat.encounter_type_uuid,
            encounter_type: stat.encounter_type,
            encounters_count: stat.encounters_count,
            is_clinical: stat.is_clinical_encounter
          }
        ],
        providerName: stat.provider_name,
        providerUuid: stat.provider_uuid,
        location: stat.location,
        locationUuid: stat.location_uuid
      };

      const providerSaved = providerMap.get(providerId);

      if (typeof providerSaved !== 'undefined') {
        providerSaved.encounters.push({
          encounterUuid: stat.encounter_type_uuid,
          encounter_type: stat.encounter_type,
          encounters_count: stat.encounters_count,
          is_clinical: stat.is_clinical_encounter,
          location: stat.location,
          locationUuid: stat.location_uuid
        });
      } else {
        providerMap.set(providerId, providerObj);
      }
    });

    this.generateProviderRowData(providerMap);
  }

  public generateProviderRowData(providerMap) {
    const rowArray = [];
    const colSumMap = new Map();
    let totalProvidersEncounters = 0;
    let totalProviderClinicalEncounters = 0;
    this.allClicalEncounters = [];

    providerMap.forEach((providerItem: any) => {
      const forms = providerItem.encounters;
      let totalEncounters = 0;
      let totalClinical = 0;
      const specificProvider: any = {
        providers: providerItem.providerName,
        location: providerItem.location,
        locationUuid: providerItem.locationUuid,
        providerUuid: providerItem.providerUuid,
        clinicalEncounters: []
      };

      _.each(forms, (form: any) => {
        specificProvider[form.encounter_type] = form.encounters_count;
        totalEncounters += form.encounters_count;
        if (form.is_clinical === 1) {
          totalClinical += form.encounters_count;
          specificProvider.clinicalEncounters.push(form.encounterUuid);
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

      specificProvider.total = totalEncounters;
      specificProvider.total_clinical = totalClinical;
      totalProvidersEncounters += totalEncounters;
      totalProviderClinicalEncounters += totalClinical;
      rowArray.push(specificProvider);
    });

    const totalRow = this.createTotalsRow(
      colSumMap,
      totalProvidersEncounters,
      totalProviderClinicalEncounters
    );
    const totalRowArray = [];
    totalRowArray.push(totalRow);
    this.totalProviderEncounters = totalProvidersEncounters;
    this.providerRowData = rowArray;
    this.pinnedBottomRowData = totalRowArray;
    this.setPinnedRow();
  }

  public createTotalsRow(
    totalsMap,
    totalProvidersEncounters,
    totalProviderClinicalEncounters
  ) {
    const rowTotalObj = {
      providers: 'Total',
      providerUuid: this.params.providerUuid,
      total: totalProvidersEncounters,
      total_clinical: totalProviderClinicalEncounters,
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
