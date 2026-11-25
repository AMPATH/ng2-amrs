import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { ToastrFunctionService } from 'src/app/shared/services/toastr-function.service';
import * as _ from 'lodash';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event
} from '@angular/router';
import { Subscription, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Group } from '../../models/group.model';
import { GridOptions, RowNode } from 'ag-grid';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { CohortOtzModuleResourceService } from 'src/app/etl-api/cohort-otz-module-resource.service';
import { GroupSearchInputComponent } from './group-search-input/group-search-input.component';
/** Program of the DC groups (Differentiated Service Delivery). */
const DC_PROGRAM_UUID = '334c9e98-173f-4454-a8ce-f80b20b7fdf0';
/** Program of the OTZ clubs. */
const OTZ_PROGRAM_UUID = '203571d6-a4f2-4953-9e8b-e1105e2340f5';
/**
 * Whether the quick group request (one program, list fields only) gives
 * results here. Once it finds nothing, the full request is used for the rest
 * of the session.
 */
let quickGroupQueryWorks = true;

/** "14 Oct 2026" for a date, '' for none. */
function shortDate(value: any): string {
  if (!value) {
    return '';
  }
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
}

/**
 * Widths that keep each column readable. The name stays pinned on the left
 * and the table scrolls sideways instead of squeezing columns.
 */
const COLUMN_LAYOUT: { [header: string]: any } = {
  'Group Number': { width: 150, minWidth: 140, suppressSizeToFit: true },
  'Group Name': {
    pinned: 'left',
    width: 230,
    minWidth: 180,
    suppressSizeToFit: true,
    tooltipField: 'display',
    cellClass: 'gm-cell-name'
  },
  Program: { width: 110, minWidth: 95 },
  Facility: { width: 170, minWidth: 140, tooltipField: 'facility' },
  Landmark: { width: 210, minWidth: 150, tooltipField: 'landmark' },
  Status: { width: 125, minWidth: 115 },
  'Group Count': { width: 120, minWidth: 105, cellClass: 'gm-cell-center' },
  'Viral Suppression': {
    width: 150,
    minWidth: 130,
    cellClass: 'gm-cell-center'
  },
  'Last Meeting Date': {
    width: 150,
    minWidth: 130,
    valueFormatter: (params: any) => shortDate(params.value),
    getQuickFilterText: (params: any) => shortDate(params.value)
  },
  'OTZ Champion': { width: 200, minWidth: 160, tooltipField: 'otzChampion' },
  'Group Activity': {
    width: 180,
    minWidth: 150,
    tooltipField: 'groupActivity'
  },
  // Always in view, so it is clear what can be done with each group.
  Actions: {
    pinned: 'right',
    width: 175,
    minWidth: 165,
    suppressSizeToFit: true,
    cellClass: 'gm-cell-action'
  }
};

/** DC, OTZ or the program's own name. */
function programShortName(program: string): string {
  const name = String(program || '').toUpperCase();
  return name.indexOf('OTZ') !== -1
    ? 'OTZ'
    : name.indexOf('DIFFERENTIATED SERVICE DELIVERY') !== -1
    ? 'DC'
    : program || '';
}

/** Program as a short DC / OTZ badge; the full name shows on hover. */
function programBadge(program: string): string {
  if (!program) {
    return '<span class="gr-empty">—</span>';
  }
  const label = _.escape(programShortName(program));
  const otz = label === 'OTZ' ? ' gr-program-otz' : '';
  return `<span class="gr-program${otz}" title="${_.escape(
    program
  )}">${label}</span>`;
}

/** Status with a coloured dot: active green, inactive amber, disbanded red. */
function statusPill(status: string): string {
  const key = String(status || '').toLowerCase();
  return `<span class="gr-status gr-status-${_.escape(
    key
  )}"><i class="fa fa-circle"></i> ${_.escape(status || '')}</span>`;
}

