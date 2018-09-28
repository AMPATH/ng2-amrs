import {Component, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { CommunityGroupMemberService } from '../../../openmrs-api/community-group-member-resource.service';
import { CommunityGroupService } from '../../../openmrs-api/community-group-resource.service';
import { Subscription, of } from 'rxjs';
import * as _ from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { GroupEnrollmentModalComponent } from './group-enrollment-modal/group-enrollment-modal.component';
import {SuccessModalComponent} from '../../../group-manager/modals/success-modal.component';

@Component({
    selector: 'group-enrollment-component',
    templateUrl: './group-enrollment.component.html',
    styleUrls: ['./group-enrollment.component.css']
})
export class GroupEnrollmentComponent implements OnInit, OnDestroy {

  public departmentConf = require('../../../program-visit-encounter-search/department-programs-config.json');
  subscription: Subscription = new Subscription();
  groups: any[];
  patient: any;
  loading: boolean;
  currentGroups: any[] = [];
  historicalGroups: any[] = [];
  modalRef: BsModalRef;
  busy: Subscription;
  groupToUnenroll: any;
  groupToEnroll: any;

  @ViewChild('transferGroupModal') transferGroupModal: BsModalRef;

  constructor(private patientService: PatientService,
    private groupResouceService: CommunityGroupService,
    private groupMemberService: CommunityGroupMemberService,
    private modalService: BsModalService) {}

  ngOnInit(): void {
    this.loadData();
  }



  getPatientGroups(patientUuid: string) {
    return this.groupMemberService.getMemberCohortsByPatientUuid(patientUuid);
  }

  public getGroupsPrograms() {
    _.forEach(this.groups, (group) => {
      const programUuid = this.groupResouceService.getGroupAttribute('programUuid', group.cohort.attributes);
      if (programUuid) {
        _.forEach(this.departmentConf, (department) => {
          const programs = department.programs;
          _.forEach(programs, (program) => {
            if (_.isEqual(programUuid.value, program.uuid)) {
              group['program'] = program;
            }
          });
        });
      }
    });
  }

  public getCurrentGroupEnrollments() {
    this.currentGroups = [];
    this.historicalGroups = [];
    _.forEach(this.groups, (group) => {
      if (!group.endDate) {
        this.currentGroups.push(group);
      } else {
        this.historicalGroups.push(group);
      }
    });
  }

  public exitGroup() {
    this.modalRef.hide();
    this.subscription.add(this.groupMemberService.endMembership(this.groupToUnenroll.uuid, new Date())
      .subscribe((updatedMember) => this.loadData()));
  }

  public loadData() {
    this.loading = true;
    const sub = this.patientService.currentlyLoadedPatient
      .flatMap((patient) => {
        this.patient = patient;
        return patient ? this.getPatientGroups(patient.uuid) : of (null);
      })
      .subscribe(
        (res) => {
          if (!_.isNull(res)) {
            this.groups = res;
            this.getGroupsPrograms();
            this.getCurrentGroupEnrollments();
            this.loading = false;
          }
        },
        (error) => console.log(error));
    this.subscription.add(sub);

  }

  public showTransferModal(selectedGroup) {
    const modalInitialState = {
      currentGroups: this.currentGroups,
      action: 'Transfer',
      selectedGroup: selectedGroup
    };
    this.modalRef = this.modalService.show(GroupEnrollmentModalComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: modalInitialState
    });
    this.modalRef.content.onEnroll.subscribe((group) => {
      this.modalRef.hide();
      this.transferGroup(selectedGroup, group);
    });
  }

  public showEnrollModal() {
    const modalInitialState = {
      action: 'Enroll'
    };
    this.modalRef = this.modalService.show(GroupEnrollmentModalComponent, {
      backdrop: 'static',
      class: 'modal-lg',
      initialState: modalInitialState
    });
    this.modalRef.content.onEnroll.flatMap((group) => {
      this.modalRef.hide();
      const existingGroupInProgram = this.isPatientEnrolledInGroupInSameProgram(group);
      if (existingGroupInProgram) {
        this.groupToUnenroll = existingGroupInProgram;
        this.groupToEnroll = group;
        this.modalRef = this.modalService.show(this.transferGroupModal);
        return of([]);
      } else {
        return this.enrollMember(group);
      }
    }).subscribe((group) => {
      if (group) {
        this.loadData();
        this.showSuccessModal(`Successfully enrolled ${group.patient.person.display} to ${group.name}`);
      }
      },
      (error) => console.log(error));
  }

  public isPatientEnrolledInGroupInSameProgram(group) {
    let check = null;
    const program = _.filter(group.attributes, (attribute) => attribute.cohortAttributeType.name === 'programUuid')[0];
    if (program) {
    _.forEach(this.currentGroups, (currentGroup) => {
      if (currentGroup.program) {
        if (currentGroup.program.uuid === program.value) {
          check = currentGroup;
        }
      }
    });
  }
    return check;
  }

  /**
   * Transfers the patient from the selected group to a new group
   * @param currentGroup the group to un enroll the patient from
   * @param newGroup the group to enroll the patient to
   */
  public transferGroup(currentGroup, newGroup) {
    this.loading = true;
    this.unEnrollMember(currentGroup.uuid)
      .flatMap((res) => this.enrollMember(newGroup))
      .subscribe((finalResults) => {
          this.loadData();
          this.showSuccessModal(`Successfully enrolled ${currentGroup.patient.person.display} to ${newGroup.name}`);
        },
        (error) => console.log(error));
  }

  public unEnrollMember(memberUuid: string) {
    this.loading = true;
    return this.groupMemberService.endMembership(memberUuid, new Date());
  }

  public enrollMember(group) {
    this.loading = true;
    return this.groupMemberService.createMember(group.uuid, this.patient.uuid);
  }

  public showSuccessModal(msg: string) {
    const modalInitialState = {
      successMsg: msg
    };
    this.modalService.show(SuccessModalComponent, {
      initialState: modalInitialState
    });
  }

  public showUnEnrollModal(modal: TemplateRef < any > , group: any) {
    this.groupToUnenroll = group;
    this.modalRef = this.modalService.show(modal, {
      backdrop: 'static'
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
