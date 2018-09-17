import { Component, OnInit, Input, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { Group } from '../group-model';
import * as _ from 'lodash';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { Subscription, combineLatest } from 'rxjs';
import { CommunityGroupLeaderService } from '../../openmrs-api/community-group-leader-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { DatePickerModalComponent } from '../modals/date-picker-modal.component';
import { SuccessModalComponent } from '../modals/success-modal.component';
import { GroupEditorComponent } from '../group-editor/group-editor-component';

const PEER = 'peer';
const STAFF = 'staff';
const PRIMARY_CONTACTS = '72a759a8-1359-11df-a1f1-0026b9348838';
const ALT_CONTACTS = 'c725f524-c14a-4468-ac19-4a0e6661c930';
const NEXT_OF_KIN_CONTACTS = 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d';
const SPOUSE_CONTACTS = 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46';


@Component({
    selector: 'group-detail-summary',
    templateUrl: './group-detail-summary.component.html',
    styleUrls: ['./group-detail-summary.component.css']
})

export class GroupDetailSummaryComponent implements OnInit, OnDestroy {
    public group: Group;
    public groupNumber: any;
    public landmark: any;
    public provider: any;
    public currentLeader: any;
    public selectedLeader: any;
    public modalRef: BsModalRef;
    public modalRefNested: BsModalRef;
    public successMsg: string;
    private subscription: Subscription;
    public locations: any;
    public defaultLeadershipType = STAFF;
    public providers = [];
    public providerLoading = false;
    public r1 = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))/;
    public r2 = /(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
    public pattern = new RegExp(this.r1.source + this.r2.source);

    @ViewChild('successModal') public successModal: BsModalRef;

    public endDate = {
        date: {
            'year': Moment().year(),
            'month': Moment().month(),
            'day': Moment().date()
        }
    };

    @Input() set _group(group: Group) {

        this.group = group;
        this.groupNumber = this.communityGroupService.getGroupAttribute('groupNumber', this.group.attributes);
        this.landmark = this.communityGroupService.getGroupAttribute('landmark', this.group.attributes);
        this.currentLeader = this.getCurrentLeader(group.cohortLeaders, group.cohortMembers);
        this.getProvider(this.communityGroupService.getGroupAttribute('provider', this.group.attributes));

    }



    constructor(private modalService: BsModalService,
        private communityGroupService: CommunityGroupService,
        private providerResourceService: ProviderResourceService,
        private locationService: LocationResourceService,
        private communityGroupMemberService: CommunityGroupMemberService,
        private communityGroupLeaderService: CommunityGroupLeaderService) { }

    ngOnInit(): void {}



    public getCurrentLeader(allLeaders: any[], allMembers: any[]) {
        let currentLeader = _.filter(allLeaders, (leader) => leader.endDate == null)[0];
        if (currentLeader) {
                currentLeader = this.generateLeaderObject(currentLeader, allMembers);
        }
        return currentLeader;
    }

    public reloadData() {
        this.communityGroupService.getGroupByUuid(this.group.uuid).subscribe((group) => {
            this.group = group;
            this.groupNumber = this.communityGroupService.getGroupAttribute('groupNumber', this.group.attributes);
            this.landmark = this.communityGroupService.getGroupAttribute('landmark', this.group.attributes);
            this.currentLeader = this.getCurrentLeader(group.cohortLeaders, group.cohortMembers);
            this.getProvider(this.communityGroupService.getGroupAttribute('provider', this.group.attributes));
        });
    }

    public generateLeaderObject(leader, allMembers = []) {
        const currentLeader = {};
        currentLeader['name'] = leader.person.display;
        currentLeader['attributes'] = leader.person.attributes;
        currentLeader['uuid'] = leader.person.uuid;
        currentLeader['startDate'] = leader.startDate || new Date();
        currentLeader['leaderUuid'] = leader.uuid;
        currentLeader['primaryContacts'] = this.getContacts(PRIMARY_CONTACTS, leader.person.attributes);
        currentLeader['alternativeContacts'] = this.getContacts(ALT_CONTACTS, leader.person.attributes);
        currentLeader['spouseContacts'] = this.getContacts(SPOUSE_CONTACTS, leader.person.attributes);
        currentLeader['nextOfKinContacts'] = this.getContacts(NEXT_OF_KIN_CONTACTS, leader.person.attributes);
        currentLeader['leadershipType'] = this.getLeadershipType(leader.person.uuid, allMembers);
        return currentLeader;
    }

    public getLeadershipType(currentLeaderPersonUuid, cohortMembers) {
        let type = '';
        let match = [];
        if (cohortMembers.length > 0) {
           match = _.filter(cohortMembers, (member) => currentLeaderPersonUuid === member.patient.person.uuid);
        }
        match.length > 0 ? type = PEER : type = STAFF;
        return type;
    }

    public getContacts(attributeTypeUuid: string, attributes: any[]) {
        return _.filter(attributes, (attribute) => attribute.attributeType.uuid === attributeTypeUuid)[0];
    }

    public showSuccessModal(successMsg: string) {
        const initialState = {
          successMsg
        };
        this.modalRefNested = this.modalService.show(SuccessModalComponent, {
          initialState
        });
      }


    public showDisbandDateModal(group: any, title: string, okBtnText ?: string, closeBtnText ?: string) {
        const initialState = {
          label: 'Select Date',
          okBtnText: okBtnText || 'OK',
          closeBtnText: closeBtnText || 'Cancel',
          title: title
        };
        this.modalRef = this.modalService.show(DatePickerModalComponent, {
          initialState
        });
        this.modalRef.content.onSave.subscribe((date) => {
          this.modalRef.hide();
          this.disbandGroup(group['uuid'], date);
        });
      }


    public getProvider(providerUuid) {
        if (providerUuid) {
            const v = 'custom:(person:(uuid,display,attributes:(attributeType:(uuid),value,display)),uuid)';
            this.subscription = this.providerResourceService.getProviderByPersonUuid(providerUuid.value, v)
                .subscribe((provider) => {
                    this.provider = provider;
                });
        }
    }


    public showModal(modal: TemplateRef<any>) {
        this.modalRef = this.modalService.show(modal, {class: 'modal-lg'});
    }

    public showNestedModal(modal: TemplateRef<any>) {
        this.modalRefNested = this.modalService.show(modal, {class: 'second'});
    }

    public resetLeader(group) {
        this.modalRef.hide();
        this.currentLeader = this.getCurrentLeader(group.cohortLeaders, group.cohortMembers);
    }

    public onLeaderSelected(uuid, members) {
        const selectedPeerLeader = _.filter(members, (member) => member.person['uuid'] === uuid)[0];
        if (selectedPeerLeader) {
            this.currentLeader = this.generateLeaderObject(selectedPeerLeader, members);
        }
    }

    public onLeadershipTypeChanged(event) {
        if (event.value === STAFF) {
            console.log(this.provider, 'OnleadershipTYpeChanged');
            this.currentLeader = this.generateLeaderObject(this.provider);
        } else {
            this.currentLeader = this.getCurrentLeader(this.group.cohortLeaders, this.group.cohortMembers);
            if (this.currentLeader['leadershipType'] === STAFF) {
                this.currentLeader = {};
                this.currentLeader['leadershipType'] = PEER;
            }
        }
    }

    public onDefaultLeadershipTypeChanged(event) {
        this.defaultLeadershipType = event.value;
    }

    public addGroupLeader(value) {
        const personUuid = value['staffLeader'] || value['peerLeader'];
        this.modalRef.hide();
        this.communityGroupLeaderService.addGroupLeader(this.group.uuid, personUuid, new Date())
        .subscribe((res) => {
            this.reloadData();
        });
    }
    public disbandGroup(uuid, date) {
        this.communityGroupService.disbandGroup(uuid, date)
            .subscribe((res) => {
                this.showSuccessModal('Group has been successfully disbanded.');
                this.group.endDate = res.endDate;
            });
    }


    public updateContacts(leader: any, formValue: any) {
            this.modalRefNested.hide();
            const requests = [];
            const contactTypes = Object.keys(formValue);
            _.forEach(contactTypes, (contactType) => {
                const attributeTypeUuid = this.getContactAttributeTypeUuid(contactType);
                if (formValue[contactType]) {
                    if (leader[contactType]) {
                        if (formValue[contactType] !== leader[contactType].value) {
                        requests.push(this.updateAttribute(leader.uuid, leader[contactType].uuid, formValue[contactType]));
                         }
                     } else {
                    requests.push(this.createAttribute(leader.uuid, attributeTypeUuid, formValue[contactType]));
            }
            }
        });
        return combineLatest(requests).subscribe((updatedContacts) => {
            this.showSuccessModal(`Successfully update contacts for ${leader.name}`);
            this.updateContactsUIState(updatedContacts, leader);
        },
        (error) => {
            console.log(error);
        });

    }

    public showUpdateGroupModal() {
        const initialState = {editType: 'Edit',
                              groupName: this.group.name,
                              groupNo: this.groupNumber.value,
                              facility:  {label: this.group.location['display'], value: this.group.location['uuid']},
                              groupType: {label: this.group.cohortType['name'], value: this.group.cohortType['uuid']},
                              groupProgram: {label: this.group.cohortProgram['name'], value: this.group.cohortProgram['uuid']},
                              provider: {label: this.provider.person.display, value: this.provider.person.uuid},
                              address: this.landmark.value,
                              groupUuid: this.group.uuid
                              };
        this.modalRef = this.modalService.show(GroupEditorComponent, {initialState: initialState});
        this.modalRef.content.onSave.subscribe((res) => {
            this._group = res;
            this.modalRef.hide();
            this.showSuccessModal('Successfully updated group ' + this.group.name);
        });
    }

    public updateContactsUIState(updatedContacts, leader) {
        _.forEach(updatedContacts, (contact) => {
            switch (contact.attributeType.uuid) {
                case PRIMARY_CONTACTS:
                     leader['primaryContacts'] = contact;
                     break;
                case SPOUSE_CONTACTS:
                     leader['spouseContacts'] = contact;
                     break;
                case ALT_CONTACTS:
                     leader['alternativeContacts'] = contact;
                     break;
                case NEXT_OF_KIN_CONTACTS:
                     leader['nextOfKinContacts'] = contact;
                     break;
            }
        });
    }

    public getContactAttributeTypeUuid(contactType: string) {
        switch (contactType) {
            case 'alternativeContacts':
                  return ALT_CONTACTS;
            case 'primaryContacts':
                  return PRIMARY_CONTACTS;
            case 'spouseContacts':
                  return SPOUSE_CONTACTS;
            case 'nextOfKinContacts':
                  return NEXT_OF_KIN_CONTACTS;
        }
    }

    public updateAttribute(personUuid: string, attributeUuid: string, value: any) {
        return this.communityGroupMemberService
                    .updatePersonAttribute(personUuid, attributeUuid, value);
    }

    public createAttribute(personUuid: string, attributeTypeUuid: string, value: any) {
        return this.communityGroupMemberService
                    .createPersonAttribute(personUuid, attributeTypeUuid, value);
    }

    public updateGroupLeader(formValue: any) {
        const currentLeader = this.getCurrentLeader(this.group.cohortLeaders, this.group.cohortMembers);
        const selectedLeaderUuid = formValue['peerLeader'] || formValue['staffLeader'];
        this.modalRef.hide();
        if (currentLeader) {
            if (currentLeader['uuid'] !== selectedLeaderUuid) {
                this.communityGroupLeaderService.updateGroupLeader(this.group['uuid'], currentLeader['leaderUuid'], selectedLeaderUuid)
                .subscribe((res) => {
                    this.showSuccessModal('Successfully changed leader for ' + this.group.name);
                    this.reloadData();
                },
                (error) => { console.log(error); });
            }
        } else {
            this.communityGroupLeaderService.addGroupLeader(this.group['uuid'], selectedLeaderUuid, new Date()).subscribe(
                (res) => this.reloadData(),
                (error) => console.log(error));
        }
    }


    public openDateModal(onSaveMethod, title) {
        const initialState = {
            showSuccessModal: true,
            onSaveMethod: onSaveMethod,
            label: 'Select Date',
            okBtnText: 'End Membership',
            closeBtnText: 'Cancel',
            title: title
        };
        this.modalRef = this.modalService.show(DatePickerModalComponent, {initialState});
    }


    public activateGroup(group: any) {
        this.communityGroupService.activateGroup(group.uuid).subscribe((res) => {
            this.showSuccessModal('Successfully reactivated group.');
            this.group = res;
        },
        (error) => (console.log(error)));
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
