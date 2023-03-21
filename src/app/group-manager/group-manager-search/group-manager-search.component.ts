import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
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
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Group } from '../../models/group.model';
import { GridOptions, RowNode } from 'ag-grid';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
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
  columnDefs = this.generateColumns();
  rowData: any;
  public gridOptions: GridOptions = this.getGridOptions();
  public filterText = '';
  hideGroupsInCurrentFacility: boolean;

  constructor(
    private groupService: CommunityGroupService,
    private router: Router,
    private bsModalService: BsModalService,
    private route: ActivatedRoute,
    private programResourceService: ProgramResourceService
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

  public showGroupsInFacilty() {
    this.rowData = [];
    this.fetchingGroups = true;
    const locationUuid = this.router.url.split('/')[2];
    if (locationUuid !== this.previousLocationUuid) {
      this.fetchingGroups = true;
      const sub = this.groupService
        .getGroupsByLocationUuid(locationUuid)
        .subscribe((res) => {
          this.groupsInCurrentFacility = res.map((result) => new Group(result));
          this.hideGroupsInCurrentFacility = false;
          this.fetchingGroups = false;
          this.previousLocationUuid = locationUuid;
          this.rowData = this.groupsInCurrentFacility;
          console.log(this.rowData, 'rowData');
        });
      this.subscription.add(sub);
    } else {
      this.rowData = this.groupsInCurrentFacility;
    }
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

  public onReset(reset: boolean) {
    this.hideResults = reset;
    this.hideGroupsInCurrentFacility = true;
    this.subscription.unsubscribe();
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
      _.includes(node.data.status.toLowerCase(), filterCaseLowercase)
    );
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
        cellStyle: function (column) {
          if (column.value.toLowerCase() === 'active') {
            return { color: 'green' };
          } else {
            return { color: 'red' };
          }
        },
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
      {
        headerName: 'Actions',
        field: 'endDate',
        cellRenderer: (column) => {
          if (column.value) {
            return `<button class='btn btn-sm btn-success' data-action-type='activate'
                    (click)='activateGroup($event, rowData)'>Activate</button>`;
          } else {
            return `<button class='btn btn-sm btn-danger' data-action-type='disband'
                    (click)='disband(group, new Date())' >Disband</button>`;
          }
        }
      }
    ];
    return columns;
  }

  public disbandGroup(group: any, node: RowNode, endDate: Date) {
    this.subscription.add(
      this.groupService.disbandGroup(group.uuid, endDate, '').subscribe(
        (updatedGroup) => {
          return node.setData(new Group(updatedGroup));
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
        return node.setData(new Group(updatedGroup));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public gridOnCellClick($event) {
    if ($event.event.target !== undefined) {
      const data = $event.data;
      const actionType = $event.event.target.getAttribute('data-action-type');
      switch (actionType) {
        case 'activate':
          return this.activateGroup(data, $event.node);
        case 'disband':
          return this.disbandGroup(data, $event.node, new Date());
        default:
          const group = $event.data;
          return this.navigateToGroupDetails(group);
      }
    }
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
      rowHeight: 40,
      onGridSizeChanged: () => {
        if (this.gridOptions.api) {
          this.gridOptions.api.sizeColumnsToFit();
        }
      },
      onGridReady: () => {
        if (this.gridOptions.api) {
          this.gridOptions.api.sizeColumnsToFit();
        }
      },
      onRowDataChanged: () => {
        if (this.gridOptions.api) {
          this.gridOptions.api.sizeColumnsToFit();
        }
      }
    };
  }
}
