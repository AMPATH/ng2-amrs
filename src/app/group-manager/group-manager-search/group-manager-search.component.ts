import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import * as _ from 'lodash';
import { Group } from '../group-model';
import {ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event} from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { GroupEditorComponent } from '../group-editor/group-editor-component';
@Component({
    selector: 'group-manager-search',
    templateUrl: './group-manager-search.component.html',
    styleUrls: ['./group-manager-search.component.css']
})

export class GroupManagerSearchComponent implements OnInit, OnDestroy {

    public searchString = '';
    public lastSearchString = '';
    public isLoading = false;
    public searchResults: Group[];
    public noMatchingResults = false;
    public hideResults: boolean;
    public totalGroups: number;
    public errorMessage: String;
    public showGroupDialog = false;
    public subscription: Subscription;
    public modalRef: BsModalRef;
    public searchByLandmark = false;
    public routeLoading = false;

    constructor(private groupService: CommunityGroupService,
                private router: Router,
                private bsModalService: BsModalService,
                private route: ActivatedRoute) { }

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
     }

    public onGroupSelected(groupUuid: string) {
        this.router.navigate(['../group', groupUuid], {relativeTo: this.route});
    }
    public showCreateGroupModal() {
       const initialState = { editType: 'Create', isModal: true };
       this.modalRef = this.bsModalService.show(GroupEditorComponent, {initialState: initialState});
       this.modalRef.content.onCreate.subscribe((creatingGroup: boolean) => this.routeLoading = creatingGroup);
       this.modalRef.content.onSave.subscribe((group) => {
           this.router.navigate(['../group', group['uuid']], {relativeTo: this.route});
       });
    }
    public onResults(results) {
      this.searchResults = results;
    }
    public onReset(reset: boolean) {
     this.hideResults = reset;
    }

    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
