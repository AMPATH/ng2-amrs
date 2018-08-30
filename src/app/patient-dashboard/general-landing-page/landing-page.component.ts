import { Component, OnInit, OnDestroy, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Subscription , Observable , Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ProgramService } from '../programs/program.service';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../models/patient.model';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';
import { PatientReferralService } from '../../referral-module/services/patient-referral-service';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { Encounter } from '../../models/encounter.model';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralLandingPageComponent implements OnInit, OnDestroy {
  @Input()
  public hideList: boolean = false;
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('modal')
  public modal: ModalComponent;
  public patient: Patient = new Patient({});
  public currentError: string;
  public availablePrograms: any[] = [];
  public requiredProgramQuestions: any[] = [];
  public hasError: boolean = false;
  public hasValidationErrors: boolean = false;
  public programsBusy: boolean = false;
  public program: any;
  public availableProgramsOptions: any[] = [];
  public isReferral: boolean = false;
  public submittedEncounter: any = {};
  public selectedProgram: any;
  public referralProgramOnDetail: any;
  public errors: any[] = [];
  public referralPrograms: any[] = [];
  public enrollmentButtonActive: boolean  = false;
  public enrollmentCompleted: boolean  = false;
  public isFocused: boolean = false;
  public locations: any = [];
  public programSpecificLocations: any = [];
  public dateEnrolled: string;
  public isEditLocation: any;
  public addBackground: any;
  public isEdit: boolean = false;
  public dateCompleted: string;
  public programIncompatible: boolean = false;
  public incompatibleMessage: any = [];
  public confirmationMesssage: string;
  public incompatibleCount: number = 0;
  public enrolledProgrames: any = [];
  public incompatibleProgrames: any = [];
  public reasonForUnenroll: string = `
  The selected program is incompatible with the following programs, please unenroll to continue.`;
  public selectedLocation: any;
  public allProgramVisitConfigs: any = {};
  public programDepartments: any = [];
  public department: string;
  public programHasWorkflows: boolean = false;
  public selectedWorkflow: any;
  public programWorkflows: any[] = [];
  public programForms: any[] = [];
  public selectedWorkFlowState: any;
  public workflowStates: any[] = [];
  public parentComponent: string = 'landing-page';
//  public programList: any[] = require('../programs/programs.json');
  public availableDepartmentPrograms: any[] = [];
  public selectedEncounter: Encounter;
  public showReferralEncounterDetail: boolean = false;
  public encounterViewed: boolean = false;
  private departmentConf: any[];
  private _datePipe: DatePipe;
  private subscription: Subscription;
  private locationSubscription: Subscription;
  private locationReferredFrom: any = '';
  /**
   * PROGRAM EDIT MODE HAS SINCE BEEN DISABLED. THIS COMPONENT STILL HAS SOME EDIT CODE JUST IN
   * CASE IT WILL BE ENABLED IN FUTURE
   *
   */
  constructor(private patientService: PatientService,
              private programService: ProgramService,
              private departmentProgramService: DepartmentProgramsConfigService,
              private patientReferralService: PatientReferralService,
              private userDefaultPropertiesService: UserDefaultPropertiesService,
              private patientReferralResourceService: PatientReferralResourceService,
              private patientProgramResourceService: PatientProgramResourceService) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.patientReferralService.formsComplete.subscribe((complete) => {
      if (complete) {
        this.formsCompleted(complete);
      }
    });
    this.updateEnrollmentButtonState();
    this.loadProgramBatch();
    this.getDepartmentConf();
    // this.fetchPatientProgramVisitConfigs();
    this.handleReferral();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  public loadProgramsPatientIsEnrolledIn(patientUuid: string) {
    return Observable.create((observer: Subject <any>) => {
      if (patientUuid) {
        this.programService.getPatientEnrolledProgramsByUuid(patientUuid).subscribe(
          (data) => {
            if (data) {
              this.enrolledProgrames = data;
              observer.next(data);
            }
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('patientUuid is required');
      }
    }).first();
  }

  public toggleDropDown(row: any) {
    row.isEdit = _.isNil(row.isEdit) ? true : !(row.isEdit) as boolean;
  }

  public showReferralEncounter(row: any) {
    this.getProgramWorkflows(row.programUuid);
    let referralEncounters = _.filter(this.patient.encounters, (encounter: any) => {
        if (encounter && encounter.location && encounter.location.uuid) {
            return encounter.location.uuid === row.referred_from_location_uuid;
        }
      });

    this.selectedEncounter = new Encounter(_.first(referralEncounters));
    if (this.selectedEncounter && this.selectedEncounter.uuid) {
      this.patientReferralService.getReferralEncounterDetails(this.selectedEncounter.uuid)
        .subscribe((encounterWithObs) => {
        // search for PATIENT CHANGE STATE obs item. PATIENT CHANGE STATE is a required field
        let patientState = _.find(encounterWithObs.obs, (singleOb) => {
          return singleOb.concept.uuid === 'aad64a84-1a63-47e3-a806-fb704b52b709';
        });
        this.referralProgramOnDetail = row;
        // override the default state value
        this.referralProgramOnDetail.program_workflow_state = patientState.value.display;
        this.staticModal.show();
        this.showReferralEncounterDetail = true;
      });
    }
  }

  public hideEncounterModal() {
    this.showReferralEncounterDetail = false;
    this.staticModal.hide();
    this.encounterViewed = true;
    this.selectedEncounter = null;
  }

  public referBack(row: any) {
    this.isReferral = true;
    this.selectedProgram = row;
    this.program = { value: row.programUuid };
    this.userDefaultPropertiesService.getLocations()
      .map((response: Response) => response.json()).subscribe((locations: any) => {
      let location = _.find(locations.results, (_location: any) => {
        return _location.display.trim() === row.referred_from_location.trim();
      });
      this.selectedLocation = { value: location.uuid, label: location.display };
      let workflowState = _.find(this.selectedWorkflow.states, (state: any) => {
        return state.concept.uuid === '15977097-13b7-4186-80a7-a78535f27866';
      });

      if (!_.isUndefined(workflowState)) {
        this.selectedWorkFlowState = workflowState;
      }
      this.handleReferral(true);
    });
  }

  public getSelectedLocation(loc) {
    if (loc.locations) {
      this.selectedLocation = loc.locations;
    } else {
      this.selectedLocation = null;
    }
    this._removeErrorMessage();
    this.checkIfEnrollmentIsAllowed();
    if (this.isReferral) {
      this.referPatient();
    }
    this.updateEnrollmentButtonState();
  }

  public onReferralSuccess() {
    this.isReferral = false;
    this.patientReferralService.saveProcessPayload(null);
    this._resetVariables();
    this.patientService.fetchPatientByUuid(this.patient.uuid);
  }

  public onAbortingReferral() {
    this.patientReferralService.saveProcessPayload(null);
    this._removeErrorMessage();
    this.isReferral = false;
  }

  // EDIT CODE
  public editPatientEnrollment(row: any) {
    row.isFocused = true;
    this.isEdit = true;
    let payload = {};
    let location;
    if (typeof this.isEditLocation === 'undefined') {
        location = row.enrolledProgram.openmrsModel.location.uuid;
    }else {
        location = this.isEditLocation.locations;
    }
    if (this.isValidForm(row)) {
      if (_.isNil(row.dateCompleted)) {
        delete row.enrolledProgram.uuid;
      }
      payload = this.programService.createEnrollmentPayload(
        row.program.uuid, this.patient, row.dateEnrolled, row.dateCompleted, location,
        row.enrolledProgram.uuid);
      if (payload) {
        setTimeout(() => {
          this._updatePatientProgramEnrollment(payload);
        }, 2000);
      }
    }
  }

  public enrollPatientToProgram(asReferral: boolean = false) {
    this.isFocused = true;
    this.isEdit = false;
    let payload = {};
    this.checkIncompatibility(this.program.value);
    if (this.programIncompatible === true) {
          this.isFocused = false;
    } else {
       if (this.isValidForm({
           dateEnrolled: this.dateEnrolled,
           dateCompleted: this.dateCompleted
       })) {
       payload = this.programService.createEnrollmentPayload(
        this.program.value, this.patient, this.dateEnrolled,
        this.dateCompleted, this.selectedLocation.value, '');
       if (payload) {
         this._updatePatientProgramEnrollment(payload);
      }
    }

   }

  }

  public referPatient() {
    if (this.hasValidReferralDate()) {
      this.isReferral = true;
      if (this.isValidForm({
          dateEnrolled: this.dateEnrolled,
          dateCompleted: this.dateCompleted})) {
        this.handleReferral();
      }
    }
  }

  public onAddBackground(color) {
    this.addBackground = color;
  }

  public getSelectedLocationToEdit(loc) {
    this.isEditLocation = loc;
  }

  public hasValidReferralDate() {
    if (this.dateEnrolled !== moment().format('Y-MM-DD')) {
      this.hasValidationErrors = true;
      this.currentError = this.dateEnrolled ? 'Referral date cannot be in future or in the past'
      : 'Date Enrolled is required';
      return false;
    } else {
      this._removeErrorMessage();
      return true;
    }
  }

  public onProgramChange($event) {
      let programUuid = $event ? $event.value : null;
      if (programUuid) {
       this.programIncompatible = false;
       this.incompatibleProgrames = [];
       this.checkForRequiredQuestions();
       this.selectedProgram = _.find(this.patient.enrolledPrograms, (_program) => {
          return _program.programUuid === programUuid;
        });
       this.programSpecificLocations = this.getProgramSpecificLocations(
       this.selectedProgram.program.uuid);
       this.getProgramWorkflows(programUuid);
       this.checkIfEnrollmentIsAllowed();
      // check the compatibility of the program
       this.checkIncompatibility(programUuid);
      } else {
        this._removeErrorMessage();
      }
      this.updateEnrollmentButtonState();

  }

  public getProgramSpecificLocations(uuid) {
    return this.allProgramVisitConfigs[uuid].visibleLocations;
  }

  public getWorkFlowState(state) {
    this.selectedWorkFlowState = state;
  }

  public getProgramWorkflows(programUuid) {
    this.programService.getProgramWorkFlows(programUuid).subscribe((workflows: any[]) => {
      this.programWorkflows = _.filter(workflows, (w) => !w.retired);
      this.programHasWorkflows = this.programWorkflows.length > 0;
      // we don't need to select states any more. Default state is 'In Care'
      this.selectedWorkflow = _.first(this.programWorkflows);
      // add program state if it has a workflow
      // console.log('sssssssssssssssssssssssssssaa====', this.selectedWorkflow);
      if (this.selectedWorkflow) {
        // incare state
        this.workflowStates = _.filter(this.selectedWorkflow.states, (state: any) => {
          return state.concept.uuid === '72443cac-4822-4dce-8460-794af7af8167';
        });
        // console.log('xxxxxxxxxxxxxxxxxxxx====', this.workflowStates);
        if (!_.isEmpty(this.workflowStates)) {
          this.selectedWorkFlowState = JSON.stringify(_.first(this.workflowStates));
          // console.log('sssssssssssssssssssssssssssaa====', this.selectedWorkFlowState);
        }
      }
    });
  }

  public setWorkFlowStates() {
    this.workflowStates = this.selectedWorkflow.states;
  }

  public isReferred(enrolledProgram: any): boolean {
    let refer = '0c5565c5-45cf-40ab-aa6d-5694aeabae18';
    // enforce current location
    let location = (this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject())
      .uuid;
    let filtered = _.filter(enrolledProgram.states, (patientState: any) => {
      return patientState.endDate === null && patientState.state.concept.uuid === refer;
    });
    return filtered.length > 0 && location === enrolledProgram.location.uuid;
  }

  public fetchPatientProgramVisitConfigs() {
    this.allProgramVisitConfigs = {};
    let sub = this.patientProgramResourceService.
    getPatientProgramVisitConfigs(this.patient.uuid).subscribe(
      (programConfigs) => {
        this.allProgramVisitConfigs = programConfigs;
      },
      (error) => {
        this.errors.push({
          id: 'program configs',
          message: 'There was an error fetching all the program configs'
        });
        console.error('Error fetching program configs', error);
      });
  }

  public isUnenrollmentCancel(event) {
    if (event) {
      this.program = undefined;
      this.programIncompatible = false;
    }
  }
  public isUnenrollmentComplete(event) {
    if (event) {
      this.programIncompatible = false;
      this.patientService.fetchPatientByUuid(this.patient.uuid);
      this.loadProgramBatch();
      this.getSelectedDepartment(this.department);
    }
  }

  public checkForRequiredQuestions(): void {
    this.requiredProgramQuestions = [];
    let program: any = this.allProgramVisitConfigs[this.program.value];
    if (program && !_.isUndefined(program.enrollmentOptions)
      && !_.isUndefined(program.enrollmentOptions.requiredProgramQuestions)) {
      this.requiredProgramQuestions = program.enrollmentOptions.requiredProgramQuestions;
    }
  }

  public onRequiredQuestionChange(event: string) {
    // pick questions that have wrong answer
    let questionWithWrongAnswer = _.find(this.requiredProgramQuestions, (question) => {
      return question.value !== question.enrollIf;
    });

    if (questionWithWrongAnswer) {
      this._preQualifyProgramEnrollment(questionWithWrongAnswer);
    } else {
      this._removeErrorMessage();
    }
    this.updateEnrollmentButtonState();
  }

  public getDepartmentConf() {
    this.departmentProgramService.getDartmentProgramsConfig()
      .subscribe((results) => {
        if (results) {
          this.departmentConf = results;
          this._filterDepartmentConfigByName();
        }
      });

  }

  public getSelectedDepartment(department: string) {
    this.department = department;
    this.program = undefined;
    this._removeErrorMessage();
    let departmentPrograms = _.map(this._getProgramsByDepartmentName(), 'uuid');
    this.availableDepartmentPrograms = _.filter(this.availablePrograms, (program: any) => {
      return _.includes(departmentPrograms, program.program.uuid);
    });
    this.availableDepartmentPrograms = _.map(this.availableDepartmentPrograms,
      (availableProgram) => {
        return {
          label: availableProgram.program.display,
          value: availableProgram.program.uuid
        };
      });
    // sort alphabetically;
    this.availableDepartmentPrograms = _.orderBy(this.availableDepartmentPrograms,
      ['label'], ['asc']);
  }

  public formsCompleted(event: boolean) {
    this.programForms = [];
  }

  public getReferredByLocation(enrollmentUuid): Observable<any> {
    return this.patientReferralResourceService
      .getReferralLocationByEnrollmentUuid(enrollmentUuid);

  }

  public removeFromQueue() {
    this.updateReferalNotificationStatus();
  }

  private updateEnrollmentButtonState() {
      this.enrollmentButtonActive = !!this.program && !this.hasValidationErrors;
  }

  private handleReferral(referBack?: boolean): void {
    if (this.program) {
      this.setReferralPayload(referBack);
      let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
      this.submittedEncounter = {
        encounterLocation: { value: location.uuid, label: location.display },
        encounter: []
      };
    }
    this.patientReferralService.getProcessPayload().subscribe((payload) => {
      if (payload && !_.isUndefined(payload.submittedEncounter)) {
          this.isReferral = true;
          this.program = payload.program.program;
          this.selectedProgram = payload.program;
          this.referralPrograms = payload.referralPrograms;
          this.selectedWorkFlowState = payload.selectedState;
          this.programForms = payload.referralPrograms;
          this.selectedLocation = payload.selectedLocation;
          this.submittedEncounter = payload.submittedEncounter;
          // this.setReferralPayload(false);
      }
    });
  }

  private setReferralPayload(referBack: boolean = false): void {
    let _config = this.allProgramVisitConfigs[this.program.value];
    let targetStateChange: any;
    if (_config) {
      let enrollmentOptions = _.get(_config, 'enrollmentOptions');
      _.extend(this.selectedProgram, enrollmentOptions);
      if (this.referralProgramOnDetail && referBack) {
        _.extend(this.selectedProgram, {
          patient_referral_id: this.referralProgramOnDetail.patient_referral_id
        });
      }
      let stateChangeForms = _.get(_config, 'stateChangeForms');
      if (!_.isEmpty(stateChangeForms)) {
        targetStateChange = _.find(stateChangeForms, (state) => {
          // refer state
          return referBack ? state.uuid === '15977097-13b7-4186-80a7-a78535f27866'
            : state.uuid === '0c5565c5-45cf-40ab-aa6d-5694aeabae18';
        });
        let targetProgramState = _.first(_.filter(this.selectedWorkflow.states,
          (state: any) => {
            return referBack ? state.concept.uuid === '15977097-13b7-4186-80a7-a78535f27866'
              : state.concept.uuid === '0c5565c5-45cf-40ab-aa6d-5694aeabae18';
          }));
        this.referralPrograms = [this.selectedProgram];
        this.selectedWorkFlowState = targetProgramState;
        this.programForms = targetStateChange.forms;
        _.extend(targetProgramState, {
          programForms: this.programForms,
          referralPrograms: this.referralPrograms,
          program: this.selectedProgram,
          selectedLocation: this.selectedLocation,
          selectedState: this.selectedWorkFlowState,
          forms: targetStateChange.forms
        });
        this.patientReferralService.saveProcessPayload(targetProgramState);
      }
    }
  }

  private checkIfEnrollmentIsAllowed(): void {
    let program = this.allProgramVisitConfigs[this.program.value];
    if (program && !_.isUndefined(program.enrollmentAllowed)) {
      if (!program.enrollmentAllowed) {
        this._showErrorMessage('The patient is not allowed to be enrolled in this program. ' +
          'Only female patients are allowed');
      }
    } else {
      this._removeErrorMessage();
    }
  }

  private toOpenmrsDateFormat(dateToConvert: any): string {
    let date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }

  private loadProgramBatch(): void {
    this._resetVariables();
    this.programsBusy = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.programsBusy = false;
        if (patient) {
          this.patient = patient;
         // this.availablePrograms = patient.enrolledPrograms;
          this.availablePrograms  =  _.filter( patient.enrolledPrograms,  (item) => {
              return item.program.uuid !== '781d8a88-1359-11df-a1f1-0026b9348838' &&
                item.program.uuid !== '781d8880-1359-11df-a1f1-0026b9348838';
            });
          this.availableProgramsOptions = _.map(this.availablePrograms,
            (availableProgram) => {
            return {
              label: availableProgram.program.display,
              value: availableProgram.program.uuid
            };
          });

          // sort alphabetically;
          this.availableProgramsOptions = _.orderBy(this.availableProgramsOptions,
            ['label'], ['asc']);
          this.enrolledProgrames = _.filter(patient.enrolledPrograms, 'isEnrolled');
          _.each(this.enrolledProgrames, (program) => {
              if (this.isReferred(program.enrolledProgram)) {
                this.getReferredByLocation(program.enrolledProgram.uuid)
                  .subscribe((referral) => {
                    program.referred_from_location = referral.referred_from_location;
                    program.referral_completed = !_.isNil(referral.notification_status);
                    program.referral_reason = referral.referral_reason;
                    program.program_workflow_state = referral.program_workflow_state;
                    program.patient_referral_id = referral.patient_referral_id;
                    program.referred_from_location_uuid = referral.referred_from_location_uuid;
                });
              }
          });
          this.fetchPatientProgramVisitConfigs();
        }
      }, (err) => {
        this.hasError = true;
        this.errors.push({
          id: 'Patient Care Programs',
          message: 'error fetching available programs',
          error: err
        });
        this.programsBusy = false;
      });
  }

  private updateReferalNotificationStatus() {
    this.patientReferralService.updateReferalNotificationStatus({
      patient_referral_id: this.referralProgramOnDetail.patient_referral_id,
      notificationStatus: 1
    }).subscribe((response) => {
      this.hideEncounterModal();
      this.patientService.fetchPatientByUuid(this.patient.uuid);
    }, (error) => {
      console.log('updateReferalNotificationStatus error ====> ', error);
    });
  }

  private isValidForm(row: any) {
    let currentLocation;
    if (row.enrolledProgram && row.enrolledProgram.openmrsModel &&
      row.enrolledProgram.openmrsModel.location) {
      currentLocation = row.enrolledProgram.openmrsModel.location.uuid;
    }
    if (!this._formFieldsValid(row.dateEnrolled, row.dateCompleted,
        this.selectedLocation || currentLocation)) {
      row.validationError = this.currentError;
      this.isFocused = false;
      // edit was disabled. This is left here incase its enabled in future
      if (this.isEdit) {
        this.currentError = '';
        if (!_.isNil(row.isFocused)) {
          row.isFocused = false;
        }
      }
    } else {
      row.validationError = '';
      this.hasValidationErrors = false;
    }
    return !this.hasValidationErrors;
  }

  private _sameEnrollmentLocationAllowed() {
    let patientEnrolled = !_.isNil(this.selectedProgram.enrolledProgram);
    if (patientEnrolled && !this.isReferral && !_.isNil(this.selectedLocation)) {
      let hasLocation = this.selectedProgram.enrolledProgram.location;
      if (!_.isNil(hasLocation) && hasLocation.uuid === this.selectedLocation.value) {
        this._showErrorMessage('Patient is already enrolled in this location in same program. ' +
          'You can only refer to same location. Otherwise change program or location.');
      } else {
        this._removeErrorMessage();
      }
    }
  }

  private _preQualifyProgramEnrollment(question: any) {
    let requiredStatus = _.find(question.answers, (ans) => ans.value === question.enrollIf);
    if (requiredStatus && question.value !== question.enrollIf) {
      this._showErrorMessage(question.name + ' MUST be ' + question.enrollIf + ' to be able to' +
        ' enroll the patient into this program');
    } else {
      this._removeErrorMessage();
    }
  }

  private _validateRequiredQuestions() {
    if (this.requiredProgramQuestions.length > 0) {
      this.onRequiredQuestionChange('');
    }
  }

  private _filterDepartmentConfigByName() {
    this.programDepartments = _.map(this.departmentConf, (config: any) => {
      return {name: config.name};
    });
  }

  private _getProgramsByDepartmentName() {
    let department = _.find(this.departmentConf, (config: any) => {
      return config.name === this.department;
    });
    return department ? department.programs : [];
  }

  private _updatePatientProgramEnrollment(payload) {
    this.programService.saveUpdateProgramEnrollment(payload).subscribe(
      (enrollment) => {
        this.isFocused = false;
        this.isEdit = false;
        if (enrollment) {
          this.enrollmentCompleted = true;
          let currentProgram: any = _.first(_.filter(this.availablePrograms,
            (_program: any) => {
              return !_program.isEnrolled && (_program.programUuid === this.program.value);
            }));
          if (currentProgram) {
            this.confirmationMesssage = 'The patient has been enrolled in ' +
              currentProgram.program.display  + ' at ' + enrollment.location.display +
              ' starting ' + moment(enrollment.dateEnrolled).format('MMM Do, YYYY');
          } else {
            currentProgram = _.first(_.filter(this.availablePrograms,
              (_program: any) => {
                return _program.isEnrolled && (_program.programUuid === this.program.value);
              }));
            this.confirmationMesssage = 'The patient enrollment has been switched from ' +
              currentProgram.enrolledProgram.location.display  + ' to '
              + enrollment.location.display +
              ' starting ' + moment(enrollment.dateEnrolled).format('MMM Do, YYYY');
          }
          this.loadProgramBatch();
          setTimeout(() => {
            this._resetVariables();
            this.patientReferralService.saveProcessPayload(null);
            this.patientService.fetchPatientByUuid(this.patient.uuid);
            this.enrollmentCompleted = false;
            this.updateEnrollmentButtonState();
          }, 3500);
        }
      }
    );
  }

  // THIS FUNCTION  HAS SOME EDIT MODE CODE. SEE THE BEGINNING OF THIS COMPONENT CLASS FOR MORE
  private _formFieldsValid(enrolledDate, completedDate, location) {

    let allFieldsValid = true;
    if (!this._isAllRequiredQuestionsAnswered()) {
      allFieldsValid = false;
    }

    if (!this._sameEnrollmentLocationAllowed()) {
      allFieldsValid = false;
    }

    if (!this.isEdit && _.isUndefined(this.program)) {
      this._showErrorMessage('Program is required.');
      allFieldsValid = false;
    }

    if (this.programHasWorkflows
      && (_.isNil(this.selectedWorkflow) || _.isNil(this.selectedWorkFlowState))) {
      this._showErrorMessage('You must assign a workflow and state to the program');
      allFieldsValid = false;
    }

    // EDIT MODE CODE
    if (!_.isNil(enrolledDate) && !_.isNil(completedDate) && !this.isEdit) {
      this._showErrorMessage('Date Completed should not be specified while enrolling');
      allFieldsValid = false;
    }

    // when date is reset, the date remains an empty string instead of undefined.
    // Hence empty validation
    if (_.isNil(enrolledDate) || _.isEmpty(enrolledDate)) {
      this._showErrorMessage('Date Enrolled is required.');
      allFieldsValid = false;
    }

    if (_.isNil(location)) {
      this._showErrorMessage('Location Enrolled is required.');
      allFieldsValid = false;
    }

    if ((!_.isNil(completedDate) && !moment(completedDate).isAfter(enrolledDate))) {
      this._showErrorMessage('Date Completed should be after Date Enrolled');
      allFieldsValid = false;
    }

    if (this._isFutureDates(enrolledDate, completedDate) === true) {
      this._showErrorMessage('Date Enrolled or Date Completed should not be in future');
      allFieldsValid = false;
    }

    return allFieldsValid;
  }

  private _isAllRequiredQuestionsAnswered(): boolean {
    let program: any = this.allProgramVisitConfigs[this.program.value];
    if (program && !_.isUndefined(program.enrollmentOptions)
      && !_.isUndefined(program.enrollmentOptions.requiredProgramQuestions)) {
      let unAnsweredQuestions = _.filter(program.enrollmentOptions.requiredProgramQuestions,
        (question) => {
        return _.isNil(question.value);
      });
      if (unAnsweredQuestions.length > 0) {
        this._showErrorMessage('All required questions must be filled');
        return false;
      }
      this._validateRequiredQuestions();

      if (this.hasValidationErrors) {
        return false;
      }
    }
    return true;
  }

  private _isFutureDates(enrolledDate, completedDate) {
    let today: Date;
    today = new Date();
    if (moment(enrolledDate).isAfter(today) || (!_.isNil(completedDate)
      && moment(completedDate).isAfter(today))) {
      return true;
    }
    return false;
  }

  private _showErrorMessage(message) {
    this.hasValidationErrors = true;
    this.currentError = message;
  }

  private _removeErrorMessage() {
    this.hasValidationErrors = false;
    this.currentError = undefined;
  }

  private _resetVariables() {
    this.availablePrograms = [];
    this.programsBusy = false;
    this.hasError = false;
    this.hasValidationErrors = false;
    this.currentError = '';
    this.program = null;
    this.department = undefined;
    this.isEdit = false;
    this.errors = [];
    this.isReferral = false;
    this.programForms = [];
    this.referralPrograms = [];
    this.dateEnrolled = undefined;
    this.dateCompleted = undefined;
    this.selectedLocation = undefined;
    this.isEditLocation = undefined;
    this.selectedWorkFlowState = undefined;
    this.selectedWorkflow = undefined;
  }

  private checkIncompatibility(programUUid) {
      this.incompatibleCount = 0;
      this.incompatibleMessage = [];
      let patientPrograms = this.enrolledProgrames;
      // get programs patient has enrolled in

      let enrolledList: Array<any> = [];
      let incompatibleList: Array<any> = [];

      let programList = this.allProgramVisitConfigs;

      _.forEach(patientPrograms, (program: any) => {
             if (program.dateEnrolled !== null) {
               enrolledList.push(
                 {uuid: program.program.uuid,
                 enrolledDate: program.dateEnrolled,
                 enrollmentUuid: program.enrolledProgram.uuid,
                 name: program.program.display
                 }
                 );
             }
      });

      /* for the selected program.Check if it has compatibilty
         issues with any of the enrolled programs
      */

      _.forEach(programList, (list: any, index) => {
           // get program
           if (index === programUUid) {

               // get incompatibilies
           if (list.incompatibleWith) {

                let incompatibleWith = list.incompatibleWith;
                if (incompatibleWith.length > 0) {
                  _.forEach(incompatibleWith, (incompatibleProgram) => {
                      incompatibleList.push(incompatibleProgram);
                  });
                }

             }

           }
      });

      /* With the list of incompatible programs for selected
         program and enrolled programs we can check if there is a match
         i.e an enrolled program should not be in an incompatibility list
         for the selected program
      */

      _.forEach(enrolledList, (enrolled) => {
        for (let incompatible of incompatibleList){
          if (incompatible === enrolled.uuid) {
                this.programIncompatible = true;
                // get the program name for the message
                let progName = programList[incompatible].name;
                this.incompatibleProgrames.push(enrolled);
                this.incompatibleCount++;
              }
        }
      });

      if (this.incompatibleCount > 0) {
           this.programIncompatible = true;
      }else {
           this.programIncompatible = false;
      }

  }
}
