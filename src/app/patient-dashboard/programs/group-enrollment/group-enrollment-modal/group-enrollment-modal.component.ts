import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { MatRadioChange } from '@angular/material';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { CommunityGroupService } from '../../../../openmrs-api/community-group-resource.service';
@Component({
    selector: 'group-enrollment-modal',
    templateUrl: './group-enrollment-modal.component.html',
    styleUrls: ['./group-enrollment-modal.component.css']
})
export class GroupEnrollmentModalComponent implements OnInit {
  public enrollmentType = 'existing';
  public searchResults;
  public onEnroll: Subject < any > = new Subject < any > ();
  public currentGroups: any[] = [];
  public action = 'Enroll';
  public selectedGroup;

  constructor(public modalRef: BsModalRef, private communityGroupService: CommunityGroupService) {}

  ngOnInit(): void {}

  public onEnrollmentTypeChange($event: MatRadioChange) {
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
    this.searchResults = results;
  }

  public enroll(formValue) {
    this.onEnroll.next(formValue);
  }

  public getAttribute(attributeType, attributes) {
    const attr = this.communityGroupService.getGroupAttribute(attributeType, attributes);
    if (attr) {
      return attr.value;
    }
    return '-';
  }
}
