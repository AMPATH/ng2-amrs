import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable, Subscription, forkJoin } from 'rxjs';
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
import { GroupTransferModalComponent } from '../modals/group-transfer-modal.component';
import { RetrospectiveDataEntryService } from '../../retrospective-data-entry/services/retrospective-data-entry.service';
import { CohortOtzModuleResourceService } from 'src/app/etl-api/cohort-otz-module-resource.service';
import { ObsResourceService } from '../../openmrs-api/obs-resource.service';
import { RisonService } from '../../shared/services/rison-service';
import { HttpClient } from '@angular/common/http';
import { flatMap, map } from 'rxjs/operators';

@Component({
  selector: 'group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  retroVisitDate: any;
  visitStartedForThisDate: boolean;
  retrospectiveOn: boolean;
  selectedFutureGroupVisitDate: boolean;
  selectedPastGroupVisitDate: boolean;
  errorMessage: string;
  enrollmentErrorMessage: string;
  validatingEnrollment: boolean;
  patientModels: any[] = [];

  public successMessage: string;
  @ViewChild(AgGridNg2) dataGrid: AgGridNg2;
  @ViewChild('startGroupVisitModal') startGroupVisitModal: TemplateRef<any>;
  @ViewChild('enrollMembers') enrollMembers: TemplateRef<any>;
  @ViewChild('startPatientVisitWarningModal')
  startPatientVisitWarningModal: TemplateRef<any>;
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
    },
    onRowDataChanged: () => {
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
  public otzVisitType = 'd3d5fd4a-508c-4610-97b7-5197a0bdb88d';
  public currentMonth = Moment().month() + 1;
  public today = {
    year: Moment().year(),
    month: this.currentMonth,
    day: Moment().date()
  };
  public groupVisitDate: any = {
    date: this.today,
    jsdate: new Date(),
    formatted: Moment().format('YYYY-MM-DD')
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
  public activeMembers: any[] = [];
  public membersData: any[] = [];
  public columns: any[] = [];
  public visitStartedToday: boolean;
  public visitStartedRetro: boolean;
  public showEnrollmentButton = false;
  public showOTZEnrollmentMsg = false;
  public isOtzProgram = false;
  public isActivityForm = false;
  public otzModule = [];
  public cohortVisitArray = [];
  public hivSummary: any;
  public enrollMentModel = {
    enrollMentUrl: [],
    queryParams: {}
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private communityGroupService: CommunityGroupService,
    private communityGroupMemberService: CommunityGroupMemberService,
    private visitResourceService: VisitResourceService,
    private datePipe: DatePipe,
    private router: Router,
    private modalService: BsModalService,
    private risonService: RisonService,
    private retrospectiveService: RetrospectiveDataEntryService,
    private obsResourceService: ObsResourceService,
    private cohortOtzModuleResourceService: CohortOtzModuleResourceService,

    private http: HttpClient
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.newGroup) {
        this.showSuccessMessage('Group Created Successfully!');
      }
    });
    this.retrospectiveEnabled();
  }

  public ngAfterViewInit(): void {
    this.loadGroup();
    this.getVisitTypes();
  }

  public reloadData() {
    this.loadGroup();
  }

  public showSuccessMessage(msg) {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = null;
    }, 7000);
  }
  public loadGroup() {
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    const dcOtzSubs = forkJoin([
      this.communityGroupService.getGroupByUuid(uuid),
      this.cohortOtzModuleResourceService.getCohortOtzModule(uuid)
    ]);
    dcOtzSubs.subscribe((results) => {
      const res = results[0];
      this.otzModule = results[1].result;
      this.group = res;
      _.forEach(this.group.cohortMembers, (member) => {
        member['phoneNumber'] = _.filter(
          member.patient.person.attributes,
          (attribute) =>
            attribute.attributeType.uuid ===
            '72a759a8-1359-11df-a1f1-0026b9348838'
        )[0];
      });
      this.activeMembers = _.filter(
        res.cohortMembers,
        (member) => !member.endDate
      );
      this.cohortVisits = res.cohortVisits.sort((a: any, b: any) => {
        return Math.abs(
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });
      this.groupVisitDate = {
        date: this.today,
        jsdate: new Date()
      };
      const isOtz =
        this.group.attributes.find((a) => {
          return a.cohortAttributeType.name === 'programUuid';
        }).value === '203571d6-a4f2-4953-9e8b-e1105e2340f5';
      this.isOtzProgram = isOtz;
      this.checkIfTodayVisitStarted(this.cohortVisits);
      this.generateMembersData(res.cohortMembers, res.cohortVisits);
    });
  }

  public checkIfTodayVisitStarted(cohortVisits: any[]) {
    const check = _.filter(cohortVisits, (visit) =>
      Moment(visit.startDate).isSame(Moment(), 'day')
    );
    const checkRetro = _.filter(cohortVisits, (visit) => visit.endDate == null);

    check.length === 0
      ? (this.visitStartedToday = false)
      : (this.visitStartedToday = true);

    if (!this.visitStartedToday && checkRetro.length > 0) {
      this.visitStartedRetro = true;
    } else {
      this.visitStartedRetro = false;
    }
  }

  public generateMembersData(cohortMembers, cohortVisits) {
    this.membersData = [];
    this.columns = [];
    const memberUuids = this.generatePatientUuids(cohortMembers);
    this.cohortOtzModuleResourceService
      .getPatientsLatestHivSummaries(memberUuids)
      .subscribe((result) => {
        const summaryMap = this.generateSummaryObject(result);
        const members = this.generateMemberObject(cohortMembers);
        this.membersData = this.generateRowData(
          members,
          cohortVisits,
          summaryMap
        );
        this.columns = this.generateColumns(cohortVisits);
      });
  }

  public generatePatientUuids(cohortMembers) {
    return cohortMembers.map((member) => {
      return member.patient.person.uuid;
    });
  }

  public generateSummaryObject(hivSummaries) {
    const summaryMap = new Map();
    hivSummaries.forEach((summary) => {
      summaryMap.set(summary.uuid, summary);
    });
    return summaryMap;
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
      });

      const programUuid = this.group.attributes.find((a) => {
        return a.cohortAttributeType.name === 'programUuid';
      });
      let programShortName = 'hiv';

      if (program) {
        programShortName = program.value;
      }

      if (programUuid && personUuid) {
        this.router.navigate(
          [
            `/patient-dashboard/patient/${personUuid}/`,
            'hiv',
            programUuid.value,
            'visit'
          ],
          { queryParams: { groupUuid: this.group.uuid } }
        );
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

  public showDateModal(
    member: any,
    title?: string,
    arrayCount?: any,
    cohortId?: string,
    okBtnText?: string,
    closeBtnText?: string
  ) {
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
      this.endMembership(member, date, arrayCount, cohortId);
    });
  }

  public showModal(templateRef: TemplateRef<any>) {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.modalRef = this.modalService.show(templateRef, {
      animated: true,
      class: 'modal-lg'
    });
  }

  public closeModal(templateRef: TemplateRef<any>) {
    this.modalRef.hide();
  }

  public endMembership(member, date, arraycount, cohortId) {
    this.getMembersByCohort(cohortId)
      .pipe(
        flatMap((response) => {
          return this.communityGroupMemberService.endMembership(
            response.results[arraycount].uuid.toString(),
            date
          );
        })
      )
      .subscribe(
        (response) => {
          const successMsg = `Successfully ended membership for ${
            member.patient.person.display
          } on ${Moment(date).format('DD MMMM YYYY')}`;
          this.reloadData();
          this.showSuccessModal(successMsg);
        },
        (error) => {
          this.error = true;
          console.log(error);
        }
      );
  }

  getMembersByCohort(cohortId: string) {
    const url = `${this.communityGroupService.getOpenMrsBaseUrl()}/cohortmember?cohort=${cohortId}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const results = response.results.map((result: any) => {
          return {
            uuid: result.uuid,
            display: result.display,
            links: result.links.map((link: any) => {
              return {
                rel: link.rel,
                uri: link.uri,
                resourceAlias: link.resourceAlias
              };
            })
          };
        });
        return { results };
      })
    );
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
    this.subscriptions.add(
      this.visitResourceService.getVisitTypes({}).subscribe((visitTypes) => {
        this.visitTypes = visitTypes;
      })
    );
  }

  public saveGroupVisit() {
    this.savingVisit = true;
    const groupVisit = {
      visitType: this.isOtzProgram ? this.otzVisitType : this.visitType,
      location: this.group.location.uuid,
      startDate: this.groupVisitDate.jsdate,
      cohort: this.group.uuid
    };
    this.communityGroupService.startGroupVisit(groupVisit).subscribe(
      (result) => {
        this.showSuccessModal(
          `${this.isOtzProgram ? 'OTZ' : ''} Visit started successfully!`
        );
        this.savingVisit = false;
        this.closeModal(this.startGroupVisitModal);
        this.reloadData();
      },
      (error) => {
        this.savingVisit = true;
        this.errorSavingVisit = true;
      }
    );
  }

  public ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  checkIfDrugPickupFilled(personuuid, cohortVisit) {
    let xx = false;
    const drugPickupUuid = '987009c6-6f24-43f7-9640-c285d6553c63';

    cohortVisit.cohortMemberVisits.filter((cohortMemberVisit) => {
      if (cohortMemberVisit.visit.patient.uuid === personuuid) {
        const drugPickupEncounter = cohortMemberVisit.visit.encounters.find(
          (encounter) => {
            const isDrugPickupEncounter =
              encounter.encounterType.uuid === drugPickupUuid;
            const isSameDay = Moment(
              cohortMemberVisit.visit.startDatetime
            ).isSame(encounter.encounterDatetime, 'day');
            return isDrugPickupEncounter && isSameDay;
          }
        );
        if (drugPickupEncounter) {
          xx = true;
        }
      }
    });

    return xx;
  }

  private patientPresent(patient, cohortVisit) {
    let present = false;
    const personuuid = patient.person.uuid;
    const patientVisit = cohortVisit.cohortMemberVisits.find((v) => {
      return v.visit.patient.uuid === personuuid;
    });
    if (patientVisit) {
      if (this.checkIfDrugPickupFilled(personuuid, cohortVisit)) {
        present = true;
      }
    }

    return present;
  }

  private generateRowData(cohortMembers, cohortVisits, summaryMap) {
    const membersData = [];
    const cohortMemberVisit = [];
    const conceptStrings = [
      'OTZ ORIENTATION: YES',
      'OTZ PARTICIPATION: YES',
      'OTZ LEADERSHIP: YES',
      'OTZ TREATMENT LITERACY: YES',
      'OTZ FUTURE DECISION MAKING: YES',
      'TRANSITION TO ADULT CARE: YES',
      'OTZ SRH: YES',
      'OTZ BEYOND THIRD 90: YES'
    ];
    for (const member of cohortMembers) {
      const memberRow = {
        name: member.person.display,
        person_uuid: member.person.uuid,
        identifiers: member.allIdentifiers,
        contacts: member.person.patientPhoneNumber,
        member_since: this.datePipe.transform(member.startDate),
        member_to: this.datePipe.transform(member.endDate),
        latest_vl: summaryMap.has(member.person.uuid)
          ? summaryMap.get(member.person.uuid).latest_vl
          : '',
        latest_vl_date: summaryMap.has(member.person.uuid)
          ? summaryMap.get(member.person.uuid).latest_vl_date
          : '',
        vl_category: summaryMap.has(member.person.uuid)
          ? this.getVlCategory(summaryMap.get(member.person.uuid).latest_vl)
          : '',
        latest_rtc: summaryMap.has(member.person.uuid)
          ? summaryMap.get(member.person.uuid).rtc_date
          : '',
        latest_appointment_date: summaryMap.has(member.person.uuid)
          ? summaryMap.get(member.person.uuid).latest_appointment
          : '',
        adherence_type: summaryMap.has(member.person.uuid)
          ? summaryMap.get(member.person.uuid).adherence
          : ''
      };

      let i = 0;
      for (const cohortVisit of cohortVisits) {
        memberRow[`group_visit_${i}`] = this.patientPresent(
          member,
          cohortVisit
        );
        memberRow[`group_visit_${i}_uuid`] = cohortVisit.uuid;
        if (cohortVisit.cohortMemberVisits.length > 0) {
          cohortMemberVisit.push(cohortVisit.cohortMemberVisits);
        }
        i++;
      }
      const newArray = this.getVisitsArray(cohortMemberVisit);
      for (let j = 0; j < conceptStrings.length; j++) {
        const concept = conceptStrings[j];
        newArray.forEach((item) => {
          if (item.patient_uuid === member.person.uuid) {
            const value = item.obs.some(
              (obs: { display: string }) => obs.display === concept
            );
            memberRow[`mod${j + 1}`] = value;
          }
        });
      }

      membersData.push(memberRow);
    }
    return membersData;
  }

  private getVlCategory(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (value <= 50) {
      return 'LDL';
    } else if (value <= 200) {
      return 'Low Risk Low Level Viremia';
    } else if (value <= 500) {
      return 'High Risk Low Level Viremia';
    } else {
      return 'Suspected Treatment Failure';
    }
  }

  private getVisitsArray(cohortVisitArray) {
    const filteredArray = [];

    cohortVisitArray.forEach((items) => {
      items.forEach((item) => {
        if (item.visit.encounters.length > 0) {
          const newObject = {
            patient_uuid: item.visit.patient.uuid,
            obs: item.visit.encounters.map((enc) => enc.obs)
          };

          filteredArray.push(newObject);
        }
      });
    });

    const uniqueObsMap = new Map();

    filteredArray.forEach((patient) => {
      const { patient_uuid, obs } = patient;

      let uniqueObsArray = uniqueObsMap.get(patient_uuid) || [];

      const flattenedObs = [].concat(...obs);
      const uniqueObs = flattenedObs.filter(
        (obsItem, index, self) =>
          index === self.findIndex((t) => t.uuid === obsItem.uuid)
      );

      uniqueObsArray = uniqueObsArray.concat(uniqueObs);
      uniqueObsMap.set(patient_uuid, uniqueObsArray);
    });

    uniqueObsMap.forEach((obsArray, patient_uuid) => {
      const uniqueNestedObs = obsArray.filter((obsItem, index, self) => {
        return index === self.findIndex((t) => t.uuid === obsItem.uuid);
      });

      uniqueObsMap.set(patient_uuid, uniqueNestedObs);
    });

    const resultArray = Array.from(uniqueObsMap, ([patient_uuid, obs]) => ({
      patient_uuid,
      obs
    }));
    return resultArray;
  }

  onGroupDetailsChanged(updatedGroup) {
    this.group = updatedGroup;
    this.generateMembersData(this.group.cohortMembers, this.group.cohortVisits);
    this.loadGroup();
  }

  private generateColumns(cohortVisits) {
    const columns = [];
    columns.push(
      {
        headerName: 'Identifiers',
        field: 'identifiers',
        pinned: 'left',
        width: 100
      },
      { headerName: 'Name', field: 'name', pinned: 'left', width: 100 },
      { headerName: 'Contacts', field: 'contacts', pinned: 'left', width: 100 },
      {
        headerName: 'Member From',
        field: 'member_since',
        pinned: 'left',
        width: 100
      },
      {
        headerName: 'Member To',
        field: 'member_to',
        pinned: 'left',
        width: 100
      }
    );
    let index = 0;
    if (!this.isOtzProgram) {
      for (const cohortVisit of cohortVisits) {
        columns.push({
          headerName: `${this.datePipe.transform(
            cohortVisit.startDate
          )} Meeting`,
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
    }

    if (this.isOtzProgram) {
      columns.push(
        {
          headerName: 'Latest VL',
          field: 'latest_vl',
          pinned: 'left',
          width: 80
        },
        {
          headerName: 'Latest VL Date',
          field: 'latest_vl_date',
          pinned: 'left',
          width: 80
        },
        {
          headerName: 'VL Category',
          field: 'vl_category',
          pinned: 'left',
          width: 80
        },
        {
          headerName: 'Latest RTC',
          field: 'latest_rtc',
          pinned: 'left',
          width: 80
        },
        {
          headerName: 'Latest Appointment Date',
          field: 'latest_appointment_date',
          pinned: 'left',
          width: 80
        },
        {
          headerName: 'Adherence Type',
          field: 'adherence_type',
          pinned: 'left',
          width: 80
        }
      );
      for (let i = 1; i <= 8; i++) {
        columns.push({
          headerName: `Mod ${i}`,
          field: `mod${i}`,
          width: 70,
          cellRenderer: (column) => {
            if (column.value) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        });
      }
    }
    return columns;
  }

  public validateMemberEnrollment(patient) {
    this.validatingEnrollment = true;
    this.enrollmentErrorMessage = null;
    this.communityGroupMemberService
      .getCurrentlyEnrolledProgramsAndGroups(patient.uuid)
      .subscribe((results) => {
        const programsEnrolled = results[0];
        const groupsEnrolled = results[1];
        let currentGroupsEnrolled = [];
        if (groupsEnrolled) {
          currentGroupsEnrolled = _.filter(
            groupsEnrolled,
            (group) => !group.voided
          );
        }
        const validation = this.communityGroupMemberService.validateMemberEnrollment(
          programsEnrolled,
          currentGroupsEnrolled,
          this.group
        );
        console.log(validation);
        switch (true) {
          case validation.alreadyEnrolled.found:
            this.validatingEnrollment = false;
            this.showEnrollmentAlert('Patient already enrolled in this group!');
            break;
          case !validation.notEnrolledInGroupProgram.found:
            this.validatingEnrollment = false;
            this.validateAge(patient);
            this.showEnrollButton(patient);
            break;
          case validation.enrolledInAnotherGroupInSameProgram.found:
            this.validatingEnrollment = false;
            const groupToUnenroll =
              validation.enrolledInAnotherGroupInSameProgram.data;
            this.showTransferConfirmationModal(
              this.group,
              groupToUnenroll,
              patient
            );
            break;
          default:
            this.validatingEnrollment = false;
            this.enrollPatientToGroup(this.group, patient);
        }
      });
  }

  public enrollPatienttoProgram() {
    this.closeModal(this.enrollMembers);
    this.router.navigate(this.enrollMentModel.enrollMentUrl, {
      queryParams: this.enrollMentModel.queryParams
    });
  }
  private showEnrollButton(patient) {
    this.showEnrollmentButton = true;
    const enrollMentUrl = [
      'patient-dashboard',
      'patient',
      patient.uuid,
      'general',
      'general',
      'program-manager',
      'new-program',
      'step',
      3
    ];
    const programUuid = this.group.attributes.find((a) => {
      return a.cohortAttributeType.name === 'programUuid';
    });
    const queryParams = {
      program: programUuid.value,
      groupUuid: this.group.uuid,
      redirectUrl: this.router.url,
      locationUuid: this.group.location.uuid,
      enrollMentQuestions: this.risonService.encode({
        hivStatus: 'positive',
        enrollToGroup: true
      })
    };
    this.enrollMentModel = {
      enrollMentUrl,
      queryParams
    };
  }

  private validateAge(patient) {
    if (patient._person.age >= 9 && patient._person.age <= 19) {
      this.showOTZEnrollmentMsg = true;
    } else {
      this.showOTZEnrollmentMsg = false;
    }
  }
  private enrollPatientToGroup(group: Group, patient: Patient) {
    this.communityGroupMemberService
      .createMember(group.uuid, patient.uuid)
      .subscribe((result) => {
        this.reloadData();
        this.modalRef.hide();
        this.showSuccessMessage(
          `Successfully enrolled ${patient.person.display} to ${group.name}`
        );
      });
  }

  private showEnrollmentAlert(msg: string) {
    this.enrollmentErrorMessage = msg;
  }

  private transferPatientFromGroup(groupToEnroll, groupToUnenroll, patient) {
    this.communityGroupMemberService
      .transferMember(groupToUnenroll, groupToEnroll, patient)
      .subscribe(
        (res) => {
          this.reloadData();
          this.modalRef.hide();
          this.showSuccessMessage(
            `Successfully enrolled ${patient.person.display} to ${groupToEnroll.name}`
          );
        },
        (error) => console.log(error)
      );
  }

  private showTransferConfirmationModal(
    groupToEnroll,
    groupToUnenroll,
    patient
  ) {
    this.nestedModalRef = this.modalService.show(GroupTransferModalComponent, {
      initialState: { groupToEnroll, groupToUnenroll, patient }
    });
    this.nestedModalRef.content.onConfirm.subscribe((confirmed) => {
      if (confirmed) {
        this.transferPatientFromGroup(groupToEnroll, groupToUnenroll, patient);
      }
    });
  }

  public changedGroupVisitDate(date) {
    this.visitStartedToday = false;
    this.visitStartedRetro = false;
    this.selectedPastGroupVisitDate = Moment(date.formatted).isBefore(
      Moment(),
      'day'
    );
    this.selectedFutureGroupVisitDate = Moment(date.formatted).isAfter(
      Moment(),
      'day'
    );
    if (this.selectedFutureGroupVisitDate) {
      this.visitStartedForThisDate = false;
      return;
    }
    this.visitStartedForThisDate = !_.isUndefined(
      _.find(this.group.cohortVisits, (visit) =>
        Moment(visit.startDate).isSame(date.formatted, 'day')
      )
    );
    if (this.visitStartedForThisDate) {
      return;
    }
    this.groupVisitDate = date;
  }

  public retrospectiveEnabled() {
    this.retrospectiveService.updateRetroSettings();
    this.retrospectiveService.retroSettings.subscribe((settings) => {
      if (settings) {
        this.retrospectiveOn = settings.enabled;
        this.retroVisitDate = settings.visitDate;
        this.getVisitTypes();
      }
    });
  }

  public isSameDay(date1, date2) {
    return Moment(date1).isSame(date2, 'day');
  }

  public exportAllData() {
    this.gridOptions.api.exportDataAsCsv();
  }

  public enableRetrospectiveMode() {
    this.router.navigate([
      '/retrospective-data',
      {
        navigateToGroupVisit: true,
        location: this.group.location.uuid,
        group: this.group.uuid
      }
    ]);
    this.closeModal(this.startGroupVisitModal);
  }
}
