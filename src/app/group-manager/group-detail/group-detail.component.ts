import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'

import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';

import { Group } from '../group-model';
import { Patient } from '../../models/patient.model'
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
  @ViewChild(AgGridNg2) dataGrid: AgGridNg2;
  @ViewChild('startGroupVisitModal') startGroupVisitModal: TemplateRef<any>;
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
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
  }
  public group: Group;
  public members: any;
  public modalRef: BsModalRef;
  public nestedModalRef: BsModalRef;
  public subscription: Subscription;
  public isFiltered = true;
  public subscriptions = new Subscription();
  public visitType: any = '';
  public groupVisitDate: any = { jsdate: new Date() };
  public cohortVisits = [];
  public patientVisitPayload: any;
  public visitTypes = [];
  public selectedPatient: Patient;
  public busy = false;
  public savingVisit = false;
  public errorSavingVisit = false;
  public error = false;
  public patientDashboardConfig: any = require('../../shared/dynamic-route/schema/patient.dashboard.conf.json');

  public membersData: any[] = [];
  public columns: any[] = [];



  constructor(private activatedRoute: ActivatedRoute,
    private communityGroupService: CommunityGroupService,
    private communityGroupMemberService: CommunityGroupMemberService,
    private visitResourceService: VisitResourceService,
    private datePipe: DatePipe,
    private router: Router,
    private modalService: BsModalService) { }

  ngOnInit() {
  }

  public ngAfterViewInit(): void {
    this.loadGroup();
    this.getVisitTypes();
  }

  public reloadData() {
    this.loadGroup();
  }

  public loadGroup() {
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.subscriptions.add(this.communityGroupService.getGroupByUuid(uuid).subscribe((res) => {
      this.group = res;
      this.members = this.filterCurrent();
      this.cohortVisits = res.cohortVisits.sort((a: any, b: any) => {
        return Math.abs(new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      });;
      this.generateMembersData(this.members, res.cohortVisits);
    }, (error) => {
      this.error = true;
    }));
  }

  public generateMembersData(cohortMembers, cohortVisits) {
    this.membersData = [];
    this.columns = [];
    console.log('group', this.group);
    this.membersData = this.generateRowData(cohortMembers, cohortVisits);
    this.columns = this.generateColumns(cohortVisits);
  }


  public gridOnCellClick($event) {
    let data = $event.data;
    let groupVisitUuid = data[`${$event.colDef.field}_uuid`];
    let personUuid = data[`person_uuid`];
    let program = this.group.attributes.find((a) => {
      return a.cohortAttributeType.name === 'programShortName'
    }
    );

    let programUuid = this.group.attributes.find((a) => {
      return a.cohortAttributeType.name === 'programUuid'
    }
    );
    let programShortName = 'hiv';

    if (program) {
      programShortName = program.value;
    }

    if (programUuid && personUuid) {
      this.router.navigate([`/patient-dashboard/patient/${personUuid}/`,
        'hiv', programUuid.value, 'visit']);

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
      animated: true
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

  public filterCurrent() {
    this.isFiltered = true;
    return _.filter(this.group.cohortMembers, (member) => member.endDate == null);
  }

  public removeFilter() {
    this.isFiltered = false;
    this.members = this.group.cohortMembers;
  }

  public getVisitTypes() {
    this.subscriptions.add(this.visitResourceService.getVisitTypes({}).subscribe((visitTypes) => {
      this.visitTypes = visitTypes;
    }));
  }


  public saveGroupVisit() {
    this.savingVisit = true;
    let groupVisit = {
      visitType: this.visitType,
      location: this.group.location.uuid,
      startDate: this.groupVisitDate.formatted,
      cohort: this.group.uuid
    }
    this.communityGroupService.startGroupVisit(groupVisit).subscribe((result) => {
      this.savingVisit = false;
      this.closeModal(this.startGroupVisitModal)
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
    let patientVisit = cohortVisit.cohortMemberVisits.find((v) => {

      return v.visit.patient.uuid === patient.uuid
    });
    if (patientVisit) {
      present = true;
    }
    return present;
  }

  private generateRowData(cohortMembers, cohortVisits) {
    let membersData = [];
    for (let member of cohortMembers) {
      let patient = new Patient(member.patient);
      let memberRow = {
        name: patient.person.display,
        person_uuid: patient.person.uuid,
        identifiers: patient.allIdentifiers,
        contacts: patient.person.patientPhoneNumber,
        member_since: this.datePipe.transform(member.startDate)
      }
      let i = 0;
      for (let cohortVisit of cohortVisits) {

        memberRow[`group_visit_${i}`] = this.patientPresent(patient, cohortVisit);
        memberRow[`group_visit_${i}_uuid`] = cohortVisit.uuid;
        i++;
      }
      membersData.push(memberRow);
    }
    return membersData;
  }

  onGroupDetailsChanged(updatedGroup) {
    this.group = updatedGroup;
  }

  private generateColumns(cohortVisits) {
    let columns = [];
    columns.push({ headerName: 'Identifiers', field: 'identifiers', pinned: 'left' },
      { headerName: 'Name', field: 'name', pinned: 'left' },
      { headerName: 'Contacts', field: 'contacts', pinned: 'left' },
      { headerName: 'Member Since', field: 'member_since', pinned: 'left' });
    let index = 0
    for (let cohortVisit of cohortVisits) {
      console.log('Cohort Visits', cohortVisit);
      columns.push({
        headerName: `${this.datePipe.transform(cohortVisit.startDate)} Meeting`,
        field: `group_visit_${index}`,
        cellRenderer: (column) => {
          if (column.value) {
            return `<p class=check>&#x2714;</p>`
          } else {
            return `<p class=ex>&#215;</p>`
          }
        }

      });
      index++;
    }
    return columns;
  }
}
