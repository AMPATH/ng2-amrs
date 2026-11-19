import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';

/**
 * Tabular view of the MOH 731 report. Built the same way as the grid on the
 * older MOH 731 report: one column group per sub section of the form, one
 * column per indicator, and a cell click drills into the patient list.
 */
@Component({
  selector: 'app-moh731-tabular',
  templateUrl: './moh731-tabular.component.html',
  styleUrls: ['./moh731-tabular.component.css']
})
export class Moh731TabularViewComponent {
  /**
   * The sub sections the grid closes with a total, and what each total is
   * called. Only the two ART sub sections carry one: they disaggregate a single
   * figure across age and sex, so summing the row means something. Elsewhere a
   * sub section's columns count different things and a total of them would not.
   */
  private static readonly TOTALS = [
    {
      match: /starting art/i,
      header: 'Starting ART (Total)',
      indicator: 'started_art'
    },
    {
      match: /currently on art/i,
      header: 'Currently on ART (Total)',
      indicator: 'on_art'
    }
  ];

  public gridOptions: any = {
    columnDefs: [],
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    suppressCellSelection: false,
    rowSelection: 'single',
    // Indicator labels carry their HV code, so columns are sized to their
    // header rather than clipped to a fixed width.
    autoSizePadding: 12,
    onGridReady: () => this.autoSizeColumns(),
    onRowDataChanged: () => this.autoSizeColumns()
  };

  public quickFilterText = '';

  @Output() public indicatorSelected = new EventEmitter<any>();

  // tslint:disable-next-line:no-input-rename
  @Input('rowData')
  public data: Array<any> = [];

  @Input() public pinnedBottomRowData: Array<any> = [];

  @Input() public isReleased: boolean;

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;

  private _sectionDefs: Array<any> = [];
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }
  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    this._sectionDefs = v || [];
    this.setColumns(this._sectionDefs);
  }

  public setColumns(sectionsData: Array<any>) {
    const defs: Array<any> = [
      {
        headerName: 'Location',
        field: 'location',
        pinned: 'left',
        minWidth: 200
      }
    ];

    (sectionsData || []).forEach((section, sectionIndex) => {
      const group: any = {
        headerName: section.sectionTitle,
        headerTooltip: section.sectionTitle,
        children: []
      };
      // An indicator can sit under two boxes of the form (a male and a female
      // box of a figure that is not split by sex), so the fields behind a total
      // are counted once each.
      const fields: string[] = [];
      (section.indicators || []).forEach((indicator) => {
        group.children.push({
          headerName: indicator.label,
          headerTooltip: indicator.label,
          field: indicator.indicator,
          minWidth: 90,
          indicatorTitle: indicator.title || section.sectionTitle,
          indicatorGender: indicator.gender || ''
        });
        if (fields.indexOf(indicator.indicator) === -1) {
          fields.push(indicator.indicator);
        }
      });
      if (group.children.length > 0) {
        const total = Moh731TabularViewComponent.TOTALS.find((rule) =>
          rule.match.test(section.sectionTitle || '')
        );
        if (total) {
          group.children.push(
            this.totalColumn(
              total.header,
              total.indicator,
              sectionIndex,
              fields
            )
          );
        }
        defs.push(group);
      }
    });

    this.gridOptions.columnDefs = defs;
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
    this.autoSizeColumns();
  }

  /**
   * Closes a sub section with the sum of its indicators. Where the sub section
   * disaggregates one figure, the total is that figure undivided and has a
   * patient list of its own, which `indicator` names; the displayed value still
   * comes from summing the row so it agrees with the columns beside it.
   */
  private totalColumn(
    header: string,
    indicator: string,
    sectionIndex: number,
    fields: string[]
  ) {
    return {
      headerName: header,
      headerTooltip: header + ' – click to list these patients',
      colId: 'total_' + sectionIndex,
      field: indicator,
      // The total's patients are those of the boxes it adds up, listed together.
      patientListIndicator: fields.join(','),
      indicatorTitle: header,
      indicatorGender: '',
      minWidth: 150,
      cellClass: 'moh-tabular__total-cell',
      headerClass: 'moh-tabular__total-header',
      valueGetter: (params: any) => {
        if (!params.data) {
          return null;
        }
        let total = 0;
        let counted = 0;
        fields.forEach((field) => {
          const value = params.data[field];
          const numeric =
            typeof value === 'number'
              ? value
              : typeof value === 'string' &&
                value.trim() !== '' &&
                !isNaN(+value)
              ? +value
              : null;
          if (numeric !== null) {
            total += numeric;
            counted++;
          }
        });
        // A sub section none of whose indicators reported stays blank rather
        // than showing a zero it did not measure.
        return counted > 0 ? total : null;
      }
    };
  }

  /** Widens every column to fit its header and values, never clipping either. */
  public autoSizeColumns() {
    if (!this.agGrid || !this.agGrid.columnApi) {
      return;
    }
    // Runs after the grid has laid out the columns it was just given.
    setTimeout(() => {
      if (this.agGrid && this.agGrid.columnApi) {
        this.agGrid.columnApi.autoSizeAllColumns('api');
      }
    });
  }

  public onCellClicked(event: any) {
    if (
      !event.colDef ||
      !event.colDef.field ||
      event.colDef.field === 'location'
    ) {
      return;
    }
    this.indicatorSelected.emit({
      indicator: event.colDef.patientListIndicator || event.colDef.field,
      title: event.colDef.indicatorTitle || event.colDef.headerName,
      gender: event.colDef.indicatorGender || '',
      value: event.value,
      location: event.data ? event.data.location_uuid : null
    });
  }

  public exportToCsv() {
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.exportDataAsCsv({
        fileName: 'moh-731-report.csv'
      });
    }
  }
}
