import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import * as _ from 'lodash';
import { Group } from '../group-model';
import {ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event} from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { GroupEditorComponent } from '../group-editor/group-editor-component';
import { UserDefaultPropertiesService } from '../../user-default-properties';
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

    constructor(private groupService: CommunityGroupService,
                private router: Router,
                private bsModalService: BsModalService,
                private route: ActivatedRoute,
                private userDefaultService: UserDefaultPropertiesService) { }

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
        this.subscription.add(this.groupService.getPreviousSearchResults().subscribe((results) => {
            this.searchResults = results;
        }));
         this.currentUserFacility = this.userDefaultService.getCurrentUserDefaultLocationObject();
        this.subscription.add(this.groupService.getGroupsByLocationUuid(this.currentUserFacility.uuid)
        .subscribe((res) => this.groupsInCurrentFacility = res));
     }

    public onGroupSelected(groupUuid: string) {
        if (this.modalRef) {
            this.modalRef.hide();
        }
        this.router.navigate(['../group', groupUuid], {relativeTo: this.route});
    }
    public showModal(modal: TemplateRef<any>) {
       this.modalRef = this.bsModalService.show(modal);
    }


    public navigateToGroupDetails(group, newGroup?) {
        this.modalRef.hide();
        if (newGroup) {
            this.router.navigate(['../group', group['uuid']], {relativeTo: this.route, queryParams: {newGroup: true}});
        } else {
            this.router.navigate(['../group', group['uuid']], {relativeTo: this.route});
        }
    }
    public onResults(results) {
      this.searchResults = results;
    }
    public onReset(reset: boolean) {
     this.hideResults = reset;
     this.subscription.unsubscribe();
    }

    public onLocationChange($event) {
        this.currentUserFacility = {display: $event.label, uuid: $event.value};
        this.subscription.add(this.groupService.getGroupsByLocationUuid(this.currentUserFacility.uuid)
        .subscribe((res) => this.groupsInCurrentFacility = res));
    }

    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
