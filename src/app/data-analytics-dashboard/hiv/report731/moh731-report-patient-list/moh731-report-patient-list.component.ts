import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { RegistersResourceService } from 'src/app/etl-api/registers-resource.service';
import { Moh7312023ResourceService } from 'src/app/etl-api/moh-731-2023-resource.service';
import { PatientListColumns } from 'src/app/shared/data-lists/patient-list/patient-list-columns.data';
import { LocationResourceService } from 'src/app/openmrs-api/location-resource.service';
import { take } from 'rxjs/operators';
import * as Moment from 'moment';
import {
  MOH_731_INDICATOR_SECTIONS,
  MOH_731_LINELIST_COLUMNS
} from './moh-731-linelist-columns';

/** Patients per page: small, so the progress bar moves steadily. */
const PAGE_SIZE = 300;
/** Pages fetched at the same time, across all the boxes of the list. */
const CONCURRENT_PAGES = 4;
/** Pages of one box that may be in flight together. */
const PAGES_PER_BOX = 2;

interface LinelistBox {
  indicator: string;
  /** Where the next page of this box starts. */
  next: number;
  /** Set once a page comes back short: the box has no more patients. */
  done: boolean;
  /** Where the box ends, once known. Pages past it are ignored. */
  end: number;
  inFlight: number;
  /** Rows of each page, by the index it starts at. */
  pages: Map<number, Array<any>>;
}

@Component({
  selector: 'app-moh731-report-patient-list',
  templateUrl: './moh731-report-patient-list.component.html',
  styleUrls: ['./moh731-report-patient-list.component.css']
})
export class Moh731ReportPatientListComponent implements OnInit, OnDestroy {
  /** Patients per page for this list. */
  public pageSize = PAGE_SIZE;

  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public selectedIndicatorGender: string;
  public hasLoadedAll = false;
  public hasError = false;
  public errorMessage = '';
  /** The locations the figure behind this list was counted over. */
  public selectedLocationNames = '';
  /** The boxes behind the figure and how far each has been read. */
  private boxes: LinelistBox[] = [];
  /** Identifies the current load, so a superseded one stops quietly. */
  private runId = 0;
  /** The figure on the box the list was opened from, when known. */
  public expectedTotal: number = null;
  private totalBoxes = 1;
  public selectedMonth: String;
  public busyIndicator: any = {
    busy: false,
    message: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public register: RegistersResourceService,
    private moh7312023: Moh7312023ResourceService,
    private locationResourceService: LocationResourceService
  ) {}

  /** Leaving the page stops any pages still to be fetched. */
  ngOnDestroy() {
    this.runId++;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.month) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.selectedIndicatorGender = params.indicatorGender;
          this.resolveLocationNames(params.locationUuids);
          this.addExtraColumns(params.indicators);
          this.getPatientList(params, params.indicators);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  /**
   * Names the locations the list covers. The url carries only uuids, and a list
   * read on its own says nothing about which facilities it came from. Named the
   * way the report names them, which is the way they are listed in the picker.
   */
  private resolveLocationNames(locationUuids: string) {
    const uuids = String(locationUuids || '')
      .split(',')
      .filter((uuid: string) => uuid.length > 0);
    if (uuids.length === 0) {
      return;
    }

    this.locationResourceService
      .getLocations()
      .pipe(take(1))
      .subscribe(
        (locations: any[]) => {
          const names = new Map<string, string>();
          (locations || []).forEach((location: any) => {
            names.set(location.uuid, location.display || location.name);
          });
          this.selectedLocationNames = uuids
            .map((uuid: string) => names.get(uuid))
            .filter((name: string) => !!name)
            .join(', ');
        },
        () => {
          // The list is still readable without them.
        }
      );
  }

  /**
   * Loads the whole list: every page of every box behind the figure. Up to
   * CONCURRENT_PAGES pages are fetched at once - pages of different boxes, and
   * the next pages of a large box - so a big total does not wait on one query
   * at a time. Rows are kept in box and page order whatever order they arrive.
   */
  private getPatientList(params: any, indicator: string) {
    const runId = ++this.runId;
    this.boxes = this.expandTotals(indicator).map((part) => ({
      indicator: part,
      next: 0,
      done: false,
      end: null,
      inFlight: 0,
      pages: new Map<number, Array<any>>()
    }));
    this.patientData = [];
    this.hasLoadedAll = false;
    this.hasError = false;
    this.isLoading = true;
    this.expectedTotal =
      params.expected !== undefined &&
      params.expected !== '' &&
      !isNaN(+params.expected)
        ? +params.expected
        : null;
    this.pageSize = PAGE_SIZE;
    this.totalBoxes = Math.max(this.boxes.length, 1);
    this.updateProgress();

    const workers = [];
    for (let i = 0; i < CONCURRENT_PAGES; i++) {
      workers.push(this.runWorker(params, runId));
    }
    Promise.all(workers).then(() => {
      if (runId !== this.runId || this.hasError) {
        return;
      }
      this.hasLoadedAll = true;
      this.stopLoading();
    });
  }

