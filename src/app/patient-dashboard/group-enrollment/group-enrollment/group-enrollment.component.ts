import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { CommunityGroupService } from '../../../openmrs-api/community-group-resource.service';
import { MatRadioChange } from '@angular/material';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import * as _ from 'lodash';
import { CommunityGroupMemberService } from '../../../openmrs-api/community-group-member-resource.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { combineLatest, Subscription } from 'rxjs';
import { RisonService } from './../../../shared/services/rison-service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'group-enrollment',
  templateUrl: './group-enrollment.component.html',
  styleUrls: ['./group-enrollment.component.css']
})
export class GroupEnrollmentComponent implements OnInit, OnDestroy {
  hideResults: boolean;
  modalRef: BsModalRef;
  groupToEnroll: any;
  groupToUnenroll: any;
  public enrollmentType = 'existing';
  public searchResults;
  public selectedGroup;
  public errorMessage;
  public loading: boolean;
  public subscription: Subscription = new Subscription();
  @Input() public currentGroups: any[] = [];
  @Input() public currentEnrolledPrograms: any[] = [];
  @Input() public action = 'Enroll'; // can be enroll/transfer
  @Input() public patient: any;

  @Output() hide: EventEmitter<boolean> = new EventEmitter();
  @Output() group: EventEmitter<any> = new EventEmitter();
  @Input() public set state(state: any) {
    this.currentGroups = state ? state.currentGroups : [];
    this.currentEnrolledPrograms = state ? state.currentEnrolledPrograms : [];
    this.action = state ? state.action : 'Enroll';
    this.patient = state ? state.patient : '';
    this.selectedGroup = state ? state.selectedGroup : '';
    this.getGroupsPrograms();
  }
  @ViewChild('transferGroupConfirmationModal') transferGroupConfirmationModal;
  public departmentConf = require('../../../program-visit-encounter-search/department-programs-config.json');

  constructor(
    private communityGroupService: CommunityGroupService,
    private groupMemberService: CommunityGroupMemberService,
    private modalService: BsModalService,
    private router: Router,
    private risonService: RisonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  public getGroupsPrograms() {
    _.forEach(this.currentGroups, (group) => {
      const programUuid = this.communityGroupService.getGroupAttribute(
        'programUuid',
        group.cohort.attributes
      );
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

  public onEnrollmentTypeChange($event: MatRadioChange) {
    let enrolledInDc = false;
    let enrolledInOtz = false;
    _.forEach(this.currentEnrolledPrograms, (currentProgram) => {
      if (
        currentProgram.programUuid === '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
      ) {
        enrolledInDc = true;
      } else if (
        currentProgram.programUuid === '203571d6-a4f2-4953-9e8b-e1105e2340f5'
      ) {
        enrolledInOtz = true;
      }
    });

    if (!enrolledInDc) {
      this.errorMessage = `Patient needs to be enrolled in DC program first.`;
    } else if (!enrolledInOtz) {
      this.errorMessage = `Patient needs to be enrolled in OTZ program first.`;
    }
    this.enrollmentType = $event.value;
  }

  public onResults(results) {
    _.forEach(results, (result) => {
      _.forEach(this.currentGroups, (currentGroup) => {
        if (result.uuid === currentGroup.cohort.uuid) {
          result['currentlyEnrolled'] = true;
        }
      });
    });
    this.searchResults = _.filter(
      results,
      (result) =>
        this.currentEnrolledPrograms
          .map((program) => program.programUuid)
          .indexOf(this.getAttribute('programUuid', result.attributes)) > -1
    );
    if (
      this.currentEnrolledPrograms &&
      this.searchResults.length === 0 &&
      results.length > 0
    ) {
      this.errorMessage = `Patient needs to be enrolled in DC program first.`;
    } else {
      this.errorMessage = null;
    }
  }

  public enroll(group) {
    if (this.action.toLowerCase() === 'enroll') {
      const existingGroupInProgram = this.isPatientEnrolledInGroupInSameProgram(
        group
      );
      if (existingGroupInProgram) {
        this.groupToUnenroll = existingGroupInProgram;
        this.groupToEnroll = group;
        this.modalRef = this.modalService.show(
          this.transferGroupConfirmationModal
        );
      } else {
        this.subscription.add(
          this.enrollMember(group).subscribe(
            (res) => {
              this.group.emit(group);
              this.hide.emit(true);
            },
            (error) => {
              this.errorMessage = error.error.message;
            }
          )
        );
      }
    } else {
      this.transferGroup(this.selectedGroup, group);
    }
  }

  public getAttribute(attributeType, attributes) {
    const attr = this.communityGroupService.getGroupAttribute(
      attributeType,
      attributes
    );
    if (attr) {
      return attr.value;
    }
    return '-';
  }

  public transferGroup(currentGroup, newGroup) {
    this.loading = true;
    this.subscription.add(
      this.unEnrollMember(currentGroup.uuid)
        .flatMap((res) => this.enrollMember(newGroup))
        .subscribe(
          (response) => {
            this.group.emit(newGroup);
            if (this.modalRef) {
              this.modalRef.hide();
            }
            this.hide.emit(true);
          },
          (error) => console.log(error)
        )
    );
  }

  public isPatientEnrolledInGroupInSameProgram(group) {
    let check = null;
    const program = _.filter(
      group.attributes,
      (attribute) => attribute.cohortAttributeType.name === 'programUuid'
    )[0];
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

  public unEnrollMember(memberUuid: string) {
    this.loading = true;
    return this.groupMemberService.endMembership(memberUuid, new Date());
  }

  public enrollMember(group) {
    this.loading = true;
    return this.groupMemberService.createMember(group.uuid, this.patient.uuid);
  }

  public hideSearchResults(event) {
    if (event) {
      this.hideResults = true;
    } else {
      this.hideResults = false;
    }
  }

  public hideComponent() {
    this.hide.emit(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public enrollPatienttoProgram() {
    this.hide.emit(true);
    const enrollMentUrl = [
      'patient-dashboard',
      'patient',
      this.patient.uuid,
      'general',
      'general',
      'program-manager',
      'new-program',
      'step',
      3
    ];

    const queryParams = {
      program: '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      redirectUrl: this.router.url,
      enrollMentQuestions: this.risonService.encode({
        hivStatus: 'positive',
        enrollPatient: true
      })
    };

    this.router.navigate(enrollMentUrl, {
      queryParams: queryParams
    });
  }
}
