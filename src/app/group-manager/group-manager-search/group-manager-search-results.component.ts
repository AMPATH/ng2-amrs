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

  /** Short program name for the badge (the full name shows on hover). */
  public programLabel(program: string): string {
    const name = (program || '').toUpperCase();
    if (name.indexOf('OTZ') !== -1) {
      return 'OTZ';
    }
    if (name.indexOf('DIFFERENTIATED SERVICE DELIVERY') !== -1) {
      return 'DC';
    }
    return program;
  }

  /** Active groups are opened; inactive or disbanded ones can be activated. */
  public isActive(group: Group): boolean {
    return this.statusKey(group) === 'active';
  }

  /** active, inactive or disbanded - for the status colour. */
  public statusKey(group: Group): string {
    return String(group.status || '').toLowerCase();
  }

  /**
   * The row after an activate or disband: its own details with the new end
   * date and void state from the server.
   */
  private updatedRow(group: Group, updatedGroup: any): Group {
    const reply = updatedGroup || {};
    return new Group(
      Object.assign({}, group.openmrsModel, {
        endDate: reply.endDate !== undefined ? reply.endDate : null,
        voided: reply.voided !== undefined ? reply.voided : false
      })
    );
  }

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
            this._groups[index] = this.updatedRow(group, updatedGroup);
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
        this._groups[index] = this.updatedRow(group, updatedGroup);
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
