import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy
} from '@angular/core';
import * as _ from 'lodash';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';
import { DatePickerModalComponent } from '../modals/date-picker-modal.component';
import { Group } from '../../models/group.model';
import { ToastrFunctionService } from 'src/app/shared/services/toastr-function.service';

@Component({
  selector: 'group-manager-search-results',
  templateUrl: './group-manager-search-results.component.html',
  styleUrls: ['./group-manager-search-results.component.css']
})
export class GroupManagerSearchResultsComponent implements OnInit, OnDestroy {
  public _groups: Group[];
  public modalRef: BsModalRef;
  public selectedGroup: Group;
  public subscription: Subscription = new Subscription();
  @Input() set groups(groups: any) {
    this._groups = groups.map((group) => new Group(group));
  }
  @Output() groupSelected: EventEmitter<string> = new EventEmitter();
  @ViewChild('successModal') public successModal: BsModalRef;

  public endDate = {
    date: {
      year: Moment().year(),
      month: Moment().month(),
      day: Moment().date()
    },
    jsdate: new Date()
  };

  constructor(
    private communityGroupService: CommunityGroupService,
    private modalService: BsModalService,
    private toastrService: ToastrFunctionService
  ) {}

  ngOnInit(): void {}

  public selectGroup(groupUuid: string) {
    this.groupSelected.emit(groupUuid);
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

  public showDisbandDateModal(
    group: any,
    title: string,
    okBtnText?: string,
    closeBtnText?: string
  ) {
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
      this.disband(group, date);
    });
  }

  public showSuccessModal() {
    this.modalRef = this.modalService.show(this.successModal, {
      animated: true
    });
  }

  public disband(group: any, endDate: Date) {
    const index = _.indexOf(this._groups, group);
    this.modalRef.hide();
    this.subscription.add(
      this.communityGroupService
        .disbandGroup(group.uuid, endDate, '')
        .subscribe(
          (updatedGroup) => {
            this._groups[index] = updatedGroup;
          },
          (error) => {
            console.log(error);
          }
        )
    );
  }

  public confirmActivate(group: any): void {
    const confirmed = window.confirm(
      `Are you sure you want to activate group ${group.display}?`
    );
    if (confirmed) {
      this.activateGroup(group);
    }
  }

  public activateGroup(group) {
    const index = _.indexOf(this._groups, group);
    this.communityGroupService.activateGroup(group.uuid).subscribe(
      (updatedGroup) => {
        this._groups[index] = updatedGroup;
      },
      (error) => {
        console.log(error);
      }
    );

    this.toastrService.showToastr(
      'success',
      `Group ${group.display} has been activated successully`,
      'Activated!'
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
