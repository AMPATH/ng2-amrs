import {Component, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import { PatientService } from '../services/patient.service';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { Subscription, of } from 'rxjs';
import * as _ from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import {SuccessModalComponent} from '../../group-manager/modals/success-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDefaultPropertiesService } from '../../user-default-properties';

@Component({
    selector: 'group-enrollment-summary-component',
    templateUrl: './group-enrollment-summary.component.html',
    styleUrls: ['./group-enrollment-summary.component.css']
})
export class GroupEnrollmentSummaryComponent implements OnInit, OnDestroy {

  public departmentConf = require('../../program-visit-encounter-search/department-programs-config.json');
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
  modalState: any;
  reloadCount = 0;

  @ViewChild('transferGroupModal') public transferGroupModal: BsModalRef;
  @ViewChild('enrollModal') public enrollModal: BsModalRef;
  enrolledPrograms = [];

  constructor(private patientService: PatientService,
    private groupResouceService: CommunityGroupService,
    private groupMemberService: CommunityGroupMemberService,
    private modalService: BsModalService,
    private propertiesDefaultService: UserDefaultPropertiesService,
    private router: Router,
    private route: ActivatedRoute) {}

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
        if (patient) {
          this.enrolledPrograms = _.filter(patient.enrolledPrograms, (program) => program.isEnrolled);
          return this.getPatientGroups(patient.uuid);
        }
        return of(null);
      })
      .subscribe(
        (res) => {
          if (!_.isNull(res)) {
            console.log(res);
            this.groups = res;
            this.getGroupsPrograms();
            this.getCurrentGroupEnrollments();
            this.loading = false;
            this.route.queryParams.subscribe((queryParams) => {
              if (queryParams['referral'] && this.reloadCount === 0) {
                this.showEnrollModal(this.enrollModal);
              }
            });
            this.reloadCount++;
          }
        },
        (error) => console.log(error));
    this.subscription.add(sub);

  }

  public showTransferModal(selectedGroup, modal) {
    this.modalState = {
      currentGroups: this.currentGroups,
      action: 'Transfer',
      selectedGroup: selectedGroup,
      currentEnrolledPrograms: this.enrolledPrograms,
      patient: this.patient
    };
    this.modalRef = this.modalService.show(modal, {
      backdrop: 'static',
      class: 'modal-lg',
    });
  }

  public showEnrollModal(modal) {
    this.modalState = {
      action: 'Enroll',
      currentGroups: this.currentGroups,
      currentEnrolledPrograms: this.enrolledPrograms,
      patient: this.patient
    };
    this.modalRef = this.modalService.show(modal, {
      backdrop: 'static',
      class: 'modal-lg'
    });
  }

  public onEnroll(group) {
      console.log(group, 'on enroll');
      this.loadData();
      this.showSuccessModal(`Successfully enrolled to ${group.name}`);
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

  navigateToGroup(groupUuid: string) {
    const locationUuid = this.propertiesDefaultService.getCurrentUserDefaultLocationObject()['uuid'];
    this.router.navigate(['/clinic-dashboard/' + locationUuid + '/general/group-manager/group/' + groupUuid]);
  }

}
