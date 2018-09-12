import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Group } from '../group-model';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'group-manager-search-results',
    templateUrl: './group-manager-search-results.component.html',
    styleUrls: ['./group-manager-search-results.component.css']
})
export class GroupManagerSearchResultsComponent implements OnInit, OnDestroy {
    public _groups: Group[];
    public modalRef: BsModalRef;
    public selectedGroup: Group;
    public subscription: Subscription;
    @Input() set groups(groups: Group[]) { this._groups = groups; }
    @Output() groupSelected: EventEmitter<string> = new EventEmitter();
    @ViewChild('successModal') public successModal: BsModalRef;

    public endDate = {
        date: {
            'year': Moment().year(),
            'month': Moment().month(),
            'day': Moment().date()
        },
        jsdate: new Date()
    };

    constructor(private communityGroupService: CommunityGroupService,
                private modalService: BsModalService) { }
    ngOnInit(): void { }

    public selectGroup(groupUuid: string) {
        this.groupSelected.emit(groupUuid);
    }

    public getAttribute(attributeType, attributes) {
        const attr = this.communityGroupService.getGroupAttribute(attributeType, attributes);
        if (attr) {
            return attr.value;
        }
            return '-';
    }


    public showDisbandGroupModal(modal: any, group = null) {
        this.selectedGroup = group;
        this.modalRef = this.modalService.show(modal, {
            animated: true
        });
    }

    public showSuccessModal() {
        this.modalRef = this.modalService.show(
            this.successModal, {animated: true});
    }

    public disband(endDate: Date) {
        const index = _.indexOf(this._groups, this.selectedGroup);
        this.modalRef.hide();
        this.subscription = this.communityGroupService.disbandGroup(this.selectedGroup.uuid, endDate).subscribe(
            (updatedGroup) => {
                this.showSuccessModal();
                this._groups[index] = updatedGroup;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
