import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GridOptions } from 'ag-grid';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';

import { DprReportService } from 'src/app/etl-api/dpr-report.service';

@Component({
  selector: 'app-dpr-report-patientlist',
  templateUrl: './dpr-report-patientlist.component.html',
  styleUrls: ['./dpr-report-patientlist.component.css']
})
export class DprReportPatientlistComponent implements OnInit, OnDestroy {
  public isLoading = false;
  /** Estimated progress while the list is built (see startProgress). */
  public loadingProgress = 0;
  public loadingSeconds = 0;
  public loadingStatus = '';
  private progressTimer: any = null;
  public hasError = false;
  public errorMessage = '';
  /** QA columns are always shown; there is no toggle on the page. */
  public showQaColumns = true;

  public rowData: Array<any> = [];
  public columnDefs: Array<any> = [];
  public reportParams: any;
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    rowHeight: 28,
    onGridReady: () => this.applyQaColumnVisibility()
  } as GridOptions;

  private schema: any;
  private requestSub: Subscription;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dprReportService: DprReportService
  ) {}

  public ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe((params) => {
      if (params && params.startDate && params.endDate) {
        this.getPatientList({
          locationUuids: params.locationUuids,
          startDate: params.startDate,
          endDate: params.endDate
        });
      }
    });
  }

  public ngOnDestroy() {
    this.stopProgress();
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  public exportToCsv() {
    if (this.gridOptions.api) {
      const suffix = this.reportParams
        ? `${this.reportParams.m12Start}_${this.reportParams.m12End}`
        : Moment().format('YYYY-MM-DD');
      this.gridOptions.api.exportDataAsCsv({
        fileName: `dpr-report_${suffix}.csv`
      });
    }
  }

  public goBack() {
    this.location.back();
  }

  public get cohortNote(): string {
    if (!this.reportParams) {
      return '';
    }
    const p = this.reportParams;
    return (
      `12-month cohort: ART start ${p.m12Start} to ${p.m12End}; ` +
      `24-month cohort: ART start ${p.m24Start} to ${p.m24End}` +
      (p.studySitesOnly ? ' (DPR study sites only)' : '')
    );
  }

  private getPatientList(params: any) {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
    this.isLoading = true;
    this.hasError = false;
    this.rowData = [];
    this.startProgress();

    this.requestSub = this.dprReportService
      .getDprReport(params)
      .subscribe((data: any) => {
        this.isLoading = false;
        this.stopProgress();
        if (!data || data.error) {
          this.hasError = true;
          this.errorMessage =
            (data && data.message) ||
            'There has been an error while loading the report, please retry again';
          return;
        }
        this.reportParams = data.params;
        if (data.sectionDefinitions) {
          this.schema = data.sectionDefinitions;
          this.columnDefs = this.buildColumnDefs(this.schema);
        }
        this.rowData = data.result || [];
        this.applyQaColumnVisibility();
      });
  }

  /**
   * The line list is built on the server in a single request, so its real
   * progress cannot be seen from here. The bar is an estimate from the time
   * taken so far: it eases towards 95% and the overlay closes when the list
   * arrives.
   */
  private startProgress() {
    this.stopProgress();
    const started = Date.now();
    const tick = () => {
      const seconds = (Date.now() - started) / 1000;
      this.loadingSeconds = Math.floor(seconds);
      this.loadingProgress = 95 * (1 - Math.exp(-seconds / 20));
      this.loadingStatus =
        'Building the DPR line list... ' + this.loadingSeconds + 's elapsed';
    };
    tick();
    this.progressTimer = setInterval(tick, 500);
  }

  private stopProgress() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private buildColumnDefs(schema: any): Array<any> {
    const pinnedFields = ['collection_date', 'roc_id'];
    const leadingFields = ['patient_identifiers'];
    const toColDef = (col: any, section: any) => ({
      headerName: col.headerName,
      headerTooltip: col.field,
      field: col.field,
      colId: col.field,
      width: 160,
      hide: !!section.qa && !this.showQaColumns
    });

    const pinnedDefs: Array<any> = [];
    const leadingDefs: Array<any> = [];
    const groupDefs: Array<any> = [];
    (schema.sections || []).forEach((section: any) => {
      const children: Array<any> = [];
      section.columns.forEach((col: any) => {
        if (pinnedFields.indexOf(col.field) > -1) {
          pinnedDefs.push(
            Object.assign(toColDef(col, section), { pinned: 'left' })
          );
        } else if (leadingFields.indexOf(col.field) > -1) {
          leadingDefs.push(toColDef(col, section));
        } else {
          children.push(toColDef(col, section));
        }
      });
      if (children.length > 0) {
        groupDefs.push({
          headerName: section.sectionTitle,
          groupId: section.sectionKey,
          children
        });
      }
    });
    return pinnedDefs.concat(leadingDefs, groupDefs);
  }

  private applyQaColumnVisibility() {
    if (!this.gridOptions.columnApi || !this.schema) {
      return;
    }
    const qaCols: string[] = [];
    (this.schema.sections || [])
      .filter((s: any) => s.qa)
      .forEach((s: any) => s.columns.forEach((c: any) => qaCols.push(c.field)));
    this.gridOptions.columnApi.setColumnsVisible(
      qaCols,
      this.showQaColumns,
      'api'
    );
  }
}
