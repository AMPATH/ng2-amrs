import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import * as _ from 'lodash';
import { Group } from '../group-model';
import {ActivatedRoute, Router} from '@angular/router';
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

    constructor(private groupService: CommunityGroupService,
                private router: Router,
                private bsModalService: BsModalService,
                private route: ActivatedRoute) { }

    ngOnInit(): void { }

    public searchGroup() {
        this.hideResults = false;
        this.isLoading = true;
        this.lastSearchString = this.searchString;
        if (!_.isEmpty(this.errorMessage)) {
            this.errorMessage = '';
        }
        this.subscription = this.groupService.searchCohort(this.searchString).subscribe((res) => {
            this.searchResults = res;
            this.totalGroups = this.searchResults.length;
            this.isLoading = false;
        },
    (error) => {
        this.isLoading = false;
    });

    }

    public resetSearchList() {
        this.hideResults = true;
        this.searchString = '';
        this.totalGroups = 0;
        this.isLoading = false;
    }

    public onGroupSelected(groupUuid: string) {
        this.router.navigate(['../group', groupUuid], {relativeTo: this.route});
    }
    public showCreateGroupModal() {
       const initialState = { editType: 'Create' };
       this.modalRef = this.bsModalService.show(GroupEditorComponent, {initialState: initialState});
       this.modalRef.content.onSave.subscribe((group) => {
           this.router.navigate(['../group', group['uuid']], {relativeTo: this.route});
       });
    }
    public closeDialogue() {
        this.showGroupDialog = false;
    }
    public hideEditDialog($event) {
        this.showGroupDialog = $event;
    }

    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
