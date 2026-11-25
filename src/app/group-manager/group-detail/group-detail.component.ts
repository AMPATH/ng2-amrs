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
import { Observable, Subscription, forkJoin, of } from 'rxjs';
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
import { RisonService } from '../../shared/services/rison-service';
import { HttpClient } from '@angular/common/http';
import {
  finalize,
  flatMap,
  map,
  shareReplay,
  switchMap,
  take
} from 'rxjs/operators';

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
    rowHeight: 40,
    headerHeight: 48,
    rowClassRules: {
      // Members whose membership has ended
      'gd-row-ended': (params: any) => !!(params.data && params.data.member_to)
    },
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
    },
    onModelUpdated: () => {
      // Counted after the grid's change, so the button is not changed while
      // Angular is still checking it.
      Promise.resolve().then(() => {
        this.shownMembersCount = this.gridOptions.api
          ? this.gridOptions.api.getDisplayedRowCount()
          : 0;
      });
    }
  };
  /** Members the table shows now (after Active/All); export needs one. */
  public shownMembersCount = 0;
  public group: Group;
  public members = [];
  public modalRef: BsModalRef;
  public nestedModalRef: BsModalRef;
  public subscription: Subscription;
  public isFiltered = true;
  public subscriptions = new Subscription();
  public visitType = '0d608b80-1cb5-4c85-835a-29072683ca27';
  public standardVisitType = '41c54687-8596-4071-a235-96d80f3fd039';
  public otzVisitType = 'd3d5fd4a-508c-4610-97b7-5197a0bdb88d';
  public selectedVisitType = '';
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
  /** True while the members table is being filled in. */
  public membersLoading = false;
  /** True while the OTZ module columns are being filled in. */
  public modulesLoading = false;
  public numberOfMembers: number;
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
    const parts = this.communityGroupService.getGroupByUuidParts(uuid);
    // The members' HIV summaries need only the members list, so they start as
    // soon as it arrives, while the rest of the group is still loading.
    const summaries$ = parts.members$.pipe(
      switchMap((members: any[]) => {
        const memberUuids = this.generatePatientUuids(members || []);
        return memberUuids.length > 0
          ? this.cohortOtzModuleResourceService.getPatientsLatestHivSummaries(
              memberUuids
            )
          : of([]);
      }),
      shareReplay(1)
    );
    summaries$.subscribe(
      () => undefined,
      () => undefined // reported when the table is built
    );
    const dcOtzSubs = forkJoin([parts.group$]);
    dcOtzSubs.subscribe(
      (results) => {
        console.log('results here', results);
        const res = results[0];
        this.numberOfMembers = res.cohortMembers.length;
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
        if (res.cohortVisits) {
          this.cohortVisits = res.cohortVisits.sort((a: any, b: any) => {
            return Math.abs(
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
          });
        }
        this.groupVisitDate = {
          date: this.today,
          jsdate: new Date()
        };
        const isOtz =
          this.group.attributes.find((a) => {
            return a.cohortAttributeType.name === 'programUuid';
          }).value === '203571d6-a4f2-4953-9e8b-e1105e2340f5';
        this.isOtzProgram = isOtz;
        this.selectedVisitType = this.determineNextVisitType();

        this.checkIfTodayVisitStarted(this.cohortVisits);
        this.generateMembersData(
          res.cohortMembers,
          res.cohortVisits,
          summaries$
        );
        if (this.isOtzProgram) {
          // The OTZ module columns need the encounters' observations, which
          // are large - fetched after the table is already shown.
          this.loadModuleColumns(uuid, res.cohortMembers, summaries$);
        }
      },
      (err) => {
        console.error('Group detail: could not load the group', err);
        this.error = true;
        this.errorMessage =
          'Could not load this group. Please check your connection and try again.';
      }
    );
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

  public getVisitTypeDisplayName(visitTypeUuid: string): string {
    if (visitTypeUuid === this.visitType) {
      return 'Community';
    } else if (visitTypeUuid === this.standardVisitType) {
      return 'Standard';
    }
    return '';
  }

  /**
   * Builds the members table. The summaries may already be on their way
   * (started when the members list arrived); otherwise they are fetched here.
   */
  public generateMembersData(
    cohortMembers,
    cohortVisits,
    earlySummaries$?: Observable<any>
  ) {
    this.membersData = [];
    this.columns = [];
    this.membersLoading = true;
    const memberUuids = this.generatePatientUuids(cohortMembers || []);
    // With no members there is nothing to ask the summaries for.
    const summaries$ =
      earlySummaries$ ||
      (memberUuids.length > 0
        ? this.cohortOtzModuleResourceService.getPatientsLatestHivSummaries(
            memberUuids
          )
        : of([]));
    summaries$.pipe(finalize(() => (this.membersLoading = false))).subscribe(
      (result) => {
        try {
          const summaryMap = this.generateSummaryObject(result || []);
          const members = this.generateMemberObject(cohortMembers);
          this.membersData = this.generateRowData(
            members,
            cohortVisits,
            summaryMap
          );
          this.columns = this.generateColumns(cohortVisits);
        } catch (err) {
          console.error('Group detail: could not build the members table', err);
        }
      },
      (err) => {
        console.error('Group detail: could not load HIV summaries', err);
      }
    );
  }

  /**
   * Fills in the OTZ module columns (Mod 1-8) once the meetings' observations
   * arrive, rebuilding the rows without showing the skeleton again.
   */
  private loadModuleColumns(
    groupUuid: string,
    cohortMembers: any[],
    summaries$: Observable<any>
  ) {
    this.modulesLoading = true;
    this.communityGroupService
      .getGroupMeetingsWithObs(groupUuid)
      .pipe(take(1))
      .subscribe(
        (meetings: any[]) => {
          summaries$.pipe(take(1)).subscribe(
            (result) => {
              try {
                const summaryMap = this.generateSummaryObject(result || []);
                const members = this.generateMemberObject(cohortMembers);
                this.modulesLoading = false;
                this.membersData = this.generateRowData(
                  members,
                  meetings,
                  summaryMap
                );
              } catch (err) {
                this.modulesLoading = false;
                console.error('Group detail: could not fill the modules', err);
              }
            },
            () => (this.modulesLoading = false)
          );
        },
        (err) => {
          this.modulesLoading = false;
          console.error('Group detail: could not load the OTZ modules', err);
        }
      );
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
    if (this.numberOfMembers > 15 && this.isOtzProgram) {
      this.successMessage =
        'You have reached Maximum number of members in this club';
      return;
    }
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
    const visitTypeToUse = this.selectedVisitType;
    const groupVisit = {
      visitType: visitTypeToUse,
      location: this.group.location.uuid,
      startDate: this.groupVisitDate.jsdate,
      cohort: this.group.uuid
    };
    this.communityGroupService.startGroupVisit(groupVisit).subscribe(
      (result) => {
        this.showSuccessModal(
          `${
            this.isOtzProgram
              ? 'OTZ'
              : this.getVisitTypeDisplayName(visitTypeToUse)
          } Visit started successfully!`
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

  public shouldShowVisitType(item: any): boolean {
    if (this.isOtzProgram) {
      return item.display.toLowerCase().includes('otz');
    }
    return item.uuid === this.selectedVisitType;
  }

  public determineNextVisitType(): string {
    if (this.isOtzProgram) {
      return this.otzVisitType;
    }

    if (!this.cohortVisits || this.cohortVisits.length === 0) {
      return this.visitType;
    }

    const sortedCohortVisits = [...this.cohortVisits].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });

    const mostRecentVisit = sortedCohortVisits[0];

    const hasEncounters =
      mostRecentVisit.cohortMemberVisits &&
      mostRecentVisit.cohortMemberVisits.length > 0;

    if (!hasEncounters) {
      return mostRecentVisit.visitType.uuid;
    }

    if (mostRecentVisit.visitType.uuid === this.visitType) {
      return this.standardVisitType;
    }

    if (mostRecentVisit.visitType.uuid === this.standardVisitType) {
      return this.visitType;
    }

    return this.visitType;
  }

  checkIfDrugPickupFilled(personuuid, cohortVisit) {
    let xx = false;
    const drugPickupUuid = '987009c6-6f24-43f7-9640-c285d6553c63';

    (cohortVisit.cohortMemberVisits || []).filter((cohortMemberVisit) => {
      if (
        cohortMemberVisit &&
        cohortMemberVisit.visit &&
        cohortMemberVisit.visit.patient &&
        cohortMemberVisit.visit.patient.uuid === personuuid
      ) {
        const drugPickupEncounter = (
          cohortMemberVisit.visit.encounters || []
        ).find((encounter) => {
          const isDrugPickupEncounter =
            !!encounter.encounterType &&
            encounter.encounterType.uuid === drugPickupUuid;
          const isSameDay = Moment(
            cohortMemberVisit.visit.startDatetime
          ).isSame(encounter.encounterDatetime, 'day');
          return isDrugPickupEncounter && isSameDay;
        });
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
    const patientVisit = (cohortVisit.cohortMemberVisits || []).find((v) => {
      return (
        v && v.visit && v.visit.patient && v.visit.patient.uuid === personuuid
      );
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
    // The OTZ module answers of every member, worked out once for the group.
    // (It used to be rebuilt for each member from a list that grew with every
    // member, which froze the page on groups with many meetings.)
    const cohortMemberVisit = (cohortVisits || [])
      .filter(
        (cohortVisit) =>
          cohortVisit.cohortMemberVisits &&
          cohortVisit.cohortMemberVisits.length > 0
      )
      .map((cohortVisit) => cohortVisit.cohortMemberVisits);
    const obsByPatient = new Map<string, any[]>();
    this.getVisitsArray(cohortMemberVisit).forEach((item) =>
      obsByPatient.set(item.patient_uuid, item.obs)
    );
    const conceptStrings = [
      'OTZ ORIENTATION: YES',
      'OTZ TREATMENT LITERACY: YES',
      'OTZ PARTICIPATION: YES',
      'PEER TO PEER MENTORSHIP DONE: YES',
      'OTZ LEADERSHIP: YES',
      'EDUCATION ON PREVENTION METHODS DONE: YES',
      'OTZ FUTURE DECISION MAKING: YES',
      'TRANSITION TO ADULT CLINIC: YES'
    ];
    for (const member of cohortMembers) {
      const memberRow = {
        name: member.person.display,
        person_uuid: member.person.uuid,
        identifiers: member.allIdentifiers,
        contacts: member.person.patientPhoneNumber,
        member_since: this.datePipe.transform(member.startDate),
        member_to: this.datePipe.transform(member.endDate),
        gender: member.person.gender,
        age: member.person.age,
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
        i++;
      }
      const memberObs = obsByPatient.get(member.person.uuid);
      if (memberObs) {
        for (let j = 0; j < conceptStrings.length; j++) {
          const concept = conceptStrings[j];
          memberRow[`mod${j + 1}`] = memberObs.some(
            (obs: { display: string }) => obs.display === concept
          );
        }
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

  /**
   * Each patient's observations across the group's member visits, each
   * observation once (first occurrence kept), in the order first seen.
   */
  private getVisitsArray(cohortVisitArray) {
    const obsByPatient = new Map<string, any[]>();
    const seenByPatient = new Map<string, Set<string>>();

    cohortVisitArray.forEach((items) => {
      items.forEach((item) => {
        if (
          !item ||
          !item.visit ||
          !item.visit.patient ||
          !item.visit.encounters ||
          !(item.visit.encounters.length > 0)
        ) {
          return;
        }
        const patientUuid = item.visit.patient.uuid;
        if (!obsByPatient.has(patientUuid)) {
          obsByPatient.set(patientUuid, []);
          seenByPatient.set(patientUuid, new Set<string>());
        }
        const patientObs = obsByPatient.get(patientUuid);
        const seen = seenByPatient.get(patientUuid);
        item.visit.encounters.forEach((enc) => {
          (enc.obs || []).forEach((obsItem) => {
            const key = obsItem && obsItem.uuid;
            if (!seen.has(key)) {
              seen.add(key);
              patientObs.push(obsItem);
            }
          });
        });
      });
    });

    return Array.from(obsByPatient, ([patient_uuid, obs]) => ({
      patient_uuid,
      obs
    }));
  }

  onGroupDetailsChanged(updatedGroup) {
    this.group = updatedGroup;
    this.generateMembersData(this.group.cohortMembers, this.group.cohortVisits);
    this.loadGroup();
  }

  private generateColumns(cohortVisits) {
    const columns: any[] = [];
    const tick = (column) =>
      column.value
        ? '<i class="fa fa-check text-success" title="Yes"></i>'
        : '<i class="fa fa-times text-danger" title="No"></i>';
    const dateText = (params) =>
      params.value ? this.datePipe.transform(params.value, 'dd MMM yyyy') : '';
    // Names and identifiers keep their width; the grid scrolls sideways
    // rather than squeezing them to fit.
    columns.push(
      {
        headerName: 'Name',
        field: 'name',
        pinned: 'left',
        width: 230,
        minWidth: 180,
        suppressSizeToFit: true,
        tooltipField: 'name',
        cellClass: 'gd-cell-name'
      },
      {
        headerName: 'Identifiers',
        field: 'identifiers',
        width: 170,
        minWidth: 140,
        suppressSizeToFit: true,
        tooltipField: 'identifiers'
      },
      {
        headerName: 'Contacts',
        field: 'contacts',
        width: 130,
        minWidth: 120,
        suppressSizeToFit: true
      }
    );
    let index = 0;
    if (!this.isOtzProgram) {
      columns.push(
        {
          headerName: 'Member From',
          field: 'member_since',
          width: 120,
          minWidth: 115,
          suppressSizeToFit: true
        },
        {
          headerName: 'Member To',
          field: 'member_to',
          width: 120,
          minWidth: 115,
          suppressSizeToFit: true
        }
      );
      for (const cohortVisit of cohortVisits) {
        columns.push({
          headerName: `${this.datePipe.transform(
            cohortVisit.startDate
          )} Meeting`,
          headerTooltip: `Meeting on ${this.datePipe.transform(
            cohortVisit.startDate,
            'fullDate'
          )}`,
          field: `group_visit_${index}`,
          width: 120,
          minWidth: 110,
          cellClass: 'gd-cell-center',
          cellRenderer: tick
        });
        index = index + 1;
      }
    }

    if (this.isOtzProgram) {
      columns.push(
        { headerName: 'Gender', field: 'gender', width: 90, minWidth: 80 },
        { headerName: 'Age', field: 'age', width: 80, minWidth: 70 },
        {
          headerName: 'Latest VL',
          field: 'latest_vl',
          width: 100,
          minWidth: 90
        },
        {
          headerName: 'Latest VL Date',
          field: 'latest_vl_date',
          width: 130,
          minWidth: 120,
          valueFormatter: dateText
        },
        {
          headerName: 'VL Category',
          field: 'vl_category',
          width: 190,
          minWidth: 150,
          tooltipField: 'vl_category'
        },
        {
          headerName: 'Latest RTC',
          field: 'latest_rtc',
          width: 125,
          minWidth: 115,
          valueFormatter: dateText
        },
        {
          headerName: 'Latest Appointment Date',
          field: 'latest_appointment_date',
          width: 150,
          minWidth: 130,
          valueFormatter: dateText
        },
        {
          headerName: 'Adherence Type',
          field: 'adherence_type',
          width: 130,
          minWidth: 110
        }
      );
      const modules = [
        'Orientation',
        'Treatment literacy',
        'Participation',
        'Peer mentorship',
        'Leadership',
        'Prevention education',
        'Future decision making',
        'Transition to adult clinic'
      ];
      for (let i = 1; i <= 8; i++) {
        columns.push({
          headerName: `Mod ${i}`,
          headerTooltip: `Module ${i}: ${modules[i - 1]}`,
          field: `mod${i}`,
          width: 80,
          minWidth: 75,
          cellClass: 'gd-cell-center',
          cellRenderer: (column) =>
            this.modulesLoading
              ? '<span class="text-muted" title="Loading modules">…</span>'
              : tick(column)
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
        const targetProgramUuid = '203571d6-a4f2-4953-9e8b-e1105e2340f5';
        const checkOTZProgram = programsEnrolled.some(
          (program) => program.programUuid === targetProgramUuid
        );
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
          case !validation.notEnrolledInGroupProgram.found &&
            checkOTZProgram &&
            this.isOtzProgram:
            this.validatingEnrollment = false;
            this.validateAge(patient);
            if (this.showOTZEnrollmentMsg) {
              this.showEnrollButton(patient);
            }
            break;
          case !validation.notEnrolledInGroupProgram.found:
            this.validatingEnrollment = false;
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
    const age = patient._person.age;

    if (age > 9 && age <= 24) {
      this.showOTZEnrollmentMsg = true;
      return;
    }

    this.showEnrollmentAlert('Patient is not eligible for OTZ enrollment!');
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
    setTimeout(() => {
      this.enrollmentErrorMessage = '';
    }, 5000);
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
    this.subscriptions.add(
      this.retrospectiveService.retroSettings.subscribe((settings) => {
        if (settings) {
          this.retrospectiveOn = settings.enabled;
          this.retroVisitDate = settings.visitDate;
          this.getVisitTypes();
        }
      })
    );
  }

  public isSameDay(date1, date2) {
    return Moment(date1).isSame(date2, 'day');
  }

  public exportAllData() {
    if (!this.gridOptions.api || this.shownMembersCount === 0) {
      return;
    }
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
