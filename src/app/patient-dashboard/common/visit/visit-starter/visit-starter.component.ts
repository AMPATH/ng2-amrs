import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as moment from 'moment';
import { isEqual } from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { UserDefaultPropertiesService } from '../../../../user-default-properties/index';
import { PatientProgramResourceService } from '../../../../etl-api/patient-program-resource.service';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import { TodayVisitService } from '../today-visit.service';
import {
  RetrospectiveDataEntryService
} from '../../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { CommunityGroupMemberService } from '../../../../openmrs-api/community-group-member-resource.service';
import { CommunityGroupService } from '../../../../openmrs-api/community-group-resource.service';
import { ProviderResourceService } from '../../../../openmrs-api/provider-resource.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppointmentResourceService } from 'src/app/openmrs-api/appointment-resource.service';

@Component({
  selector: 'app-visit-starter',
  templateUrl: './visit-starter.component.html',
  styleUrls: ['./visit-starter.component.css']
})
export class VisitStarterComponent implements OnInit, OnDestroy {


  public programVisitsConfig: any = {};
  public modalRef: BsModalRef;
  @Output()
  public visitStarted = new EventEmitter<any>();

  public todayVisits = [];
  public isBusy = false;
  public startedVisit = false;
  public error = '';
  public infoMessage: any = [];
  public patientCohort: any = [];
  public cohostVisitsDropdownOptions: any[];
  public selectedCohortVisit: any = {};
  public selectedVisitType: any = {};
  public isGroupRetrospective = false;
  public retroSettings: any;
  public _patientEnrolledInGroup: boolean;
  public groupVisitStartedFromClinicDashboard: boolean;
  @ViewChild('startGroupVisitModal') public startGroupVisitModal;
  private _patientUuid: string;
  @Input() set patientEnrolledInGroup(enrolled: boolean) {
    this._patientEnrolledInGroup = enrolled;
  }

  @Input()
  public get patientUuid(): string {
    return this._patientUuid;
  }
  public set patientUuid(v: string) {
    this._patientUuid = v;
  }

  private _programUuid: string;
  @Input()
  public get programUuid(): string {
    return this._programUuid;
  }
  public set programUuid(v: string) {
    this._programUuid = v;
  }

  private _subscription: Subscription = new Subscription();
  private _programEnrollmentUuid: string;
  @Input()
  public get programEnrollmentUuid(): string {
    return this._programEnrollmentUuid;
  }
  public set programEnrollmentUuid(v: string) {
    this._programEnrollmentUuid = v;
  }
  private _selectedLocation: any;
  public get selectedLocation(): any {
    return this._selectedLocation;
  }

  public set selectedLocation(v: any) {
    this._selectedLocation = v;
    this.getCurrentProgramEnrollmentConfig();
  }

  public get visitTypes(): Array<any> {
    if (this.programVisitsConfig &&
      this.programVisitsConfig.visitTypes &&
      this.programVisitsConfig.visitTypes.allowed) {
      return this.programVisitsConfig.visitTypes.allowed;
    }
    return [];
  }

  public get disallowedVisitTypes(): Array<any> {
    if (this.programVisitsConfig &&
      this.programVisitsConfig.visitTypes &&
      this.programVisitsConfig.visitTypes.disallowed) {
      return this.programVisitsConfig.visitTypes.disallowed;
    }
    return [];
  }

  constructor(
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private patientProgramResourceService: PatientProgramResourceService,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    private visitResourceService: VisitResourceService,
    private todayVisitService: TodayVisitService,
    private modalService: BsModalService,
    private communityGroupMemberService: CommunityGroupMemberService,
    private communityGroupService: CommunityGroupService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private providerResourceService: ProviderResourceService,
    private appointmentResourceService: AppointmentResourceService
  ) { }

