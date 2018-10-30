import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Group } from '../group-model';
import { Patient } from '../../models/patient.model';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { VisitResourceService } from '../../openmrs-api/visit-resource.service';
import { DatePickerModalComponent } from '../modals/date-picker-modal.component';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { SuccessModalComponent } from '../modals/success-modal.component';
import { GridOptions } from 'ag-grid';

@Component({
  selector: 'group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})

export class GroupDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  validatingEnrollment: boolean;
  public successMessage: string;
  @ViewChild(AgGridNg2) dataGrid: AgGridNg2;
  @ViewChild('startGroupVisitModal') startGroupVisitModal: TemplateRef<any>;
  @ViewChild('startPatientVisitWarningModal') startPatientVisitWarningModal: TemplateRef<any>;
  public filter = 'current';
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
    doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
    suppressHorizontalScroll: false,
    onGridSizeChanged: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    onGridReady: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    }
  };
  public group: Group;
  public members = [];
  public modalRef: BsModalRef;
  public nestedModalRef: BsModalRef;
  public subscription: Subscription;
  public isFiltered = true;
  public subscriptions = new Subscription();
  public visitType = '0d608b80-1cb5-4c85-835a-29072683ca27';
  public currentMonth = Moment().month() + 1;
  public today = {
    'year': Moment().year(),
    'month': this.currentMonth,
    'day': Moment().date()
};
  public groupVisitDate: any = {
    date: this.today,
    jsdate: new Date()
};
  public cohortVisits = [];
  public patientVisitPayload: any;
  public visitTypes = [];
  public selectedPatient: Patient;
  public busy = false;
  public savingVisit = false;
  public errorSavingVisit = false;
  public error = false;
  public patientDashboardConfig: any = require('../../shared/dynamic-route/schema/patient.dashboard.conf.json');
  public activeMembers: any[];
  public membersData: any[] = [];
  public columns: any[] = [];
  public visitStartedToday: boolean;


  constructor(private activatedRoute: ActivatedRoute,
    private communityGroupService: CommunityGroupService,
    private communityGroupMemberService: CommunityGroupMemberService,
    private visitResourceService: VisitResourceService,
    private datePipe: DatePipe,
    private router: Router,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.newGroup) {
        this.showGroupCreatedSuccessMessage();
      }
    });
  }

  public ngAfterViewInit(): void {
    this.loadGroup();
    this.getVisitTypes();
  }

  public reloadData() {
    this.loadGroup();
  }

  public showGroupCreatedSuccessMessage() {
    this.successMessage = 'Group Created Successfully';
    setTimeout(() => {
      this.successMessage = null;
    }, 7000);
  }
  public loadGroup() {
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.subscriptions.add(this.communityGroupService.getGroupByUuid(uuid).subscribe((res) => {
      this.group = res;
      this.activeMembers = _.filter(res.cohortMembers, (member) => !member.endDate);
      this.cohortVisits = res.cohortVisits.sort((a: any, b: any) => {
        return Math.abs(new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      });
      this.checkIfTodayVisitStarted(this.cohortVisits);
      this.generateMembersData(res.cohortMembers, res.cohortVisits);
    }, (error) => {
      this.error = true;
    }));
  }

  public checkIfTodayVisitStarted(cohortVisits: any[]) {
    const check = _.filter(cohortVisits, (visit) => Moment(visit.startDate).isSame(Moment(), 'day'));
    check.length === 0 ? this.visitStartedToday = false : this.visitStartedToday = true;
    console.log(this.visitStartedToday);
  }

  public generateMembersData(cohortMembers, cohortVisits) {
    this.membersData = [];
    this.columns = [];
    const members = this.generateMemberObject(cohortMembers);
    this.membersData = this.generateRowData(members, cohortVisits);
    this.columns = this.generateColumns(cohortVisits);
  }


  public gridOnCellClick($event) {
    if (this.group.cohortVisits) {
      if ($event.data.member_to) {
        this.showModal(this.startPatientVisitWarningModal);
        return;
      }
      const data = $event.data;
      const groupVisitUuid = data[`${$event.colDef.field}_uuid`];
      const personUuid = data[`person_uuid`];
      const program = this.group.attributes.find((a) => {
        return a.cohortAttributeType.name === 'programShortName';
      }
      );

      const programUuid = this.group.attributes.find((a) => {
        return a.cohortAttributeType.name === 'programUuid';
      }
      );
      let programShortName = 'hiv';

      if (program) {
        programShortName = program.value;
      }

      if (programUuid && personUuid) {
        this.router.navigate([`/patient-dashboard/patient/${personUuid}/`,
          'hiv', programUuid.value, 'visit'], {queryParams: {groupUuid: this.group.uuid}});
      }

    }

  }

  public showSuccessModal(successMsg: string) {
    const initialState = {
      successMsg
    };
    this.nestedModalRef = this.modalService.show(SuccessModalComponent, {
      initialState
    });
  }



  public showDateModal(member: any, title?: string, okBtnText?: string, closeBtnText?: string) {
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

  public showModal(templateRef: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templateRef, {
      animated: true,
      class: 'modal-lg'
    });
  }

  public closeModal(templateRef: TemplateRef<any>) {
    this.modalRef.hide();
  }

  public endMembership(member, date) {
    const successMsg = `Successfully ended membership for ${member.patient.person.display} on ${Moment(date).format('DD MMMM YYYY')}`;
    this.subscriptions.add(this.communityGroupMemberService.endMembership(member.uuid, date).subscribe(
      (response) => {
        this.reloadData();
        this.showSuccessModal(successMsg);
      },
      (error) => {
        this.error = true;
        console.log(error);
      }
    ));
  }

  generateMemberObject(members) {
    const patients = [];
    _.forEach(members, (member) => {
      const patient = new Patient(member.patient);
      patient['startDate'] = member['startDate'];
      patient['endDate'] = member['endDate'];
      patients.push(patient);
    });
    return patients;
  }

  public doesExternalFilterPass(node) {
    switch (this.filter) {
      case 'all':
        return true;
      case 'current':
        return !node.data.member_to;
      default:
        return !node.data.member_to;
    }
  }

  public isExternalFilterPresent() {
    return true;
  }

  public externalFilterChanged($event) {
    this.filter = $event;
    this.gridOptions.api.onFilterChanged();
  }

  public getVisitTypes() {
    this.subscriptions.add(this.visitResourceService.getVisitTypes({}).subscribe((visitTypes) => {
      this.visitTypes = visitTypes;
    }));
  }


  public saveGroupVisit() {
    this.savingVisit = true;
    const groupVisit = {
      visitType: this.visitType,
      location: this.group.location.uuid,
      startDate: this.groupVisitDate.jsdate,
      cohort: this.group.uuid
    };
    this.communityGroupService.startGroupVisit(groupVisit).subscribe((result) => {
      this.savingVisit = false;
      this.closeModal(this.startGroupVisitModal);
      this.reloadData();
    }, (error) => {
      this.savingVisit = true;
      this.errorSavingVisit = true;
    });
  }

  public ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  private patientPresent(patient, cohortVisit) {
    let present = false;
    const patientVisit = cohortVisit.cohortMemberVisits.find((v) => {

      return v.visit.patient.uuid === patient.uuid;
    });
    if (patientVisit) {
      present = true;
    }
    return present;
  }

  private generateRowData(cohortMembers, cohortVisits) {
    const membersData = [];
    for (const member of cohortMembers) {
      const memberRow = {
        name: member.person.display,
        person_uuid: member.person.uuid,
        identifiers: member.allIdentifiers,
        contacts: member.person.patientPhoneNumber,
        member_since: this.datePipe.transform(member.startDate),
        member_to: this.datePipe.transform(member.endDate)
      };
      let i = 0;
      for (const cohortVisit of cohortVisits) {

        memberRow[`group_visit_${i}`] = this.patientPresent(member, cohortVisit);
        memberRow[`group_visit_${i}_uuid`] = cohortVisit.uuid;
        i++;
      }
      membersData.push(memberRow);
    }
    return membersData;
  }

  onGroupDetailsChanged(updatedGroup) {
    this.group = updatedGroup;
    this.generateMembersData(this.group.cohortMembers, this.group.cohortVisits);
  }

  private generateColumns(cohortVisits) {
    const columns = [];
    columns.push({ headerName: 'Identifiers', field: 'identifiers', pinned: 'left', width: 100 },
      { headerName: 'Name', field: 'name', pinned: 'left', width: 100 },
      { headerName: 'Contacts', field: 'contacts', pinned: 'left' , width: 100},
      { headerName: 'Member From', field: 'member_since', pinned: 'left', width: 100 },
      { headerName: 'Member To', field: 'member_to', pinned: 'left', width: 100});
    let index = 0;
    for (const cohortVisit of cohortVisits) {
      columns.push({
        headerName: `${this.datePipe.transform(cohortVisit.startDate)} Meeting`,
        field: `group_visit_${index}`,
        cellRenderer: (column) => {
          if (column.value) {
            return `<i class="fa fa-check text-success"></i>`;
          } else {
            return `<i class="fa fa-times text-danger"></i>`;
          }
        }

      });
      index = index + 1;
    }
    return columns;
  }

  public validateMemberEnrollment(patient) {
    this.validatingEnrollment = true;
    this.communityGroupMemberService.getCurrentlyEnrolledProgramsAndGroups(patient.uuid).subscribe(
      (results) => {
        const programsEnrolled =  results[0];
        const groupsEnrolled = results[1];
        let currentGroupsEnrolled = [];
        if (groupsEnrolled.length) {
          currentGroupsEnrolled = _.filter(groupsEnrolled, (group) => !group.voided);
        }
        const validation = this.communityGroupMemberService.validateMemberEnrollment(programsEnrolled, currentGroupsEnrolled, this.group);
        switch (true) {
          case validation.alreadyEnrolled:
              this.showEnrollmentAlert('Patient already enrolled in this group!');
              break;
          // case validation.enrolledInAnotherGroupInSameProgram:
          //     this.showTransferConfirmationModal();
          //     break;
          case validation.notEnrolledInGroupProgram:
             this.showEnrollmentAlert('Enroll patient to DC Program first from patient dashboard.');
             break;
          default: this.enrollPatientToGroup(this.group, patient);
          }
        });
  }

  private enrollPatientToGroup(group, patient) {
    console.log('Enrolling');
  }

  private showEnrollmentAlert(msg: string) {
    console.log(msg);
  }

  private transferPatientFromGroup() {

  }

  private showTransferConfirmationModal() {

  }
}