  /** Fetches pages until no box has a page left to ask for. */
  private async runWorker(params: any, runId: number): Promise<void> {
    while (runId === this.runId && !this.hasError) {
      const box = this.boxes.find(
        (candidate) => !candidate.done && candidate.inFlight < PAGES_PER_BOX
      );
      if (!box) {
        // Nothing to start now; wait while another page of an open box may
        // still reveal more to read.
        if (this.boxes.some((candidate) => candidate.inFlight > 0)) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          continue;
        }
        return;
      }
      const start = box.next;
      box.next += this.pageSize;
      box.inFlight++;
      let data: any;
      try {
        data = await this.moh7312023
          .getPatientList(params, box.indicator, start, this.pageSize)
          .toPromise();
      } catch (err) {
        data = { error: true, message: err && err.message };
      }
      box.inFlight--;
      if (runId !== this.runId) {
        return;
      }
      if (!data || data.error) {
        this.hasError = true;
        this.errorMessage =
          'Could not load the patient list for "' +
          box.indicator +
          '"' +
          (data && data.message ? ': ' + data.message : '.');
        console.error('MOH 731 patient list failed', box.indicator, data);
        this.stopLoading();
        return;
      }
      const page = (data.results && data.results.results) || data.result || [];
      box.pages.set(start, page);
      if (page.length < this.pageSize) {
        box.done = true;
        box.end = box.end === null ? start : Math.min(box.end, start);
      }
      this.collectRows();
      this.updateProgress();
    }
  }

  /** The rows read so far, in box order and page order within each box. */
  private collectRows() {
    const rows: any[] = [];
    this.boxes.forEach((box) => {
      Array.from(box.pages.keys())
        .sort((a, b) => a - b)
        .filter((start) => box.end === null || start <= box.end)
        .forEach((start) => rows.push(...box.pages.get(start)));
    });
    this.patientData = rows;
  }

  private updateProgress() {
    const loaded = this.patientData ? this.patientData.length : 0;
    const boxesDone = this.boxes.filter((box) => box.done && box.inFlight === 0)
      .length;
    this.busyIndicator = {
      busy: true,
      message:
        loaded.toLocaleString() +
        (this.expectedTotal
          ? ' of ' + this.expectedTotal.toLocaleString()
          : '') +
        ' patients loaded' +
        (this.totalBoxes > 1
          ? ' · ' + boxesDone + ' of ' + this.totalBoxes + ' boxes complete'
          : '')
    };
  }

  /** How far the list has got, for the loading message and bar. */
  public get loadedPercent(): number {
    if (!this.expectedTotal) {
      return null;
    }
    const loaded = this.patientData ? this.patientData.length : 0;
    return Math.min(100, Math.round((loaded / this.expectedTotal) * 100));
  }

  /**
   * The indicators to list. A total names its boxes; the older total names
   * (on_art, started_art) stand for the 3.1 / 3.2 age and sex boxes.
   */
  private expandTotals(indicator: string): string[] {
    const bands = (prefix: string) =>
      Object.keys(MOH_731_INDICATOR_SECTIONS).filter((field) =>
        new RegExp(
          '^' +
            prefix +
            '_(less_1|1_4|5_9|10_14|15_19|20_24|25_above)_(male|female)$'
        ).test(field)
      );
    const legacy: { [total: string]: string[] } = {
      on_art: bands('on_art'),
      started_art: bands('art_new')
    };
    return String(indicator || '')
      .split(',')
      .map((part) => part.trim())
      .filter((part) => !!part)
      .reduce((all, part) => all.concat(legacy[part] || [part]), []);
  }

  /** Loading stays on until the last box of a total has been read. */
  private stopLoading() {
    this.isLoading = false;
    this.busyIndicator = { busy: false, message: '' };
  }

  /**
   * The details shown for a figure are those the O3 report shows for it: the
   * columns of its linelist section (test date and result for HIV tests,
   * regimen for PrEP, ART status for treatment, and so on). The grid's own
   * columns that the figure's data does not carry are hidden rather than left
   * blank.
   */
  public addExtraColumns(indicator: string) {
    const section = MOH_731_INDICATOR_SECTIONS[this.expandTotals(indicator)[0]];
    const columns = MOH_731_LINELIST_COLUMNS[section] || [];
    const formatDate = (cell: any) =>
      cell && cell.value ? Moment(cell.value).format('DD-MM-YYYY') : '';

    const alreadyShown = new Set(
      PatientListColumns.columns()
        .map((column: any) => column.field)
        .filter((field: any) => !!field)
    );
    this.extraColumns = columns
      .filter((column) => !alreadyShown.has(column.field))
      .map((column) =>
        Object.assign(
          { headerName: column.headerName, field: column.field },
          column.date ? { valueFormatter: formatDate } : {}
        )
      );

    const shownFields = new Set(columns.map((column) => column.field));
    const hasOwnAge = columns.some(
      (column) => column.field.indexOf('age_') === 0
    );
    const notCarried = [
      'vl_category',
      'last_appointment',
      'patient_category',
      'visit_type',
      'latest_rtc_date',
      'med_pick_up_date',
      'ovcid_id',
      'cur_meds',
      'previous_vl',
      'previous_vl_date',
      'nearest_center'
    ];
    if (!shownFields.has('phone_number')) {
      notCarried.push('phone_number');
    }
    if (hasOwnAge) {
      notCarried.push('age');
    }
    this.overrideColumns = notCarried
      .map((field) => ({ field, hide: true }))
      .concat([
        {
          field: 'identifiers',
          cellRenderer: (column) =>
            '<a href="javascript:void(0);" title="Identifiers">' +
            column.value +
            '</a>'
        } as any
      ]);
  }

  public goBack() {
    this._location.back();
  }
}