  public ngOnInit() {
    this.setUserDefaultLocation();
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['groupUuid']) {
        this._patientEnrolledInGroup = true;
        this.groupVisitStartedFromClinicDashboard = true;
      }
    });
    // this.getCurrentProgramEnrollmentConfig();
  }


  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
  public setUserDefaultLocation() {
    const location: any = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
      if (location && location.uuid) {
        if (retroSettings && retroSettings.enabled) {
          this.selectedLocation = retroSettings.location;
          this.retroSettings = retroSettings;
        } else {
          this.selectedLocation = {
            value: location.uuid,
            label: location.display
          };
        }
      }
    });
  }

  public getCurrentProgramEnrollmentConfig() {
    if (this.programEnrollmentUuid === '') {
      return;
    }
    this.isBusy = true;
    this.programVisitsConfig = {};
    this.error = '';
    this._subscription.add(this.patientProgramResourceService
      .getPatientProgramVisitTypes(this.patientUuid,
      this.programUuid, this.programEnrollmentUuid, this.selectedLocation.value)
      .take(1).subscribe(
      (progConfig) => {
        this.isBusy = false;
        this.programVisitsConfig = progConfig;
      },
      (error) => {
        this.isBusy = false;
        this.error = 'Error loading the program visit configs. Please refresh page and retry.';
        console.error('Error loading the program visit configs', error);
      }));
  }


  public startVisit(visitType) {
      this.selectedVisitType = visitType;
      if (visitType.groupVisit) {
        this._subscription.add(this.communityGroupMemberService
          .getMemberCohortsByPatientUuid(this.patientUuid).subscribe((patientCohorts) => {
          this.patientCohort = patientCohorts.find((c) => {
            const attribute = c.cohort.attributes.find((a) => a.value === '334c9e98-173f-4454-a8ce-f80b20b7fdf0' && c.voided === false);
            return attribute !== undefined;
          });
         if (this.patientCohort) {
                this.cohostVisitsDropdownOptions = this.patientCohort.cohort.cohortVisits.map((v) => {
                return {
                        value: v.uuid,
                        label: `${this.datePipe.transform(v.startDate)} Meeting`
                      };
            });
          }
        }, (error) => {
              console.log('Error', error);
        }));
        this.modalRef = this.modalService.show(this.startGroupVisitModal);
      } else {
        if (!this.startedVisit) {
          this.saveVisit(this.selectedVisitType);
        }
    }

    }

  public saveVisit(visitType) {
    this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
    const visitTypeUuid = visitType.uuid;
    this.startedVisit = true;
    this.isBusy = true;
    this.error = '';
    const payload = {
      patient: this.patientUuid,
      location: this.selectedLocation.value,
      startDatetime: new Date(),
      visitType: visitTypeUuid
    };
    const appointmentPayload = {
      // 'patient': '5b6e59da-1359-11df-a1f1-0026b9348838',
      // 'status': 'WALKIN',
      // 'appointmentType': 'fbad0240-5fc6-4409-8b5d-a39bfdcb4777',
      // 'visit': '0ce6532a-e11d-4157-ad86-aafcbf316633',
      // 'date': '2019-08-16 07:00:00',
      // 'location': '08febb92-1352-11df-a1f1-0026b9348838',
      // 'provider': 'pdd2c903-1a43-46bf-8f09-44da3cb5a67b'
      patient: this.patientUuid,
      status: 'WALKIN',
      appointmentType: 'fbad0240-5fc6-4409-8b5d-a39bfdcb4777',
      visit: this.todayVisits[0],
      location: this.selectedLocation.value,
      date: this.appointmentDate(),
      provider: 'pdd2c903-1a43-46bf-8f09-44da3cb5a67b'
    };

    if (retroSettings && retroSettings.enabled) {
      payload.location = retroSettings.location.value;
      payload.startDatetime = this.setRetroDateTime(retroSettings);
      payload['attributes'] = [
        {
          attributeType: '3bb41949-6596-4ff9-a54f-d3d7883a69ed',
          value: 'true'
        }
      ];
    }
    if (visitType.groupVisit) {
      this.saveGroupVisit();
    } else {
      this.saveIndividualVisit(payload);
      this.saveAppointment(appointmentPayload);
    }
  });
  }

  public getCohort() {
   return this.patientCohort.cohort.cohortVisits.find((v) => {
      return v.uuid === this.selectedCohortVisit.value;
    });
  }
  public saveGroupVisit() {
    const cohortVisit = this.getCohort();
    if (cohortVisit) {
      const groupPayload = {
        visit: {
          patient: this.patientUuid,
          location: cohortVisit.location.uuid,
          startDatetime: cohortVisit.startDate,
          visitType: cohortVisit.visitType.uuid,
        },
        cohortVisit: cohortVisit.uuid
      };
      this._subscription.add(this.communityGroupService.startIndividualVisit(groupPayload).subscribe((v) => {
        this.isBusy = false;
        this.visitStarted.emit(v.visit);
        this.modalRef.hide();
      }, (error) => {
        console.log('Error', error);
      }));
    } else {
      console.log('Cohort Visit Not found ');
    }
  }

  public saveIndividualVisit(payload) {
    this.visitResourceService.saveVisit(payload).subscribe(
      (savedVisit) => {
        this.isBusy = false;
        this.startedVisit = false;
        this.todayVisitService.activateVisitStartedMsg();
        this.visitStarted.emit(savedVisit);
      },
      (error) => {
        setTimeout(() => {
          this.isBusy = false;
          this.error = 'Error starting visit';
          this.startedVisit = false;
          this.todayVisitService.hideVisitStartedMessage();
          console.error('Error starting visit', error);

        }, 3000);
      }
    );
  }
  public onLocationChanged(locations) {
    this.selectedLocation = locations.locations;
  }

  public onCohortChange($event) {
    this.retrospectiveDataEntryService.updateRetroSettings();
    this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
      const cohortVisit = this.getCohort();
      const selectedDatePast = moment(cohortVisit.startDate).isBefore(moment(), 'day');
      if (retroSettings) {
        const retroDateEqualToCohortVisitDate = retroSettings &&
        moment(cohortVisit.startDate).isSame(moment(retroSettings.visitDate), 'day');
        this.isGroupRetrospective = !(selectedDatePast && retroDateEqualToCohortVisitDate);
      } else {
        this.isGroupRetrospective = selectedDatePast;
      }


    });
  }

  public activateRetrospectiveDataEntry(cohortVisit) {
    const providerAttribute = this.communityGroupService.getGroupAttribute('provider', this.patientCohort.cohort.attributes);
    if (providerAttribute && providerAttribute.value) {
      const v = 'custom:(person:(uuid,display,attributes:(attributeType:(uuid),value,display)),uuid)';
      this.isBusy = true;
      this._subscription.add(this.providerResourceService.getProviderByPersonUuid(providerAttribute.value, v)
        .subscribe((provider: any) => {
          this.isBusy = false;
          this.retrospectiveDataEntryService.updateProperty('retroVisitDate', moment(cohortVisit.startDate).format('YYYY-MM-DD'));
          this.retrospectiveDataEntryService.updateProperty('retroLocation',
            JSON.stringify({ label: cohortVisit.location.display, value: cohortVisit.location.uuid }));
          this.retrospectiveDataEntryService.updateProperty('retroProvider',
            JSON.stringify({ label: provider.person.display, value: provider.person.uuid, providerUuid: provider.person.uuid }));
          this.retrospectiveDataEntryService.updateProperty('enableRetro', true);
        }, (error) => {
          this.isBusy = false;
          console.log(error);
        }));
    }
  }

  public setRetroDateTime(settings) {
    return new Date(settings.visitDate + ', ' + settings.visitTime);
  }



  public showModal(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal, { class: 'modal-lg' });
  }

  public saveAppointment(payload) {
    this.visitResourceService.getPatientVisits({ patientUuid: this.patientUuid }).subscribe((visits) => {
      this.todayVisits = this.todayVisitService.filterVisitsByDate(visits, new Date());
      if (this.todayVisits.length === 0) {
        this.appointmentResourceService.saveAppointment(payload).subscribe(
          (savedAppoint) => {
            console.log('appointment saved', savedAppoint);
          }
        );
      } else {
        console.log('appointment already saved');
      }
    });
  }

  public appointmentDate() {
    const d = new Date();
    const year = '' + d.getFullYear();
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      hour = '' + d.getHours(),
      min = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    if (hour.length < 2) { hour = '0' + hour; }
    if (min.length < 2) { min = '0' + min; }
    if (seconds.length < 2) { seconds = '0' + seconds; }

    return [year, month, day].join('-') + ' ' + [hour, min, seconds].join(':');
  }

}
