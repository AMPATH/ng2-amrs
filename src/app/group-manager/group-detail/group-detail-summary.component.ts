import { Component, OnInit, Input, OnDestroy, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Group } from '../group-model';
import * as _ from 'lodash';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { Subscription, combineLatest } from 'rxjs';
import { CommunityGroupLeaderService } from '../../openmrs-api/community-group-leader-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { DatePickerModalComponent } from '../modals/date-picker-modal.component';
import { SuccessModalComponent } from '../modals/success-modal.component';
import { GroupEditorComponent } from '../group-editor/group-editor-component';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';

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
    public state: any;
    public group: Group;
    public groupNumber: any;
    public landmark: any;
    public provider: any;
    public program: any;
    public currentLeader: any;
    public selectedLeader: any;
    public modalRef: BsModalRef;
    public modalRefNested: BsModalRef;
    public successMsg: string;
    private subscription: Subscription = new Subscription();
    public locations: any;
    public defaultLeadershipType = STAFF;
    public providers = [];
    public providerLoading = false;
    public r1 = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))/;
    public r2 = /(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
    public pattern = new RegExp(this.r1.source + this.r2.source);

    @Output() updatedGroup: EventEmitter<any> = new EventEmitter();
    public currentMonth = Moment().month() + 1;
    public endDate = {
        date: {
            month: this.currentMonth,
            year: Moment().year(),
            day: Moment().date()
        },
        formatted: Moment().format('YYYY-MM-DD')
    };

    public dateOptions = {
        dateFormat: 'yyyy-mm-dd',
        appendSelectorToBody: true
    };

    @Input() set _group(group: Group) {

        this.group = group;
        this.groupNumber = this.communityGroupService.getGroupAttribute('groupNumber', this.group.attributes);
        this.landmark = this.communityGroupService.getGroupAttribute('landmark', this.group.attributes);
        this.currentLeader = this.getCurrentLeader(group.cohortLeaders, group.cohortMembers);
        this.getProgram(this.communityGroupService.getGroupAttribute('programUuid', this.group.attributes));
        this.getProvider(this.communityGroupService.getGroupAttribute('provider', this.group.attributes));

    }



    constructor(private modalService: BsModalService,
        private communityGroupService: CommunityGroupService,
        private providerResourceService: ProviderResourceService,
        private programService: ProgramResourceService,
        private communityGroupMemberService: CommunityGroupMemberService,
        private communityGroupLeaderService: CommunityGroupLeaderService) { console.log(this.endDate, 'END DATE'); }

    ngOnInit(): void {         console.log(Moment().month() + 1, 'MONTH')
 }



    public getCurrentLeader(allLeaders: any[], allMembers: any[]) {
        let currentLeader = _.filter(allLeaders, (leader) => leader.endDate == null)[0];
        if (currentLeader) {
                currentLeader = this.generateLeaderObject(currentLeader, allMembers);
        }
        return currentLeader;
    }

    public reloadData() {
       const sub = this.communityGroupService.getGroupByUuid(this.group.uuid).subscribe((group) => {
            this.group = group;
            this.updatedGroup.emit(this.group);
            this.groupNumber = this.communityGroupService.getGroupAttribute('groupNumber', this.group.attributes);
            this.landmark = this.communityGroupService.getGroupAttribute('landmark', this.group.attributes);
            this.currentLeader = this.getCurrentLeader(group.cohortLeaders, group.cohortMembers);
            this.getProvider(this.communityGroupService.getGroupAttribute('provider', this.group.attributes));
        });
        this.subscription.add(sub);
    }

    public generateLeaderObject(leader, allMembers = []) {
        if (leader.patient) {
            leader = leader.patient;
        }
        if (leader.person.person) {
            leader = leader.person;
        }
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


    public getProvider(providerUuid) {
        if (providerUuid) {
            const v = 'custom:(person:(uuid,display,attributes:(attributeType:(uuid),value,display)),uuid)';
            const sub = this.providerResourceService.getProviderByPersonUuid(providerUuid.value, v)
                .subscribe((provider) => {
                    this.provider = provider;
                });
        this.subscription.add(sub);
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
        const selectedPeerLeader = _.filter(members, (member) => member.patient.person['uuid'] === uuid)[0];
        if (selectedPeerLeader) {
            this.currentLeader = this.generateLeaderObject(selectedPeerLeader, members);
        }
    }

    public onLeadershipTypeChanged(event) {
        if (event.value === STAFF) {
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
        const sub = this.communityGroupLeaderService.addGroupLeader(this.group.uuid, personUuid, new Date())
        .subscribe((res) => {
            this.reloadData();
        });
        this.subscription.add(sub);

    }
    public disbandGroup(date, reason) {
        console.log(date, reason);
        this.modalRef.hide();
        const sub = this.communityGroupService.disbandGroup(this.group.uuid, date, reason)
            .subscribe((res) => {
                this.showSuccessModal('Group has been successfully disbanded and all members have been removed.');
                this.group = res;
                this.updatedGroup.emit(this.group);
            });
            this.subscription.add(sub);
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
        const sub = combineLatest(requests).subscribe((updatedContacts) => {
            this.showSuccessModal(`Successfully update contacts for ${leader.name}`);
            this.updateContactsUIState(updatedContacts, leader);
            console.log(updatedContacts);
        },
        (error) => {
            console.log(error);
        });
        this.subscription.add(sub);


    }

    public showUpdateGroupModal(modal) {
        let program = null;
        this.program ? program = this.program : program = { name: null, value: null };
        this.state = {        editType: 'Edit',
                              groupName: this.group.name,
                              groupNo: this.groupNumber.value,
                              facility:  {label: this.group.location['display'], value: this.group.location['uuid']},
                              groupType: {label: this.group.cohortType['name'], value: this.group.cohortType['uuid']},
                              groupProgram: {label: program['name'], value: program['uuid']},
                              provider: {label: this.provider.person.display, value: this.provider.person.uuid},
                              address: this.landmark.value,
                              groupUuid: this.group.uuid,
                     };
        this.modalRef = this.modalService.show(modal);
    }

    public onGroupDetailsUpdate(updatedGroup) {
            this._group = updatedGroup;
            this.updatedGroup.emit(updatedGroup);
            this.modalRef.hide();
            this.showSuccessModal('Successfully updated group ' + this.group.name);
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
                const sub =
                this.communityGroupLeaderService.updateGroupLeader(this.group['uuid'], currentLeader['leaderUuid'], selectedLeaderUuid)
                .subscribe((res) => {
                    this.showSuccessModal('Successfully changed leader for ' + this.group.name);
                    this.reloadData();
                },
                (error) => { console.log(error); });
        this.subscription.add(sub);

            }
        } else {
            const sub = this.communityGroupLeaderService.addGroupLeader(this.group['uuid'], selectedLeaderUuid, new Date()).subscribe(
                (res) => this.reloadData(),
                (error) => console.log(error));
            this.subscription.add(sub);
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
        const sub = this.communityGroupService.activateGroup(group.uuid).subscribe((res) => {
            this.showSuccessModal('Successfully reactivated group.');
            this.group = res;
        },
        (error) => (console.log(error)));
        this.subscription.add(sub);

    }

    public getProgram(program: any) {
        if (program) {
        const sub = this.programService.getProgramByUuid(program.value).subscribe((prog) => {
             this.program = prog;
        },
        (error) => {
            console.log(error);
        });
        this.subscription.add(sub);
    }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
