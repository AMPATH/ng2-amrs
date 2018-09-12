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
        console.log(this.currentLeader);
        this.getProvider(this.communityGroupService.getGroupAttribute('provider', this.group.attributes));

    }



    constructor(private modalService: BsModalService,
        private communityGroupService: CommunityGroupService,
        private providerResourceService: ProviderResourceService,
        private locationService: LocationResourceService,
        private communityGroupMemberService: CommunityGroupMemberService,
        private communityGroupLeaderService: CommunityGroupLeaderService) { }

    ngOnInit(): void {
        this.locationService.getLocations().subscribe((results: any) => this.locations = results);
        this.fetchProviderOptions();
    }



    public getCurrentLeader(allLeaders: any[], allMembers: any[]) {
        let currentLeader = _.filter(allLeaders, (leader) => leader.endDate == null)[0];
        if (currentLeader) {
                currentLeader = this.generateLeaderObject(currentLeader, allMembers);
        }
        return currentLeader;
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
        console.log(currentLeader['leadershipType']);
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
            const v = 'custom:(uuid,name,person:(uuid,display,attributes)';
            this.subscription = this.providerResourceService.getProviderByUuid(providerUuid.value, false, v)
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
        console.log(value);
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
                },
                (error) => { console.log(error); });
            }
        } else {
            this.communityGroupLeaderService.addGroupLeader(this.group['uuid'], selectedLeaderUuid, new Date()).subscribe(
                (res) => console.log(res),
                (error) => console.log(error));
        }
    }


    public editGroupDetails(formValue, groupUuid: string) {
        const attr = [];
        if (formValue.attributes) {
            if (formValue.attributes.groupNumber !== this.groupNumber.value) {
                const obj =  {};
                obj['attributeType'] = this.groupNumber.cohortAttributeType.uuid;
                obj['value'] = formValue.attributes.groupNumber;
                obj['group'] = groupUuid;
                if (this.groupNumber) {
                    obj['uuid'] = this.groupNumber.uuid;
                }
                attr.push(obj);
            }
            if (formValue.attributes.landmark !== this.landmark.value) {
                    const obj =  {};
                    obj['attributeType'] = this.landmark.cohortAttributeType.uuid;
                    obj['value'] = formValue.attributes.landmark;
                    obj['group'] = groupUuid;
                    if (this.landmark) {
                        obj['uuid'] = this.landmark.uuid;
                    }
                    attr.push(obj);
            }
            if (formValue.attributes.provider !== this.provider.uuid) {
                    const obj =  {};
                    const providerAttr = this.communityGroupService.getGroupAttribute('provider', this.group.attributes);
                    obj['attributeType'] = providerAttr.cohortAttributeType.uuid;
                    obj['value'] = formValue.attributes.provider;
                    obj['group'] = groupUuid;
                    if (providerAttr) {
                        obj['uuid'] = providerAttr.uuid;
                }
                attr.push(obj);

            }
        }
        this.communityGroupService.updateGroup(groupUuid, formValue['name'], formValue['location'], attr)
        .subscribe((res) => {
            this.modalRef.hide();
            console.log('RESPONSE', res);
            this.showSuccessModal('Successfully updated cohort details for ' + this.group.name);
        }, (error) => console.log(error));
    }


  public fetchProviderOptions(term: string = null) {
    if (!_.isNull(term)) {
      this.providers = [];
      this.providerLoading = true;
    }

    const findProvider = this.providerResourceService.searchProvider(term, false);
    findProvider.subscribe(
      (providers) => {
        this.processProviders(providers);
      },
      (error) => {
        console.error(error); // test case that returns error
      }
    );
    return findProvider;
  }

    private processProviders(providers) {
        this.providerLoading = false;
        const filteredProviders = _.filter(providers, (p: any) => !_.isNil(p.person));
        this.providers = filteredProviders;
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

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
