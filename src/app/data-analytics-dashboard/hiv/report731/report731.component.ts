import * as Moment from 'moment';
import * as _ from 'lodash';
import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistersResourceService } from 'src/app/etl-api/registers-resource.service';
import { Moh7312023ResourceService } from 'src/app/etl-api/moh-731-2023-resource.service';
import { LocationResourceService } from 'src/app/openmrs-api/location-resource.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

import {
  Moh731Block,
  Moh731Cell,
  Moh731Row,
  MOH_731_SECTIONS,
  buildMoh731SectionDefs
} from './moh-731-form-definition';

@Component({
  selector: 'app-report731',
  templateUrl: './report731.component.html',
  styleUrls: ['./report731.component.css']
})
export class Report731Component implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public MOH731RegisterData: any = {};
  public columnDefs: any = [];
  public reportName = 'MOH 731 REPORT';
  public currentView = 'report';
  public month: string;
  public year: number;
  public quarter: string;
  public eDate: string;
  public sDate: string;
  public jointLocationUuids = [];

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;
  public enabledControls = 'monthControl, locationControl';
  public pinnedBottomRowData: any = [];
  public _month: string;
  public showLocationsControl = true;
  public showIsAggregateControl = true;
  public isAggregated = false;
  public isReleased = false;
  public generated = false;
  /**
   * Sign-off, as on the O3 report: who produced the return and when.
   * Designation and signature stay blank for filling in by hand.
   */
  public reviewedByName = '';
  public reviewedOn = '';

  /** Layout of the paper form, shared by the report view and the tabular view. */
  public sections = MOH_731_SECTIONS;
  /** Column groups of the tabular view. */
  public sectionDefs: Array<any> = buildMoh731SectionDefs();
  /** One row per location returned by the ETL, or one aggregated row. */
  public rowData: Array<any> = [];
  /** One rendering of the paper form per row of `rowData`. */
  public formSheets: Array<any> = [];
  public selectedLocationNames = '';
  /**
   * Sections of the form to ask the server for. It computes them concurrently,
   * so this is the set the sheet can currently fill rather than a page size.
   */
  public sectionsToLoad: string[] = ['3'];
  /** Sections the server reported it could not compute. */
  public sectionErrors: string[] = [];
  /**
   * The filter values the figures on screen were generated from. Kept so the
   * sheet can say when the filters above it have moved on from what it shows.
   */
  public generatedWith: any = null;
  /** Filters of a run that is still in flight. */
  private pendingFilters: any = null;
  /**
   * Set when locations are selected that cannot be put a name to. The sheet
   * names the facility it reports on, so it is withheld rather than printed
   * against a placeholder that reads as if it were the facility.
   */
  public locationsUnresolved = false;
  /** True while the pdf is being drawn, which takes a moment per sheet. */
  public isExporting = false;
  /**
   * The facility several aggregated locations belong to. Null when they do not
   * share one, in which case the sheet falls back to naming them.
   */
  public aggregateLocationName: string = null;
  /** What each location is called, by uuid, for the sheet's Facility line. */
  private locationFullNames = new Map<string, string>();

  @ViewChild('reportContent') public contentToSnapshot!: ElementRef;

  public _locationUuids: any = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }

  private _startDate: Date = Moment()
    .subtract(1, 'months')
    .startOf('month')
    .toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = Moment()
    .subtract(1, 'months')
    .endOf('month')
    .toDate();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
  }

  /** Locations selected on the dashboard, kept in sync with the filter. */
  private dashboardLocations: Array<any> = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public register: RegistersResourceService,
    private moh7312023: Moh7312023ResourceService,
    private locationResourceService: LocationResourceService,
    private datePipe: DatePipe,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private userService: UserService
  ) {
    this.reviewedByName = this.loggedInUserName();
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment().subtract(1, 'month').format('YYYY-MM-DD'))
        : (this._month = data.month);

      this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .subscribe((data) => {
        this.dashboardLocations = (data && data.locations) || [];
      });
    this.restoreFromUrl();
  }

  /**
   * Drilling into a patient list and coming back rebuilds this component, which
   * would otherwise return to an empty form and default filters. The report the
   * user was reading is described by the query params, so it is restored and
   * regenerated rather than asking them to fill the filters in again.
   */
  private restoreFromUrl() {
    const params = this.route.snapshot.queryParams;
    if (!params || !params.startDate || !params.endDate) {
      return;
    }

    this._startDate = Moment(params.startDate).toDate();
    this._endDate = Moment(params.endDate).toDate();
    this.isAggregated =
      params.isAggregated === true || params.isAggregated === 'true';

    const uuids = String(params.locationUuids || '')
      .split(',')
      .filter((uuid: string) => uuid.length > 0);

    if (uuids.length === 0) {
      this.generateReport();
      return;
    }

    // Named before the report is asked for, not alongside it: the sheet heads
    // every page with the facility it covers, so the names are part of the
    // report rather than decoration on the filter.
    this.jointLocationUuids = uuids.map((uuid: string) => ({ value: uuid }));
    this.resolveLocationNames(uuids);
  }

  /**
   * The url carries uuids, but the sheet names the facility it reports on, and
   * the filter names what it is holding. The picker only resolves a name for
   * itself when handed a single uuid, so a restored selection is named here
   * rather than showing as an unlabelled count. A uuid that cannot be named
   * stops the report instead of heading it with something that is not a
   * facility name.
   */
  private resolveLocationNames(uuids: string[]) {
    this.isLoading = true;
    this.locationResourceService
      .getLocations()
      .pipe(take(1))
      .subscribe(
        (locations: any[]) => {
          const names = new Map<string, string>();
          (locations || []).forEach((location: any) => {
            names.set(location.uuid, this.fullNameOf(location));
          });

          const unnamed = uuids.filter((uuid) => !names.get(uuid));
          this.jointLocationUuids = uuids
            .filter((uuid) => !!names.get(uuid))
            .map((uuid: string) => ({ value: uuid, label: names.get(uuid) }));
          this.indexLocationNames(locations || []);
          this.selectedLocationNames = this.getSelectedLocationNames();

          if (unnamed.length > 0) {
            this.locationsUnresolved = true;
            this.isLoading = false;
            return;
          }
          this.locationsUnresolved = false;
          this.generateReport();
        },
        () => {
          this.locationsUnresolved = true;
          this.isLoading = false;
        }
      );
  }

  /** The filters as they stand now, in the shape the report is generated from. */
  private currentFilters(): any {
    return {
      locationUuids: this.getSelectedLocations(),
      isAggregated: !!this.isAggregated,
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
  }

  /**
   * True once the filters have been changed away from the ones behind the
   * figures on screen, so the sheet is not read as showing the current
   * selection when it does not.
   */
  public get filtersChanged(): boolean {
    const used = this.generatedWith;
    if (!this.generated || !used) {
      return false;
    }
    const now = this.currentFilters();
    return (
      used.locationUuids !== now.locationUuids ||
      used.isAggregated !== now.isAggregated ||
      used.startDate !== now.startDate ||
      used.endDate !== now.endDate
    );
  }

  /** The period the figures on screen cover, for the stale-filter notice. */
  public get generatedPeriod(): string {
    const used = this.generatedWith;
    if (!used) {
      return '';
    }
    return (
      Moment(used.startDate).format('DD MMM YYYY') +
      ' to ' +
      Moment(used.endDate).format('DD MMM YYYY')
    );
  }

  public onMonthChange(value): any {
    this._month = Moment(value).format('YYYY-MM-DD');
  }

  public onTabChanged(event: any) {
    this.currentView = event && event.index === 1 ? 'tabular' : 'report';
  }

  public generateReport(): any {
    // The sheet is headed by the facility it covers, so it is not produced for
    // a selection whose facilities cannot be named.
    if (!this.locationNamesKnown()) {
      this.locationsUnresolved = true;
      this.generated = false;
      this.isLoading = false;
      return;
    }
    this.locationsUnresolved = false;

    const uuids = this.getSelectedLocations()
      .split(',')
      .filter((uuid: string) => uuid.length > 0);

    // The sheet heads every page with the facility's full name, and several
    // locations reported as one are headed by the facility they belong to, so
    // the names are settled before the figures are asked for.
    this.isLoading = true;
    this.locationResourceService
      .getLocations()
      .pipe(take(1))
      .subscribe(
        (locations: any[]) => {
          this.indexLocationNames(locations || []);
          this.aggregateLocationName =
            this.isAggregated && uuids.length > 1
              ? this.commonParentName(locations || [], uuids)
              : null;
          this.runReport();
        },
        () => {
          this.aggregateLocationName = null;
          this.runReport();
        }
      );
  }

  /**
   * What a location is called on the form: the name it is listed and picked by.
   * The description is deliberately not used - it holds a full name for some
   * locations but free text for others ("An mch facility"), so reading it puts
   * prose in the field that names the facility.
   */
  private fullNameOf(location: any): string {
    if (!location) {
      return null;
    }
    return location.display || location.name || null;
  }

  /** Remembers what every location is called, by uuid. */
  private indexLocationNames(locations: any[]) {
    this.locationFullNames.clear();
    (locations || []).forEach((location: any) => {
      this.locationFullNames.set(location.uuid, this.fullNameOf(location));
    });
  }

  /**
   * The facility the given locations all belong to, or null when they do not
   * share one. Sites reported together are normally the sites of a facility,
   * and the form asks for the facility rather than for its sites.
   */
  private commonParentName(locations: any[], uuids: string[]): string {
    const byUuid = new Map<string, any>();
    locations.forEach((location: any) => byUuid.set(location.uuid, location));

    let parent: any = null;
    for (const uuid of uuids) {
      const location = byUuid.get(uuid);
      const itsParent = location && location.parentLocation;
      if (!itsParent || !itsParent.uuid) {
        return null;
      }
      if (!parent) {
        parent = itsParent;
      } else if (parent.uuid !== itsParent.uuid) {
        return null;
      }
    }
    if (!parent) {
      return null;
    }
    // The parent arrives as a reference, which carries no description; its own
    // record in the same list does.
    return this.locationFullNames.get(parent.uuid) || this.fullNameOf(parent);
  }

  private runReport(): any {
    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl();
    });
    this.MOH731RegisterData = {};
    this.rowData = [];
    this.formSheets = [];
    this.pinnedBottomRowData = [];
    // Held rather than published: the filters only describe what is on screen
    // once the figures they asked for have actually arrived.
    this.pendingFilters = this.currentFilters();
    this.getMOH731Register(this.params);
    this.generated = true;
  }

  public storeParamsInUrl() {
    this.selectedLocationNames = this.getSelectedLocationNames();
    this._month = Moment(this.startDate).format('YYYY-MM-DD');
    this.showDraftReportAlert(this._month);
    this.params = {
      locationUuids: this.getSelectedLocations(),
      isAggregated: this.isAggregated,
      month: this._month,
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getMOH731Register(params: any) {
    this.isLoading = true;
    this.moh7312023.getReport(params, this.sectionsToLoad).subscribe(
      (data) => {
        if (data.error) {
          this.showInfoMessage = true;
          this.errorMessage = `There has been an error while loading the report, please retry again`;
          this.isLoading = false;
          return;
        }

        this.showInfoMessage = false;
        this.sectionErrors = this.collectSectionErrors(data);
        this.rowData = this.buildRowData(this.mergeSections(data));
        this.formSheets = this.buildFormSheets(this.rowData);
        this.MOH731RegisterData = this.formSheets.length
          ? this.formSheets[0].data
          : {};
        this.calculateTotalSummary();
        this.isLoading = false;
        this.isReleased = data.isReleased === true;
        this.generatedWith = this.pendingFilters;
        this.reviewedOn = Moment().format('DD-MM-YYYY');
      },
      () => {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      }
    );
  }

  /**
   * The report is computed a section at a time, each returning its own rows per
   * location. One sheet needs them side by side, so the sections are folded
   * together on the location they share.
   */
  private mergeSections(data: any): Array<any> {
    const sections = (data && data.sections) || {};
    const byLocation = new Map<any, any>();
    const order: any[] = [];

    Object.keys(sections).forEach((section) => {
      const rows = (sections[section] && sections[section].result) || [];
      rows.forEach((row: any) => {
        // Aggregated runs collapse to a single row with no location of its own.
        const key = row.location_id != null ? row.location_id : row.location;
        if (!byLocation.has(key)) {
          byLocation.set(key, {});
          order.push(key);
        }
        Object.assign(byLocation.get(key), row);
      });
    });

    return order.map((key) => byLocation.get(key));
  }

  /** Sections the server could not compute, so the sheet can say so. */
  private collectSectionErrors(data: any): string[] {
    const sections = (data && data.sections) || {};
    return Object.keys(sections).filter((s) => !!sections[s].error);
  }

  /**
   * The ETL returns either a row per location or a set of partial rows that
   * together make up a single aggregate. Anything without its own location is
   * merged into the one row the form view displays.
   */
  private buildRowData(result: Array<any>): Array<any> {
    const perLocation = (result || []).filter(
      (row: any) => row && (row.location || row.location_uuid)
    );

    if (perLocation.length > 0) {
      return this.isAggregated
        ? [this.aggregateRows(perLocation)]
        : perLocation;
    }

    if (!result || result.length === 0) {
      return [];
    }

    // Named from the selection rather than a placeholder: generation is barred
    // unless every selected location has a name, so this reads true.
    return [
      Object.assign({}, ...result, {
        location: this.aggregatedLocationLabel()
      })
    ];
  }

  /**
   * What the sheet calls a row that stands for more than one location: the
   * facility they belong to where they share one, and the locations themselves
   * where they do not, so the heading is never less specific than the truth.
   */
  private aggregatedLocationLabel(): string {
    return this.aggregateLocationName || this.selectedLocationNames;
  }

  /** Sums every numeric indicator of the given rows into a single row. */
  private aggregateRows(rows: Array<any>): any {
    const aggregate: any = {
      location: this.aggregatedLocationLabel()
    };

    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const value = this.toNumber(row[key]);
        if (value !== null) {
          aggregate[key] = (aggregate[key] || 0) + value;
        }
      });
    });

    return aggregate;
  }

  /** Indicator values the ETL may ship as numbers or as numeric strings. */
  private toNumber(value: any): number | null {
    if (typeof value === 'number') {
      return isNaN(value) ? null : value;
    }
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(+value)) {
      return +value;
    }
    return null;
  }

  /**
   * One sheet of the paper form per row: a single combined sheet when the
   * locations are aggregated, otherwise one sheet per location.
   */
  private buildFormSheets(rows: Array<any>): Array<any> {
    return (rows || []).map((row: any) => ({
      locationName: this.facilityName(row),
      locationUuid: row.location_uuid || null,
      data: row
    }));
  }

  /**
   * What the sheet heads a page with. The report carries the location's stored
   * name, which is often an abbreviation; the picker holds the full name the
   * user chose it by, so that is preferred and the stored one is the fallback.
   */
  private facilityName(row: any): string {
    // A row standing for several facilities is already named for the one they
    // belong to. It carries a location uuid inherited from the rows it was
    // built from, so looking that up would name it after just one of them.
    if (!this.isAggregated && row.location_uuid) {
      const full = this.locationFullNames.get(row.location_uuid);
      if (full) {
        return full;
      }
    }
    return row.location || this.selectedLocationNames;
  }

  public calculateTotalSummary() {
    if (this.rowData.length < 2) {
      this.pinnedBottomRowData = [];
      return;
    }

    const totalObj: any = { location: 'Totals' };
    _.each(this.rowData, (row) => {
      Object.keys(row).forEach((key) => {
        const value = this.toNumber(row[key]);
        if (value !== null) {
          totalObj[key] = (totalObj[key] || 0) + value;
        }
      });
    });

    this.pinnedBottomRowData = [totalObj];
  }

  /** Width the printed form gives a column, as a percentage of the sheet. */
  public columnWidth(section: any, columnIndex: number): number {
    if (section.columnWidths && section.columnWidths[columnIndex]) {
      return section.columnWidths[columnIndex];
    }
    return 100 / section.columns.length;
  }

  public cellValue(sheet: any, cell: Moh731Cell): any {
    if (!cell || !cell.field || !sheet || !sheet.data) {
      return '';
    }
    const value = sheet.data[cell.field];
    return value === null || value === undefined ? '' : value;
  }

  public onCellSelected(
    sheet: any,
    block: Moh731Block,
    row: Moh731Row,
    cell: Moh731Cell
  ) {
    if (!cell || !cell.field) {
      return;
    }
    const title = block.indicatorGroup || block.title || row.label;
    this.onIndicatorSelected(
      title,
      cell.field,
      cell.gender || '',
      sheet ? sheet.locationUuid : null,
      sheet && sheet.data ? sheet.data[cell.field] : null
    );
  }

  public onGridIndicatorSelected(selected: any) {
    if (!selected || !selected.indicator) {
      return;
    }
    this.onIndicatorSelected(
      selected.title,
      selected.indicator,
      selected.gender || '',
      selected.location,
      selected.value
    );
  }

  public onIndicatorSelected(
    title: string,
    indicator: string,
    gender: string,
    locationUuid?: string,
    figure?: any
  ) {
    // An indicator read off one location's sheet drills into that location
    // only. Aggregated numbers cover every location that was selected.
    const locationUuids =
      !this.isAggregated && locationUuid
        ? locationUuid
        : this.getSelectedLocations();

    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        // The O3 linelist endpoint filters on the same indicator the box shows,
        // so the list is exactly the patients behind that figure.
        indicators: indicator,
        indicatorHeader: title,
        month: this._month,
        locationUuids: locationUuids,
        indicatorGender: gender,
        // The figure on the box, so the list can show how much of it has loaded.
        expected:
          figure !== null && figure !== undefined && !isNaN(+figure)
            ? +figure
            : undefined,
        // Formatted rather than handed over as Date objects: the url would
        // otherwise carry a js date string the server cannot parse, and the
        // period would reach the query as text that matches nothing.
        startDate: Moment(this.startDate).format('YYYY-MM-DD'),
        endDate: Moment(this.endDate).format('YYYY-MM-DD')
      }
    });
  }

  public showDraftReportAlert(date) {
    if (date != null && date >= Moment().format('YYYY-MM-DD')) {
      this.isReleased = false;
    } else {
      this.isReleased = true;
    }
  }

  transformDate(date: string): string | null {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  /**
   * Writes the sheets to a pdf, a page per sheet.
   *
   * The form is a portrait page taller than it is wide, so it is drawn onto a
   * portrait one and scaled to fit within both sides of it. Scaling to the
   * width alone, as this did, leaves the foot of a sheet past the bottom of the
   * page and it is simply not drawn.
   */
  public async takeSnapshotAndExport() {
    if (this.isExporting) {
      return;
    }
    const sheets: HTMLElement[] = Array.prototype.slice.call(
      this.contentToSnapshot.nativeElement.querySelectorAll('.moh-page')
    );
    if (sheets.length === 0) {
      return;
    }

    this.isExporting = true;
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      for (let i = 0; i < sheets.length; i++) {
        const sheet = sheets[i];
        const width = Math.max(sheet.scrollWidth, sheet.offsetWidth);
        const canvas = await html2canvas(sheet, {
          backgroundColor: '#ffffff',
          // Drawn at twice the size so the form's rules and small print stay
          // legible once it is scaled down onto the page.
          scale: 2,
          width: width,
          windowWidth: width,
          scrollX: 0,
          scrollY: 0
        });

        // Whichever side runs out first decides the scale, so the whole sheet
        // lands on the page rather than being cropped at the foot.
        const scale = Math.min(
          maxWidth / canvas.width,
          maxHeight / canvas.height
        );
        const drawnWidth = canvas.width * scale;
        const drawnHeight = canvas.height * scale;

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          (pageWidth - drawnWidth) / 2,
          margin,
          drawnWidth,
          drawnHeight
        );
      }

      pdf.save('MOH 731 Register.pdf');
    } finally {
      this.isExporting = false;
    }
  }

  /** Locations picked in the filter, falling back to the dashboard selection. */
  private getSelectedLocationObjects(): Array<any> {
    const selected =
      this.jointLocationUuids && this.jointLocationUuids.length > 0
        ? this.jointLocationUuids
        : this.dashboardLocations;
    return selected || [];
  }

  private getSelectedLocations(): string {
    const uuids = this.getSelectedLocationObjects()
      .map((location: any) => (location && location.value) || location)
      .filter((uuid: any) => typeof uuid === 'string' && uuid.length > 0);
    return _.uniq(uuids).join(',');
  }

  /**
   * True when every selected location carries a name. A selection held as bare
   * uuids names nothing the sheet can print, and there has to be a selection:
   * the form reports on facilities, not on everything.
   */
  private locationNamesKnown(): boolean {
    const selected = this.getSelectedLocationObjects();
    if (selected.length === 0) {
      return false;
    }
    return selected.every(
      (location: any) =>
        location &&
        typeof location.label === 'string' &&
        location.label.trim().length > 0
    );
  }

  private getSelectedLocationNames(): string {
    const names = this.getSelectedLocationObjects()
      .map((location: any) => location && location.label)
      .filter((label: any) => typeof label === 'string' && label.length > 0);
    return _.uniq(names).join(', ');
  }

  private loggedInUserName(): string {
    try {
      const user: any = this.userService.getLoggedInUser();
      const person = user && user.person;
      return (
        (person &&
          (person.display ||
            (person.preferredName && person.preferredName.display))) ||
        (user && user._openmrsModel && user._openmrsModel.display) ||
        ''
      );
    } catch (e) {
      return '';
    }
  }
}
