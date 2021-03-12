import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CellClickedEvent, ColGroupDef, GridOptions } from 'ag-grid';

import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';

interface IndicatorDefinition {
  label: string;
  indicator: string;
}

@Component({
  selector: 'cervical-screening-report-tabular',
  templateUrl: './cervical-screening-report-tabular.component.html',
  styleUrls: ['./cervical-screening-report-tabular.component.css']
})
export class CervicalScreeningReportTabularComponent {
  @ViewChild('agGrid')
  agGrid: AgGridNg2;

  @Input()
  params: Params;

  @Input()
  get monthlySummary(): Array<Record<string, any>> {
    return this._rowDefs;
  }
  set monthlySummary(summaryData: Array<Record<string, any>>) {
    if (summaryData && summaryData.length) {
      this._rowDefs = summaryData;
      this.setTotalsRow(summaryData);
    }
  }

  @Input()
  get columnDefinitions(): Array<
    Record<string, string & Array<IndicatorDefinition>>
  > {
    return this._columnDefs;
  }
  set columnDefinitions(
    columnDefs: Array<Record<string, string & Array<IndicatorDefinition>>>
  ) {
    if (columnDefs && columnDefs.length) {
      this._columnDefs = columnDefs;
      this.setColumnDefs(columnDefs);
    }
  }

  overlayNoRowsText: 'No data to show. Click `Generate Report` to load the report';
  overlayNoRowsTemplate: '<span style="padding: 10px; color: #fff; background: #5b9bd5;">${overlayNoRowsText}</span>';
  pinnedBottomRowData: Array<Record<string, any>> = [];
  gridOptions: GridOptions = {
    autoGroupColumnDef: {
      headerName: 'Location',
      pinned: true
    }
  };

  private _rowDefs: Array<Record<string, any>> = [];
  private _columnDefs: Array<
    Record<string, string & Array<IndicatorDefinition>>
  > = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  setData(rowData: Array<Record<string, any>>) {
    this.setTotalsRow(rowData);
  }

  setColumnDefs(
    columnDefs: Array<Record<string, string & Array<IndicatorDefinition>>>
  ) {
    const columnDefinitions: Array<ColGroupDef> = [];
    for (const colDef of columnDefs) {
      const section = colDef;
      const columns = {
        headerName: section.title,
        children: [
          {
            headerName: section.sectionHeader,
            children: [
              {
                headerName: section.sectionTitle,
                children: [
                  {
                    headerName: section.subsectionTitle,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      };
      for (const indicatorDef of section.indicators) {
        const { indicator, label } = indicatorDef;
        const structure = {
          headerName: label,
          field: indicator,
          columnGroupShow: indicator.match(/^total_/) ? 'closed' : 'open',
          rowGroup: indicator.match(/^location_name/) ? true : false,
          width:
            indicator.match(/^encounter_datetime/) ||
            indicator.match(/^clients_screened/)
              ? 200
              : 350,
          hide: indicator.match(/^location_name/) ? true : false,
          pinned: indicator.match(/^encounter_datetime/) ? true : false,
          cellRenderer: (column) => {
            if (typeof column.value === 'undefined') {
              return '';
            } else {
              let value;
              if (Number.isNaN(column.value)) {
                value = 0;
              }
              if (typeof column.value === 'string') {
                value = column.value;
                return value;
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
        };
        columns.children[0].children[0].children[0].children.push(structure);
      }
      columnDefinitions.push(columns);
    }
    // Remove empty column defs
    const fixedColumnDefs: Array<ColGroupDef> = [];
    if (columnDefinitions.every((columnDef) => !columnDef.headerName)) {
      columnDefinitions.forEach((columnDef: any) =>
        fixedColumnDefs.push(columnDef.children[0].children[0])
      );
    }
    this.gridOptions.groupDefaultExpanded = -1;
    this.gridOptions.columnDefs = fixedColumnDefs.length
      ? fixedColumnDefs
      : columnDefinitions;
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(
        fixedColumnDefs.length ? fixedColumnDefs : columnDefinitions
      );
    }
  }

  setTotalsRow(rowData: Array<Record<string, any>>) {
    const totals = {
      location_name: ''
    };
    const totalsRow = [];
    for (const row of rowData) {
      Object.keys(row).map((key) => {
        if (Number.isInteger(row[key])) {
          if (totals[key]) {
            totals[key] = row[key] + totals[key];
          } else {
            totals[key] = row[key];
          }
        } else {
          if (Number.isNaN(totals[key])) {
            totals[key] = 0;
          }
          if (totals[key] === null) {
            totals[key] = 0;
          }
          totals[key] = 0 + totals[key];
        }
      });
    }
    totals.location_name = 'Totals';
    totals['encounter_datetime'] = 'Totals';
    totalsRow.push(totals);
    this.pinnedBottomRowData = totalsRow;
    this.setPinnedRow();
  }

  onCellClicked(cellClickedEvent: CellClickedEvent) {
    if (cellClickedEvent.value === 0 || cellClickedEvent.value === null) {
      return;
    }
    this.navigateToPatientList(cellClickedEvent);
  }

  navigateToPatientList(cellClickedEvent: CellClickedEvent) {
    let startDate, endDate, location;
    const { period } = this.params;

    if (cellClickedEvent.data.location_name === 'Totals') {
      startDate = this.params.startDate;
      endDate = this.params.endDate;
      location = this.params.locationUuids;
    } else {
      if (period === 'daily') {
        startDate = moment(
          cellClickedEvent.data.encounter_datetime,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD');
        endDate = moment(
          cellClickedEvent.data.encounter_datetime,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD');
      } else if (period === 'monthly') {
        startDate = moment(cellClickedEvent.data.encounter_datetime, 'MM-YYYY')
          .startOf('month')
          .format('YYYY-MM-DD');
        endDate = moment(cellClickedEvent.data.encounter_datetime, 'MM-YYYY')
          .endOf('month')
          .format('YYYY-MM-DD');
      }
      location = cellClickedEvent.data.location_uuid;
    }

    const params: Params = {
      startAge: this.params.startAge,
      endAge: this.params.endAge,
      gender: this.params.gender,
      locationUuids: location,
      locationName: cellClickedEvent.data.location_name,
      type: this.params.type,
      startIndex: 0,
      limit: 1000,
      indicators: cellClickedEvent.colDef.field,
      startDate: startDate,
      endDate: endDate,
      period: period
    };

    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: params
    });
  }

  exportToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }

  private setPinnedRow() {
    if (this.gridOptions.api) {
      this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    }
    return true;
  }
}