@Component({
  selector: 'group-manager-search',
  templateUrl: './group-manager-search.component.html',
  styleUrls: ['./group-manager-search.component.css']
})
export class GroupManagerSearchComponent implements OnInit, OnDestroy {
  public currentUserFacility: any;
  public groupsInCurrentFacility: any;
  public searchString = '';
  public lastSearchString = '';
  public isLoading = false;
  public searchResults: Group[];
  public noMatchingResults = false;
  public hideResults: boolean;
  public totalGroups: number;
  public errorMessage: String;
  public showGroupDialog = false;
  public subscription: Subscription = new Subscription();
  public modalRef: BsModalRef;
  public searchByLandmark = false;
  public routeLoading = false;
  fetchingGroups: boolean;
  previousLocationUuid: string;
  rowData: any;
  columnDefs = this.generateColumns();
  public gridOptions: GridOptions = this.getGridOptions();
  /** The DC or OTZ program filter; set by the view, not typed by users. */
  public filterText = '';
  /** What the user typed in "Search this list". */
  public tableSearch = '';
  /** Groups in the open DC/OTZ list before any search. */
  public listTotal = 0;
  hideGroupsInCurrentFacility: boolean;
  public isOTZprogram = false;
  public filterOTZ = '';
  cohortUuids = new Map();
  @ViewChild(GroupSearchInputComponent)
  private searchInput: GroupSearchInputComponent;
  /** Groups the grid shows after its filter, for the count in the header. */
  public visibleCount = 0;
  /** The table is wider than its box: some columns are off to the side. */
  public canScrollSideways = false;
  /** Scrolled all the way to the last column. */
  public atScrollEnd = false;
  /** The same groups, in grid order, for the card list on phones. */
  public visibleRows: Array<{ data: any; node: RowNode }> = [];
  /** Message shown while the groups load. */
  public loadingLabel = '';
  /** Shown when the groups could not be loaded. */
  public loadError: string = null;
  /** Identifies the latest load, so an earlier one cannot overwrite it. */
  private loadRun = 0;
  private groupsByLocation = new Map<string, Observable<any[]>>();
  private suppressionByLocation = new Map<
    string,
    Observable<Map<string, any>>
  >();

