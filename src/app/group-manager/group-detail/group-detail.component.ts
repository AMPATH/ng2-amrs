import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../group-model';
import {CommunityGroupService} from '../../openmrs-api/community-group-resource.service';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { DatePickerModalComponent } from '../modals/date-picker-modal.component';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import { SuccessModalComponent } from '../modals/success-modal.component';
import * as _ from 'lodash';

@Component({
  selector: 'group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})

export class GroupDetailComponent implements OnInit, OnDestroy {

  public group: Group;
  public members: any;
  public modalRef: BsModalRef;
  public nestedModalRef: BsModalRef;
  public subscription: Subscription;
  public isFiltered = true;


  constructor(private activatedRoute: ActivatedRoute,
    private communityGroupService: CommunityGroupService,
    private communityGroupMemberService: CommunityGroupMemberService,
    private modalService: BsModalService) {}

  ngOnInit() {
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.subscription = this.communityGroupService.getGroupByUuid(uuid).subscribe((res) => {
      this.group = res;
      this.members = this.filterCurrent();
    });
  }

  public reloadData() {
    this.subscription = this.communityGroupService.getGroupByUuid(this.group.uuid).subscribe((res) => {
      this.group = res;
    });
  }

  public showSuccessModal(successMsg: string) {
    const initialState = {
      successMsg
    };
    this.nestedModalRef = this.modalService.show(SuccessModalComponent, {
      initialState
    });
  }


  public showDateModal(member: any, title ?: string, okBtnText ?: string, closeBtnText ?: string) {
    const initialState = {
      label: 'Select Date',
      okBtnText: okBtnText || 'OK',
      closeBtnText: closeBtnText || 'Cancel',
      title: title
    };
    this.nestedModalRef = this.modalService.show(DatePickerModalComponent, {
      initialState
    });
    this.nestedModalRef.content.onSave.subscribe((date) => {
      this.modalRef.hide();
      this.endMembership(member, date);
    });
  }

  public showModal(templateRef: TemplateRef < any > ) {
    this.modalRef = this.modalService.show(templateRef, {
      animated: true
    });
  }

  public endMembership(member, date) {
    const successMsg = `Successfully ended membership for ${member.patient.person.display} on ${Moment(date).format('DD MMMM YYYY')}`;
    this.subscription = this.communityGroupMemberService.endMembership(member.uuid, date).subscribe(
      (response) => {
        this.reloadData();
        this.showSuccessModal(successMsg);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public filterCurrent() {
    this.isFiltered = true;
    return _.filter(this.group.cohortMembers, (member) => member.endDate == null);
  }

  public removeFilter() {
    this.isFiltered = false;
    this.members = this.group.cohortMembers;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onGroupDetailsChanged(updatedGroup) {
    this.group = updatedGroup;
  }

}
