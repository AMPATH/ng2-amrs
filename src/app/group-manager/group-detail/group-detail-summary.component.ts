import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Group } from '../group-model';
import * as _ from 'lodash';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { Subscription, combineLatest, Subject } from 'rxjs';
import { CommunityGroupLeaderService } from '../../openmrs-api/community-group-leader-resource.service';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { DatePickerModalComponent } from '../modals/date-picker-modal.component';
import { SuccessModalComponent } from '../modals/success-modal.component';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Patient } from '../../models/patient.model';
import { AbstractControl } from '@angular/forms';
import { Person } from '../../models/person.model';

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
  leaderContactsForm: FormGroup;
  selectedLeadershipType: any;
  contacts: FormControl;
  staff: FormControl;
  peers: FormControl;
  staffLeadership: FormControl;
  peerLeadership: FormControl;
  public leadershipType: string;
  public state: any;
  public group: Group;
  public groupNumber: any;
  public landmark: any;
  public groupActivity: any;
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
  public activeMembers: any[];
  @Output() updatedGroup: EventEmitter<any> = new EventEmitter();
  public currentMonth = Moment().month() + 1;
  public providerSuggest: Subject<any> = new Subject();
  public editLeaderForm: FormGroup;
  public validOTZProgram = false;
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
    this.groupNumber = this.communityGroupService.getGroupAttribute(
      'groupNumber',
      this.group.attributes
    );
    this.activeMembers = _.filter(
      group.cohortMembers,
      (member) => !member.endDate
    ).map((member) => new Patient(member.patient));
    this.landmark = this.communityGroupService.getGroupAttribute(
      'landmark',
      this.group.attributes
    );
    this.groupActivity = this.communityGroupService.getGroupAttribute(
      'groupActivity',
      this.group.attributes
    );
    this.currentLeader = this.getCurrentLeader(
      group.cohortLeaders,
      group.cohortMembers
    );
    this.selectedLeader = this.currentLeader;
    this.getProgram(
      this.communityGroupService.getGroupAttribute(
        'programUuid',
        this.group.attributes
      )
    );
    this.getProvider(
      this.communityGroupService.getGroupAttribute(
        'provider',
        this.group.attributes
      )
    );
  }

  constructor(
    private modalService: BsModalService,
    private communityGroupService: CommunityGroupService,
    private providerResourceService: ProviderResourceService,
    private programService: ProgramResourceService,
    private fb: FormBuilder,
    private communityGroupMemberService: CommunityGroupMemberService,
    private communityGroupLeaderService: CommunityGroupLeaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initProviderTypeAhead();
    if (this.currentLeader) {
      this.initEditLeaderForm();
    }
  }

  public initProviderTypeAhead() {
    const v =
      'custom:(person:(uuid,display,attributes:(attributeType:(uuid),value,display)),uuid)';
    this.providerSuggest
      .pipe(
        debounceTime(350),
        switchMap((term: string) =>
          this.providerResourceService.searchProvider(term, false, v)
        )
      )
      .subscribe((data) => {
        this.processProviders(data);
      });
  }

  public initEditLeaderForm() {
    const staffleader = new FormControl(
      this.currentLeader.person.uuid,
      Validators.required
    );
    const peerleader = new FormControl(
      this.currentLeader.person.uuid,
      Validators.required
    );
    const leaderContacts = new FormControl(
      this.currentLeader.person.patientPhoneNumber
    );
    this.selectedLeadershipType = this.leadershipType;
    leaderContacts.disable();
    this.initContactsForm(this.currentLeader);

    this.editLeaderForm = new FormGroup({
      leadershipType: new FormControl(this.leadershipType, [
        Validators.required
      ]),
      contacts: leaderContacts
    });

    if (this.leadershipType === PEER) {
      this.editLeaderForm.addControl('peer', peerleader);
      this.listenToPeerLeaderControlChanges();
    } else {
      this.editLeaderForm.addControl('staff', staffleader);
      this.providers.push(this.currentLeader.person);
      this.listenToStaffLeaderControlChanges();
    }

    this.editLeaderForm.controls['leadershipType'].valueChanges.subscribe(
      (type) => {
        this.selectedLeadershipType = type;
        if (type === PEER) {
          this.editLeaderForm.addControl('peer', peerleader);
          this.listenToPeerLeaderControlChanges();
          if (this.editLeaderForm.controls['staff']) {
            this.editLeaderForm.removeControl('staff');
          }
          if (
            this.leadershipType === PEER &&
            this.editLeaderForm.controls['peer'].value ===
              this.currentLeader.person.uuid
          ) {
            this.editLeaderForm.controls['contacts'].patchValue(
              this.currentLeader.person.patientPhoneNumber
            );
          } else {
            this.editLeaderForm.controls['contacts'].patchValue('');
          }
        } else {
          this.editLeaderForm.addControl('staff', staffleader);
          this.listenToStaffLeaderControlChanges();
          if (this.editLeaderForm.controls['peer']) {
            this.editLeaderForm.removeControl('peer');
          }
          if (
            this.leadershipType === STAFF &&
            this.editLeaderForm.controls['staff'].value ===
              this.currentLeader.person.uuid
          ) {
            this.editLeaderForm.controls['contacts'].patchValue(
              this.currentLeader.person.patientPhoneNumber
            );
          } else {
            this.editLeaderForm.controls['contacts'].patchValue('');
          }
        }
        this.editLeaderForm.updateValueAndValidity();
      }
    );
  }

  get peerLeaderOptions() {
    return this.editLeaderForm.get('peer') as FormControl;
  }

  get staffLeaderOptions() {
    return this.editLeaderForm.get('staff') as FormControl;
  }

  private listenToStaffLeaderControlChanges() {
    this.subscription.add(
      this.editLeaderForm.get('staff').valueChanges.subscribe((newValue) => {
        if (newValue) {
          const provider = _.find(
            this.providers,
            ($provider) => $provider.uuid === newValue
          );
          this.editLeaderForm.controls['contacts'].patchValue(
            provider.person.patientPhoneNumber
          );
          this.selectedLeader = provider;
          this.initContactsForm(provider);
        }
      })
    );
  }

  private listenToPeerLeaderControlChanges() {
    this.subscription.add(
      this.editLeaderForm.get('peer').valueChanges.subscribe((newValue) => {
        const member = _.find(
          this.activeMembers,
          ($member) => $member.uuid === newValue
        );
        this.editLeaderForm.controls['contacts'].patchValue(
          member.person.patientPhoneNumber
        );
        this.selectedLeader = member;
        this.initContactsForm(member);
      })
    );
  }

  public initContactsForm(leader: Patient) {
    const validators = [
      Validators.pattern(this.r1),
      Validators.pattern(this.r2),
      Validators.maxLength(15),
      Validators.minLength(10)
    ];
    this.leaderContactsForm = new FormGroup({
      patientPhoneNumber: new FormControl(
        leader.person.patientPhoneNumber,
        validators
      ),
      alternativePhoneNumber: new FormControl(
        leader.person.alternativePhoneNumber,
        validators
      ),
      nextofkinPhoneNumber: new FormControl(
        leader.person.nextofkinPhoneNumber,
        validators
      ),
      partnerPhoneNumber: new FormControl(
        leader.person.partnerPhoneNumber,
        validators
      )
    });
  }

  private processProviders(providers) {
    this.providerLoading = false;
    const filteredProviders = _.filter(
      providers,
      (p: any) => !_.isNil(p.person)
    );
    this.providers = filteredProviders
      .map((provider) => (provider.person['person'] = provider.person))
      .map((provider) => new Patient(provider.person));
  }

  public getCurrentLeader(allLeaders: any[], allMembers: any[]) {
    let currentLeader = _.filter(
      allLeaders,
      (leader) => leader.endDate == null
    )[0];
    if (currentLeader) {
      currentLeader = this.generateLeaderObject(currentLeader, allMembers);
    }
    return currentLeader;
  }

  public get inactiveLeaders() {
    return _.filter(
      this.group.cohortLeaders,
      (leader) => leader.endDate !== null
    );
  }

  public reloadData() {
    const sub = this.communityGroupService
      .getGroupByUuid(this.group.uuid)
      .subscribe((group) => {
        this.group = group;
        this.updatedGroup.emit(this.group);
        this.activeMembers = _.filter(
          group.cohortMembers,
          (member) => !member.endDate
        );
        this.groupNumber = this.communityGroupService.getGroupAttribute(
          'groupNumber',
          this.group.attributes
        );
        this.landmark = this.communityGroupService.getGroupAttribute(
          'landmark',
          this.group.attributes
        );
        this.groupActivity = this.communityGroupService.getGroupAttribute(
          'groupActivity',
          this.group.attributes
        );
        this.currentLeader = this.getCurrentLeader(
          group.cohortLeaders,
          group.cohortMembers
        );
        this.getProvider(
          this.communityGroupService.getGroupAttribute(
            'provider',
            this.group.attributes
          )
        );
        this.initEditLeaderForm();
      });
    this.subscription.add(sub);
  }

  public generateLeaderObject(leader, allMembers = []) {
    let currentLeader = {};
    const leaderUuid = leader.uuid;
    const startDate = leader.startDate;
    if (leader.patient) {
      leader = leader.patient;
    }
    if (leader.person.person) {
      leader = leader.person;
    }
    currentLeader = new Patient(leader);
    currentLeader['leaderUuid'] = leaderUuid;
    currentLeader['startDate'] = startDate || new Date();
    this.leadershipType = this.getLeadershipType(
      leader.person.uuid,
      allMembers
    );
    return currentLeader;
  }

  public getLeadershipType(currentLeaderPersonUuid, cohortMembers) {
    let type = '';
    let match = [];
    if (cohortMembers.length > 0) {
      match = _.find(
        cohortMembers,
        (member) => currentLeaderPersonUuid === member.patient.person.uuid
      );
    }
    _.isEmpty(match) ? (type = STAFF) : (type = PEER);
    return type;
  }

  public getContacts(attributeTypeUuid: string, attributes: any[]) {
    return _.filter(
      attributes,
      (attribute) => attribute.attributeType.uuid === attributeTypeUuid
    )[0];
  }

  public showSuccessModal(successMsg: string) {
    const initialState = {
      successMsg
    };
    this.modalRefNested = this.modalService.show(SuccessModalComponent, {
      initialState
    });
    setTimeout(() => {
      this.modalRefNested.hide();
    }, 2500);
  }

  public getProvider(providerUuid) {
    if (providerUuid) {
      const v =
        'custom:(person:(uuid,display,attributes:(attributeType:(uuid),value,display)),uuid)';
      const sub = this.providerResourceService
        .getProviderByPersonUuid(providerUuid.value, v)
        .subscribe((provider) => {
          this.provider = provider;
        });
      this.subscription.add(sub);
    }
  }

  public showModal(modal: TemplateRef<any>) {
    if (this.currentLeader) {
      this.initEditLeaderForm();
    }
    this.modalRef = this.modalService.show(modal, { class: 'modal-lg' });
  }

  public showNestedModal(modal: TemplateRef<any>) {
    this.modalRefNested = this.modalService.show(modal, { class: 'second' });
  }

  public resetLeader(group) {
    this.modalRef.hide();
    this.currentLeader = this.getCurrentLeader(
      group.cohortLeaders,
      group.cohortMembers
    );
  }

  public onLeaderSelected(uuid, members) {
    const selectedPeerLeader = _.filter(
      members,
      (member) => member.patient.person['uuid'] === uuid
    )[0];
    if (selectedPeerLeader) {
      this.currentLeader = this.generateLeaderObject(
        selectedPeerLeader,
        members
      );
    }
  }

  public onLeadershipTypeChanged(event) {
    if (event.value === STAFF) {
      this.currentLeader = this.generateLeaderObject(this.provider);
    } else {
      this.currentLeader = this.getCurrentLeader(
        this.group.cohortLeaders,
        this.group.cohortMembers
      );
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
    const sub = this.communityGroupLeaderService
      .addGroupLeader(this.group.uuid, personUuid, new Date())
      .subscribe((res) => {
        this.showSuccessModal('Successfully added group leader');
        this.reloadData();
      });
    this.subscription.add(sub);
  }
  public disbandGroup(date, reason) {
    this.modalRef.hide();
    const sub = this.communityGroupService
      .disbandGroup(this.group.uuid, date, reason)
      .subscribe((res) => {
        this.showSuccessModal(
          'Group has been successfully disbanded and all members have been removed.'
        );
        this.group = res;
        this.updatedGroup.emit(this.group);
      });
    this.subscription.add(sub);
  }

  public updateContacts(selectedLeader: any, formValue: any) {
    console.log(formValue);
    console.log(this.leaderContactsForm.value);
    this.modalRefNested.hide();
    const requests = [];
    const contactTypes = Object.keys(formValue);
    _.forEach(contactTypes, (contactType) => {
      const attributeTypeUuid = this.getContactAttributeTypeUuid(contactType);
      console.log(contactType, formValue[contactType]);
      console.log(contactType, selectedLeader.person[contactType]);
      if (formValue[contactType] !== selectedLeader.person[contactType]) {
        requests.push(
          this.createAttribute(
            selectedLeader.person.uuid,
            attributeTypeUuid,
            formValue[contactType]
          )
        );
      }
    });
    const sub = combineLatest(requests).subscribe(
      (updatedContacts) => {
        this.showSuccessModal(
          `Successfully update contacts for ${selectedLeader.person.display}`
        );
        this.updateContactsUIState(updatedContacts, selectedLeader);
      },
      (error) => {
        console.log(error);
      }
    );
    this.subscription.add(sub);
  }

  public showUpdateGroupModal(modal) {
    let program = null;
    let provider = null;
    this.program
      ? (program = this.program)
      : (program = { name: null, value: null });
    this.provider
      ? (provider = this.provider)
      : (provider = { person: { display: null, uuid: null } });
    this.state = {
      editType: 'Edit',
      groupName: this.group.name,
      groupNo: this.groupNumber.value,
      facility: {
        label: this.group.location['display'],
        value: this.group.location['uuid']
      },
      groupType: {
        label: this.group.cohortType['name'],
        value: this.group.cohortType['uuid']
      },
      groupProgram: { label: program['name'], value: program['uuid'] },
      provider: { label: provider.person.display, value: provider.person.uuid },
      address: this.landmark.value,
      groupActivity: this.groupActivity.value,
      groupUuid: this.group.uuid,
      actionButtonText: 'Save Changes'
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
      const number = contact.value;
      switch (contact.attributeType.uuid) {
        case PRIMARY_CONTACTS:
          leader['patientPhoneNumber'] = number;
          this.editLeaderForm.controls['contacts'].patchValue(number);
          if (this.currentLeader.person.uuid === leader.person.uuid) {
            this.updateLeaderPhoneNumber(contact);
          }
          break;
        case SPOUSE_CONTACTS:
          leader['partnerPhoneNumber'] = number;
          break;
        case ALT_CONTACTS:
          leader['alternativePhoneNumber'] = number;
          break;
        case NEXT_OF_KIN_CONTACTS:
          leader['nextofkinPhoneNumber'] = number;
          break;
      }
    });
    return this.selectedLeader;
  }

  public updateLeaderPhoneNumber(contact) {
    const person = this.currentLeader.person;
    const index = _.findIndex(
      person.attributes,
      (attribute: any) =>
        attribute.attributeType.uuid === contact.attributeType.uuid
    );
    if (_.isNumber(index)) {
      person.attributes[index] = contact;
    } else {
      person.attributes.push(contact);
    }
    this.currentLeader.person = new Person(person);
  }

  public getContactAttributeTypeUuid(contactType: string) {
    switch (contactType) {
      case 'alternativePhoneNumber':
        return ALT_CONTACTS;
      case 'patientPhoneNumber':
        return PRIMARY_CONTACTS;
      case 'partnerPhoneNumber':
        return SPOUSE_CONTACTS;
      case 'nextofkinPhoneNumber':
        return NEXT_OF_KIN_CONTACTS;
    }
  }

  public updateAttribute(
    personUuid: string,
    attributeUuid: string,
    value: any
  ) {
    return this.communityGroupMemberService.updatePersonAttribute(
      personUuid,
      attributeUuid,
      value
    );
  }

  public createAttribute(
    personUuid: string,
    attributeTypeUuid: string,
    value: any
  ) {
    return this.communityGroupMemberService.createPersonAttribute(
      personUuid,
      attributeTypeUuid,
      value
    );
  }

  public updateGroupLeader(formValue: any) {
    const selectedLeaderUuid = formValue['peer'] || formValue['staff'];
    this.modalRef.hide();
    if (this.currentLeader) {
      if (this.currentLeader.person['uuid'] !== selectedLeaderUuid) {
        const sub = this.communityGroupLeaderService
          .updateGroupLeader(
            this.group['uuid'],
            this.currentLeader['leaderUuid'],
            selectedLeaderUuid
          )
          .subscribe(
            (res) => {
              this.showSuccessModal(
                'Successfully changed leader for ' + this.group.name
              );
              this.reloadData();
            },
            (error) => {
              console.log(error);
            }
          );
        this.subscription.add(sub);
      }
    } else {
      const sub = this.communityGroupLeaderService
        .addGroupLeader(this.group['uuid'], selectedLeaderUuid, new Date())
        .subscribe(
          (res) => this.reloadData(),
          (error) => console.log(error)
        );
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
    this.modalRef = this.modalService.show(DatePickerModalComponent, {
      initialState
    });
  }

  public activateGroup(group: any) {
    const sub = this.communityGroupService.activateGroup(group.uuid).subscribe(
      (res) => {
        this.showSuccessModal('Successfully reactivated group.');
        this.group = res;
        this.updatedGroup.emit(this.group);
      },
      (error) => console.log(error)
    );
    this.subscription.add(sub);
  }

  public getProgram(program: any) {
    if (program) {
      const sub = this.programService.getProgramByUuid(program.value).subscribe(
        (prog) => {
          this.program = prog;
          if (this.program.name === 'OTZ PROGRAM') {
            this.validOTZProgram = true;
          }
        },
        (error) => {
          console.log(error);
        }
      );
      this.subscription.add(sub);
    }
  }

  public navigateBack() {
    this.router.navigate([
      `/clinic-dashboard/${this.group.location.uuid}/hiv/group-manager`
    ]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