  constructor(
    private groupService: CommunityGroupService,
    private router: Router,
    private bsModalService: BsModalService,
    private route: ActivatedRoute,
    private programResourceService: ProgramResourceService,
    private toastrService: ToastrFunctionService,
    private cohortOtzModuleResourceService: CohortOtzModuleResourceService,
    private host: ElementRef
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.routeLoading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          this.routeLoading = false;
          break;
        default:
          break;
      }
    });
    this.subscription.add(
      this.groupService.getPreviousSearchResults().subscribe((results) => {
        this.searchResults = results;
      })
    );
  }

  public onGroupSelected(groupUuid: string) {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.router.navigate(['../group', groupUuid], { relativeTo: this.route });
  }
  public showModal(modal: TemplateRef<any>) {
    this.modalRef = this.bsModalService.show(modal);
  }

  /** DC groups: the facility's groups, filtered to the DSD program. */
  public showGroupsInFacilty() {
    this.isOTZprogram = false;
    this.loadFacilityGroups(this.router.url.split('/')[2], false);
  }

  /** Kept for callers of the old name; loads the DC view. */
  public showDcGroupsInFacility(locationUuid) {
    this.isOTZprogram = false;
    this.loadFacilityGroups(locationUuid, false);
  }

  /** OTZ clubs: the facility's groups with each club's suppression rate. */
  public showOTZGroupsInFacilty() {
    this.isOTZprogram = true;
    this.loadFacilityGroups(this.router.url.split('/')[2], true);
  }

  /**
   * Shows the facility's groups for the DC or the OTZ view. Each view fetches
   * only its own program's groups, once per location, so returning to a view
   * is instant; for OTZ the suppression rates are fetched alongside, and the
   * clubs are shown only once both have arrived.
   */
  /** Stops a DC/OTZ load in progress and clears its loading panel. */
  private stopFacilityLoad() {
    this.loadRun++;
    this.fetchingGroups = false;
    this.loadError = null;
  }

  /** Opening a facility list clears the search results and its messages. */
  private clearSearch() {
    this.searchResults = [];
    this.hideResults = true;
    if (this.searchInput) {
      this.searchInput.clearSearchState();
    }
  }

  private loadFacilityGroups(locationUuid: string, otz: boolean) {
    this.clearSearch();
    const run = ++this.loadRun;
    this.fetchingGroups = true;
    this.loadError = null;
    this.loadingLabel = otz
      ? 'Loading OTZ clubs and viral suppression…'
      : 'Loading DC groups…';
    this.filterText = '';
    this.tableSearch = '';
    this.rowData = [];
    this.columnDefs = this.generateColumns();

    const rates$: Observable<Map<string, any>> = otz
      ? this.facilitySuppressionRates(locationUuid)
      : of(null);
    const sub = forkJoin([
      this.facilityGroups(
        locationUuid,
        otz ? OTZ_PROGRAM_UUID : DC_PROGRAM_UUID
      ).pipe(take(1)),
      rates$.pipe(take(1))
    ]).subscribe(
      ([res, rates]) => {
        if (run !== this.loadRun) {
          return;
        }
        this.groupsInCurrentFacility = res.map((result) => {
          const groupInstance = new Group(result);
          if (otz) {
            groupInstance.viralSuppression =
              rates.has(groupInstance.openmrsModel.uuid) &&
              rates
                .get(groupInstance.openmrsModel.uuid)
                .suppression_rate_percentage.toFixed(2) + '%';
          }
          return groupInstance;
        });
        this.hideGroupsInCurrentFacility = false;
        this.fetchingGroups = false;
        this.previousLocationUuid = locationUuid;
        this.rowData = this.groupsInCurrentFacility;
        this.filterText = otz
          ? 'OTZ PROGRAM'
          : 'DIFFERENTIATED SERVICE DELIVERY PROGRAM';
        this.listTotal = this.groupsInCurrentFacility.filter((group) =>
          this.doesExternalFilterPass({ data: group })
        ).length;
        if (this.gridOptions.api) {
          this.gridOptions.api.onFilterChanged();
        }
      },
      () => {
        if (run !== this.loadRun) {
          return;
        }
        this.fetchingGroups = false;
        this.loadError =
          'Could not load the groups in this facility. Please try again.';
      }
    );
    this.subscription.add(sub);
  }

  /**
   * The location's groups in one program, fetched once and reused until
   * something changes. The quick request asks only for that program's groups
   * and the fields the list shows. If it fails or finds nothing, the original
   * request (all the location's groups, full fields) is used instead, and the
   * list is exactly what it always was; the grid's program filter still picks
   * the DC or OTZ groups from it.
   */
  private facilityGroups(
    locationUuid: string,
    programUuid: string
  ): Observable<any[]> {
    const key = locationUuid + '|' + programUuid;
    if (!this.groupsByLocation.has(key)) {
      const original$ = this.groupService.getGroupsByLocationUuid(locationUuid);
      const groups$ = quickGroupQueryWorks
        ? this.groupService
            .getGroupsByLocationUuid(
              locationUuid,
              this.groupService.groupListV,
              programUuid
            )
            .pipe(
              map((groups: any[]) =>
                (groups || []).filter((group) =>
                  (group.attributes || []).some(
                    (attribute) =>
                      attribute.cohortAttributeType &&
                      attribute.cohortAttributeType.name === 'programUuid' &&
                      attribute.value === programUuid
                  )
                )
              ),
              catchError(() => of([])),
              switchMap((groups: any[]) => {
                if (groups.length > 0) {
                  return of(groups);
                }
                console.warn(
                  'Group manager: quick group request found nothing; using the full request.'
                );
                quickGroupQueryWorks = false;
                return original$;
              })
            )
        : original$;
      this.groupsByLocation.set(
        key,
        groups$.pipe(
          catchError((err) => {
            // A failed fetch is not kept, so trying again fetches anew.
            this.groupsByLocation.delete(key);
            return throwError(err);
          }),
          shareReplay(1)
        )
      );
    }
    return this.groupsByLocation.get(key);
  }

  /**
   * Suppression rate of each club at the location, by cohort uuid. As before,
   * clubs show without a rate if the rates cannot be fetched.
   */
  private facilitySuppressionRates(
    locationUuid: string
  ): Observable<Map<string, any>> {
    if (!this.suppressionByLocation.has(locationUuid)) {
      this.suppressionByLocation.set(
        locationUuid,
        this.cohortOtzModuleResourceService
          .getCohortSuppressionStatus(locationUuid)
          .pipe(
            map((data: any) =>
              this.generateCohortUuids((data && data.result) || [])
            ),
            catchError(() => {
              this.suppressionByLocation.delete(locationUuid);
              return of(new Map<string, any>());
            }),
            shareReplay(1)
          )
      );
    }
    return this.suppressionByLocation.get(locationUuid);
  }

  /** Activating or disbanding a group changes what the lists show. */
  private forgetFetchedGroups() {
    this.groupsByLocation.clear();
  }

  public generateCohortUuids(cohortData) {
    cohortData.forEach((cohort) => {
      this.cohortUuids.set(cohort.uuid, cohort);
    });
    return this.cohortUuids;
  }

  public getCohortSuppresionRate(locationUuid: string) {
    return this.facilitySuppressionRates(locationUuid).subscribe();
  }

  public navigateToGroupDetails(group, newGroup?) {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    if (newGroup) {
      this.router.navigate(['../group', group['uuid']], {
        relativeTo: this.route,
        queryParams: { newGroup: true }
      });
    } else {
      this.router.navigate(['../group', group['uuid']], {
        relativeTo: this.route
      });
    }
  }
  public onResults(results) {
    this.searchResults = results;
    this.hideGroupsInCurrentFacility = true;
  }

  /**
   * Called when a search starts (false) or is reset (true). Either way the
   * facility list goes, including one still loading.
   */
  public onReset(reset: boolean) {
    this.hideResults = reset;
    this.hideGroupsInCurrentFacility = true;
    this.stopFacilityLoad();
    // A new search starts from a clean page, not the last search's results.
    this.searchResults = [];
    this.subscription.unsubscribe();
    // Anything added to a closed Subscription is cancelled at once, which left
    // later group loads spinning forever.
    this.subscription = new Subscription();
  }

  public onLocationChange($event) {
    this.currentUserFacility = { display: $event.label, uuid: $event.value };
    this.groupsInCurrentFacility = null;
    this.searchResults = null;
    this.subscription.add(
      this.groupService
        .getGroupsByLocationUuid(this.currentUserFacility.uuid)
        .subscribe((res) => (this.groupsInCurrentFacility = res))
    );
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public isExternalFilterPresent() {
    return !_.isEmpty(this.filterText);
  }

  public doesExternalFilterPass(node) {
    const filterCaseLowercase = this.filterText.toLowerCase();
    return (
      _.includes(node.data.display.toLowerCase(), filterCaseLowercase) ||
      _.includes(node.data.facility.toLowerCase(), filterCaseLowercase) ||
      _.includes(node.data.status.toLowerCase(), filterCaseLowercase) ||
      _.includes(node.data.program, this.filterText)
    );
  }

  /** Searches every column of the loaded list, within the DC/OTZ filter. */
  public onTableSearch(text: string) {
    this.tableSearch = text || '';
    if (this.gridOptions.api) {
      this.gridOptions.api.setQuickFilter(this.tableSearch);
    }
  }

  public clearTableSearch() {
    this.onTableSearch('');
  }

  public externalFilterChanged($event) {
    this.filterText = $event;
    this.gridOptions.api.onFilterChanged();
  }

  public generateColumns() {
    const columns = [
      {
        headerName: 'Group Number',
        field: 'groupNumber',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          caseSensitive: false
        }
      },
      {
        headerName: 'Group Name',
        field: 'display',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          caseSensitive: false
        }
      },
      {
        headerName: 'Program',
        field: 'program',
        cellRenderer: (params) => programBadge(params.value),
        // Searchable by the badge (DC / OTZ) as well as the full name.
        getQuickFilterText: (params) =>
          programShortName(params.value) + ' ' + (params.value || ''),
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          caseSensitive: false
        }
      },
      {
        headerName: 'Facility',
        field: 'facility',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          caseSensitive: false
        }
      },
      {
        headerName: 'Landmark',
        field: 'landmark',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          caseSensitive: false
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: (params) => statusPill(params.value),
        sortable: true,
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Group Count',
        field: 'groupCount',
        sortable: true,
        filter: 'agTextColumnFilter',
        width: 200,
        filterParams: {
          caseSensitive: false
        }
      },
      ...(this.isOTZprogram
        ? [
            {
              headerName: 'Viral Suppression',
              field: 'viralSuppression',
              sortable: true,
              filter: 'agTextColumnFilter',
              width: 200,
              filterParams: {
                caseSensitive: false
              }
            },
            {
              headerName: 'Last Meeting Date',
              field: 'lastMeetingDate',
              sortable: true,
              filter: 'agTextColumnFilter',
              width: 200,
              filterParams: {
                caseSensitive: false
              }
            },
            {
              headerName: 'OTZ Champion',
              field: 'otzChampion',
              sortable: true,
              filter: 'agTextColumnFilter',
              width: 200,
              filterParams: {
                caseSensitive: false
              }
            },
            {
              headerName: 'Group Activity',
              field: 'groupActivity',
              sortable: true,
              filter: 'agTextColumnFilter',
              width: 200,
              filterParams: {
                caseSensitive: false
              }
            }
          ]
        : []),
      {
        headerName: 'Actions',
        field: 'status',
        sortable: false,
        suppressFilter: true,
        width: 170,
        // Active groups are opened; inactive or disbanded ones can be activated.
        cellRenderer: (params) =>
          String(params.value || '').toLowerCase() === 'active'
            ? `<button type="button" class="gr-btn gr-btn-open" data-action-type="open" title="Open this group">
                 <i class="fa fa-folder-open-o" aria-hidden="true"></i> Open group
               </button>`
            : `<button type="button" class="gr-btn gr-btn-activate" data-action-type="activate" title="Activate this group">
                 <i class="fa fa-check" aria-hidden="true"></i> Activate group
               </button>`
      }
    ];
    return columns.map((column: any) =>
      Object.assign({}, column, COLUMN_LAYOUT[column.headerName] || {})
    );
  }

  public disbandGroup(group: any, node: RowNode, endDate: Date) {
    this.subscription.add(
      this.groupService.disbandGroup(group.uuid, endDate, '').subscribe(
        (updatedGroup) => {
          this.forgetFetchedGroups();
          return node.setData(this.updatedRow(group, updatedGroup));
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  public activateGroup(group, node: RowNode) {
    this.groupService.activateGroup(group.uuid).subscribe(
      (updatedGroup) => {
        this.forgetFetchedGroups();
        return node.setData(this.updatedRow(group, updatedGroup));
      },
      (error) => {
        console.log(error);
      }
    );

    this.toastrService.showToastr(
      'success',
      `Group ${group.display} has been activated successully`,
      'Activated!'
    );
  }

  /**
   * The row after an activate or disband: its own details (meetings, members,
   * OTZ rate) with the new end date and void state from the server.
   */
  private updatedRow(group: Group, updatedGroup: any): Group {
    const reply = updatedGroup || {};
    const row = new Group(
      Object.assign({}, group.openmrsModel, {
        endDate: reply.endDate !== undefined ? reply.endDate : null,
        voided: reply.voided !== undefined ? reply.voided : false
      })
    );
    row.viralSuppression = group.viralSuppression;
    return row;
  }

  /**
   * Whether there are columns off to the side, so the hint can say so. Read
   * after layout settles.
   */
  public updateScrollHint() {
    setTimeout(() => {
      const viewport: HTMLElement =
        this.host.nativeElement &&
        this.host.nativeElement.querySelector('.gm-grid .ag-body-viewport');
      if (!viewport || viewport.clientWidth === 0) {
        this.canScrollSideways = false;
        this.atScrollEnd = false;
        return;
      }
      const overflow = viewport.scrollWidth - viewport.clientWidth;
      this.canScrollSideways = overflow > 4;
      this.atScrollEnd = viewport.scrollLeft >= overflow - 4;
    });
  }

  /** A card on phones: open the group, as a row click does. */
  public openCard(row: { data: any; node: RowNode }) {
    this.navigateToGroupDetails(row.data);
  }

  /** A card's Activate group, with the same confirmation as the table. */
  public activateCard(row: { data: any; node: RowNode }) {
    const confirmed = window.confirm(
      `Are you sure you want to activate group ${row.data.display}?`
    );
    if (confirmed) {
      this.activateGroup(row.data, row.node);
    }
  }

  public isActiveStatus(status: string): boolean {
    return String(status || '').toLowerCase() === 'active';
  }

  public programShort(program: string): string {
    return programShortName(program);
  }

  public gridOnCellClick($event) {
    if ($event.event.target !== undefined) {
      const data = $event.data;
      // The click may land on the icon inside a button.
      const target: any = $event.event.target;
      const actionEl =
        target && target.closest ? target.closest('[data-action-type]') : null;
      const actionType = actionEl
        ? actionEl.getAttribute('data-action-type')
        : null;
      switch (actionType) {
        case 'activate':
          const confirmed = window.confirm(
            `Are you sure you want to activate group ${data.display}?`
          );
          if (confirmed) {
            return this.activateGroup(data, $event.node);
          }
          break;
        case 'disband':
          return this.disbandGroup(data, $event.node, new Date());
        default:
          const group = $event.data;
          return this.navigateToGroupDetails(group);
      }
    }
  }

  /** Nothing is loaded, loading, searched or failed: show how to start. */
  public get showStartHint(): boolean {
    const hasSearchResults =
      !!this.searchResults &&
      !this.hideResults &&
      this.searchResults.length > 0;
    return (
      !this.fetchingGroups &&
      !this.loadError &&
      !this.isViewShown &&
      !hasSearchResults
    );
  }

  /** Whether a DC or OTZ list is open (rather than search results). */
  public get isViewShown(): boolean {
    return !!this.groupsInCurrentFacility && !this.hideGroupsInCurrentFacility;
  }

  public getGridOptions() {
    return {
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      showToolPanel: false,
      pagination: true,
      paginationPageSize: 11,
      animateRows: true,
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      enableCellChangeFlash: true,
      suppressHorizontalScroll: false,
      rowHeight: 48,
      headerHeight: 46,
      onGridSizeChanged: () => {
        if (this.gridOptions.api) {
          this.gridOptions.api.sizeColumnsToFit();
        }
        this.updateScrollHint();
      },
      onGridReady: () => {
        if (this.gridOptions.api) {
          this.gridOptions.api.sizeColumnsToFit();
          [
            'bodyScroll',
            'displayedColumnsChanged',
            'columnResized'
          ].forEach((eventName) =>
            this.gridOptions.api.addEventListener(eventName, () =>
              this.updateScrollHint()
            )
          );
          this.updateScrollHint();
          if (this.tableSearch) {
            this.gridOptions.api.setQuickFilter(this.tableSearch);
          }
        }
      },
      onRowDataChanged: () => {
        if (this.gridOptions.api) {
          this.gridOptions.api.sizeColumnsToFit();
        }
      },
      onModelUpdated: () => {
        // After the grid's change: counting during it would change the header
        // while Angular is still checking it.
        Promise.resolve().then(() => {
          const api = this.gridOptions.api;
          this.visibleCount = api ? api.getDisplayedRowCount() : 0;
          const rows: Array<{ data: any; node: RowNode }> = [];
          if (api) {
            api.forEachNodeAfterFilterAndSort((node: RowNode) => {
              if (node.data) {
                rows.push({ data: node.data, node });
              }
            });
          }
          this.visibleRows = rows;
          this.updateScrollHint();
        });
      }
    };
  }
}
