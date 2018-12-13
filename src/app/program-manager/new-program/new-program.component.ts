import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { ProgramManagerBaseComponent } from '../base/program-manager-base.component';
import { PatientService } from '../../patient-dashboard/services/patient.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import {
  DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';
import {
  UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';

import { LocalStorageService } from '../../utils/local-storage.service';
import { ProgramManagerService } from '../program-manager.service';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { RetrospectiveDataEntryService } from 'src/app/retrospective-data-entry/services/retrospective-data-entry.service';

@Component({
  selector: 'new-program',
  templateUrl: './new-program.component.html',
  styleUrls: ['./new-program.component.css']
})
export class NewProgramComponent extends ProgramManagerBaseComponent implements OnInit {
  newlyEnrolledGroup: any;
  public incompatibleProgrames: any[] = [];
  public unenrolledProgrames: any[] = [];
  public unenrollmentForms: string[] = [];
  public today: Date = new Date();
  public newlyEnrolledProgram: any;
  public unenrollExpressely: boolean = false;
  public enrolling: boolean = false;
  public isReferral: boolean = false;
  public maxDate: string;
  public reasonForUnenroll: string = `
  The selected program is incompatible with the following programs, please unenroll to continue.`;
  public enrollToGroup: string;
  public groupEnrollmentState: any;
  public patientCurrentGroups: any;
  public retroSettings: any;

  constructor(public patientService: PatientService,
    public programService: ProgramService,
    public router: Router,
    public route: ActivatedRoute,
    public departmentProgramService: DepartmentProgramsConfigService,
    public userDefaultPropertiesService: UserDefaultPropertiesService,
    public patientProgramResourceService: PatientProgramResourceService,
    public cdRef: ChangeDetectorRef,
    public localStorageService: LocalStorageService,
    private routesProviderService: RoutesProviderService,
    private programManagerService: ProgramManagerService,
    private groupMemberService: CommunityGroupMemberService) {
    super(
      patientService,
      programService,
      router,
      route,
      departmentProgramService,
      userDefaultPropertiesService,
      patientProgramResourceService, cdRef, localStorageService);
    this.maxDate = moment().format('YYYY-MM-DD');
  }

  public ngOnInit() {
    this.setUserDefaultLocation();
    this.showForms = false;
    this.route.params.subscribe((params) => {
      this.getDepartmentConf();
      this.loadPatientProgramConfig().pipe(take(1)).subscribe((loaded) => {
        if (loaded) {
          this.loaded = true;
          this.getCurrentPatientGroups(this.patient.uuid);
          this.dateEnrolled = new Date().toISOString().slice(0, 10);

          if (params['step']) {
            this.loadOnParamInit(params);
          }
          let dept = JSON.parse(this.localStorageService.getItem('userDefaultDepartment'));
          
          this.department = dept[0].itemName;
          this.selectDepartment(dept[0].itemName);
        }
      }, () => {
        this.loaded = true;
        this.hasError = true;
      });
    });
  }

  public selectDepartment(value) {
    // remove any error message before validating again
    this.removeMessage();
    this.addToStepInfo({
      department: value
    });
    this.department = value;
    this.goToProgram();
  }

  public selectProgram(program) {
    this.program = program;
    this.selectedProgram = _.find(this.availablePrograms, (_program: any) => {
      return _program.programUuid === this.program;
    });
    this.programVisitConfig = this.allPatientProgramVisitConfigs[this.program];
    this.addToStepInfo({
      selectedProgram: this.selectedProgram,
      programVisitConfig: this.programVisitConfig
    });
    this.checkForRequiredQuestions();
    this.checkIfEnrollmentIsAllowed();
    this.goToDetails();

  }

  public goToProgram() {
    if (this.department) {
      this.removeMessage();
      this.availableDepartmentPrograms = _.orderBy(this.getProgramsByDepartmentName(),
        ['name'], ['asc']);
      if (this.availableDepartmentPrograms.length === 0) {
        this.showMessage('No Active programs in this department');
      } else {
        this.tick().then(() => {
          this.nextStep = true;
          this.currentStep++;
          this.title = 'Start ' + this.department + ' Program';
        });
      }
    } else {
      this.showMessage('Please select a department to continue');
    }
  }

  public completeIncompatibilityStep() {
    this.unenrollExpressely = false;
    this.currentStep++;
    this.nextStep = true;
    this.title = 'Start';
    this.checkForRequiredQuestions();
    this.checkIfEnrollmentIsAllowed();
  }

  public onUnenrollmentCancel() {
    this.incompatibleProgrames = [];
    this.incompatibleCount = 0;
    this.currentStep--;
    this.back();
  }

  public goBack() {
    if (this.currentStep === 4) {
      this.currentStep = this.currentStep - 2;
      this.jumpStep = this.currentStep;
    } else {
      this.back();
    }
  }

  public goToDetails() {
    // incompatibility step has 'go back' issue. enforce the current step here
    this.currentStep = 2;
    this.jumpStep = -1;
    if (this.program) {
      this.removeMessage();
      this.unenrollAndGoToDetails();
    } else {
      this.showMessage('Please select a program to continue');
    }
  }

  public showEnrollmentFormsOrEnrollOnValidation() {
    if (this.formValidated() && !this.hasValidationErrors) {
      this.filterStateChangeEncounterTypes();
      // if there are no required forms, go ahead and enroll the patient
      if (this.enrollmentEncounters.length > 0) {
        this.showForms = true;
      } else {
        this.enrollPatientToProgram();
      }
    }
  }

  public enrollPatientToProgram() {
    this.enrolling = true;
    const payload = {
      programUuid: this.selectedProgram.programUuid,
      patient: this.patient,
      dateEnrolled: this.dateEnrolled,
      dateCompleted: this.dateCompleted,
      location: this.selectedLocation.value,
      enrollmentUuid: ''
    };
    this.programManagerService.enrollPatient(payload).subscribe((enrollment) => {
      this.newlyEnrolledProgram = enrollment;
      if (this.enrollmentEncounters.length > 0) {
        _.extend(this.newlyEnrolledProgram, {
          formFilled: this.getFilledForm(_.first(this.enrollmentEncounters))
        });
      }
      this.enrolling = false;
      this.completeEnrollment();
    });
  }

  public startVisit() {
    const dashboardRoutesConfig: any = this.routesProviderService.patientDashboardConfig;
    const route: any = _.find(dashboardRoutesConfig.programs, (_route: any) =>
      _route['programUuid'] === this.newlyEnrolledProgram.program.uuid);
    let _route = '/patient-dashboard/patient/' + this.patient.uuid + '/' + route.alias + '/' +
      route.baseRoute + '/visit';

    this.router.navigate([_route], {});
  }

  public referPatient() {
    this.removeMessage();
    this.enrolling = true;
    let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    const payload = {
      submittedEncounter: this.submittedEncounter,
      referredToLocation: this.selectedLocation.value,
      referredFromLocation: location.uuid,
      patient: this.patient,
      dateEnrolled: this.dateEnrolled,
      programUuid: this.selectedProgram.programUuid
    };
    this.programManagerService.referPatient(payload).subscribe((enrollment) => {
      if (enrollment) {
        this.newlyEnrolledProgram = enrollment;
        if (this.enrollmentEncounters.length > 0) {
          _.extend(this.newlyEnrolledProgram, {
            formFilled: this.getFilledForm(_.first(this.enrollmentEncounters))
          });
        }

        this.enrolling = false;
        this.completeEnrollment();
      } else {
        this.enrolling = false;
        this.showMessage('Error. Could not refer the patient');
      }

    }, (error) => {
      this.enrolling = false;
      this.showMessage(error);
    });
  }

  public fillEnrollmentForm(form) {
    let _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/formentry';
    let routeOptions = {
      queryParams: {
        step: 4,
        parentComponent: 'programManager:new'
      }
    };

    this.addToStepInfo({
      enrollmentEncounters: [form.encounterType.uuid]
    });
    
    this.serializeStepInfo();
    this.router.navigate([_route, form.uuid], routeOptions);
  }

  public getSelectedLocation(loc) {
    if (loc.locations) {
      this.selectedLocation = loc.locations;
    } else {
      this.selectedLocation = null;
    }
    this.addToStepInfo({
      selectedLocation: this.selectedLocation
    });
    this.checkIfEnrollmentIsAllowed();
    this.checkIfSameEnrollmentLocationAllowed();
  }

  public saveEnrollmentDate(date) {
    this.dateEnrolled = date;
    this.addToStepInfo({
      dateEnrolled: date
    });
    this.checkIfEnrollmentIsAllowed();
  }

  public checkForRequiredQuestions(): void {
    this.requiredProgramQuestions = [];
    if (this.hasRequiredProgramQuestions()) {
      this.requiredProgramQuestions =
        this.programVisitConfig.enrollmentOptions.requiredProgramQuestions;
    }
  }

  public onRequiredQuestionChange(question) {
    question = this.checkRelatedQuestions(question);
    // pick questions that have wrong answer
    let questionWithWrongAnswer = _.find(this.requiredProgramQuestions, (q) => {
      return question.qtype === q.qtype && q.value !== q.enrollIf;
    });
    if (question.qtype === 'enrollToGroup') {
      this.enrollToGroup = question.value;
    }

    if (questionWithWrongAnswer) {
      this.preQualifyProgramEnrollment(questionWithWrongAnswer);
    } else {
      this.removeMessage();
    }
  }

  public editProgram(program) {
    let _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/program-manager/edit-program';
    let routeOptions = {

    };
    this.router.navigate([_route], routeOptions);
  }

  public filterStateChangeEncounterTypes(): void {
    if (this.hasStateChangeEncounterTypes()) {
      let encounterTypes =
        this.programVisitConfig.enrollmentOptions.stateChangeEncounterTypes.enrollment;
      let unenrollmentEncounterTypes =
        this.programVisitConfig.enrollmentOptions.stateChangeEncounterTypes.incompatible;
      if (this.isReferral) {
        encounterTypes =
          this.programVisitConfig.enrollmentOptions.stateChangeEncounterTypes.referral;
      }
      if (unenrollmentEncounterTypes) {
        this.unenrollmentForms = _.map(_.filter(unenrollmentEncounterTypes,
          'required'), 'uuid');
      }
      this.enrollmentEncounters = _.map(_.filter(encounterTypes,
        'required'), 'uuid');
    }
  }

  public deserializeStepInfo() {
    let stepInfo = this.localStorageService.getObject('pm-data');
    if (stepInfo) {
      this.department = stepInfo.department;
      this.selectedProgram = stepInfo.selectedProgram;
      this.program = this.selectedProgram.programUuid;
      this.dateEnrolled = stepInfo.dateEnrolled;
      this.selectedLocation = stepInfo.selectedLocation;
      this.submittedEncounter = stepInfo.submittedEncounter || [];
      this.enrollmentEncounters = stepInfo.enrollmentEncounters || [];
      this.incompatibleProgrames = stepInfo.incompatibleProgrames || [];
      this.isReferral = stepInfo.isReferral || false;
      this.programVisitConfig =
        stepInfo.programVisitConfig || this.allPatientProgramVisitConfigs[this.program];
      this.availableDepartmentPrograms = this.getProgramsByDepartmentName();
    } else {
      this.currentStep = 1;
      this.jumpStep = -1;
      let _route = '/patient-dashboard/patient/' + this.patient.uuid
        + '/general/general/program-manager/new-program';
      this.router.navigate([_route], {});
    }

  }

  private checkRelatedQuestions(question: any): any {
    question = this.resetRequiredQuestion(question);
    // check if it has related questions
    const questionsHasRelations = _.get(question, 'relatedQuestions');
    if (questionsHasRelations) {
      // show based on the parent answer
      _.each(question.relatedQuestions, (rq) => {
        if (rq.showIfParent === question.value) {
          if (!_.isNil(rq.value)) {
            question.enrollIf = rq.showIfParent;
          }
          this.requiredProgramQuestions.push(rq);
        }
      });
    }
    this.requiredProgramQuestions = _.uniqBy(this.requiredProgramQuestions, 'qtype');
    return question;
  }

  private resetRequiredQuestion(question): any {
    const questions = this.programVisitConfig.enrollmentOptions.requiredProgramQuestions;
    const targetQuestion = _.find(questions, (q: any) => {
      return question.qtype === q.qtype;
    });
    return targetQuestion ? targetQuestion : question;
  }

  private loadOnParamInit(params: any) {
    this.currentStep = parseInt(params.step, 10);
    this.jumpStep = this.currentStep;
    this.deserializeStepInfo();
    if (this.currentStep === 3) {
      this.unenrollAndGoToDetails();
    }
    if (this.currentStep === 4) {
      if (this.isReferral) {
        this.referPatient();
      } else {
        this.enrollPatientToProgram();
      }
    }
  }

  private getFilledForm(encounterType) {
    // get immediate encounter of type filled
    let encounterFilled = _.find(this.patient.encounters, (encounter) => {
      return encounter.encounterType.uuid === encounterType;
    });
    if (encounterFilled) {
      return encounterFilled.form.name;
    }
  }

  private completeEnrollment() {
    if (this.enrollToGroup === 'true') {
      let count = 1;
      this.refreshPatient().subscribe((refreshing) => {
        if (!refreshing) {
          this.groupEnrollmentState = {
            patient: this.patient,
            action: 'Enroll',
            currentEnrolledPrograms: _.filter(this.enrolledProgrames, (program) => program.isEnrolled),
            currentGroups: this.patientCurrentGroups
          };
          if (count === 1) {
            this.currentStep++;
            this.nextStep = true;
            count++;
          }
        }
      });
    } else {
      this.enrollmentCompleted = true;
      this.currentStep = this.currentStep + 2;
      this.jumpStep = this.currentStep;
      this.title = 'Program Successfully Started';
      this.unenrolledProgrames = this.getSerializedStepInfo('incompatibleProgrames');
      this.tick(3000).then(() => {
        this.refreshPatient();
        this.localStorageService.remove('pm-data');
      });
    }

  }

  private unenrollAndGoToDetails() {
    if (this.isIncompatibleChoice()) {
      _.each(this.incompatibleProgrames, (program) => {
        _.extend(program, {
          formFilled: this.getFilledForm(_.first(this.unenrollmentForms))
        });
      });
      // update step info with the filled forms
      this.addToStepInfo({ incompatibleProgrames: this.incompatibleProgrames });
      if (this.enrollmentEncounters.length > 0) {
        this.addToStepInfo({
          enrollmentEncounters: this.enrollmentEncounters
        });
      }
      this.filterStateChangeEncounterTypes();
      this.serializeStepInfo();
      this.unenrollExpressely = true;
      this.currentStep--;
    }
    this.skipIncompatibilityStep();
  }

  private skipIncompatibilityStep() {
    this.currentStep = this.currentStep + 2;
    this.jumpStep = this.currentStep;
    this.title = "start";
  }

  private isIncompatibleChoice() {
    this.incompatibleCount = 0;
    this.incompatibleMessage = [];
    let patientPrograms = this.enrolledProgrames;
    // get programs patient has enrolled in
    let incompatibleList: Array<any> = [];
    let enrolledList: Array<any> = _.map(patientPrograms, (program: any) => {
      return {
        uuid: program.programUuid,
        enrolledDate: program.dateEnrolled,
        enrollmentUuid: program.enrolledProgram._openmrsModel.uuid,
        name: program.enrolledProgram._openmrsModel.display
      };
    });
    /* for the selected program.Check if it has compatibilty
       issues with any of the enrolled programs
    */
    if (this.programVisitConfig && this.programVisitConfig.incompatibleWith) {
      incompatibleList = this.programVisitConfig.incompatibleWith;
    }
    /* With the list of incompatible programs for selected
       program and enrolled programs we can check if there is a match
       i.e an enrolled program should not be in an incompatibility list
       for the selected program
    */
    if (this.incompatibleProgrames.length > 0) {
      this.programIncompatible = true;
      this.incompatibleCount = this.incompatibleProgrames.length;
    } else {
      _.each(enrolledList, (enrolled) => {
        if (_.includes(incompatibleList, enrolled.uuid)) {
          this.programIncompatible = true;
          this.incompatibleProgrames.push(enrolled);
          this.incompatibleCount++;
        }
      });
    }

    return this.incompatibleCount > 0;
  }

  private checkIfEnrollmentIsAllowed(): void {
    if (this.programVisitConfig && !_.isUndefined(this.programVisitConfig.enrollmentAllowed)) {
      if (!this.programVisitConfig.enrollmentAllowed) {
        this.showMessage('The patient is not allowed to be enrolled in this program. ' +
          'Only female patients are allowed');
      } else {
        this.removeMessage();
      }
    } else {
      this.removeMessage();
    }
  }

  private checkIfSameEnrollmentLocationAllowed() {
    let patientEnrolled = !_.isNil(this.selectedProgram.enrolledProgram) &&
      _.isNull(this.selectedProgram.enrolledProgram.dateCompleted);
    if (patientEnrolled && !_.isNil(this.selectedLocation)) {
      let hasLocation = this.selectedProgram.enrolledProgram._openmrsModel.location;
      if (!_.isNil(hasLocation) && hasLocation.uuid === this.selectedLocation.value) {
        this.showMessage('Patient is already enrolled in this location in same program.');
      } else {
        this.removeMessage();
      }
    }
  }

  private preQualifyProgramEnrollment(question: any) {
    let requiredStatus = _.find(question.answers, (ans) => ans.value === question.enrollIf);
    if (requiredStatus && question.value !== question.enrollIf) {
      this.showMessage('The question <strong><em>' + question.name + '</em></strong> MUST be '
        + question.enrollIf + ' to be able to enroll the patient into this program');
    } else {
      this.removeMessage();
    }
  }

  private validateRequiredQuestions() {
    if (this.requiredProgramQuestions.length > 0) {
      this.onRequiredQuestionChange('');
    }
  }

  private formValidated() {
    let checkedForm = this.allRequiredQuestionsAnswered() && !_.isNil(this.selectedLocation)
      && !_.isNil(this.dateEnrolled);
    return this.hasInvalidFormFields(checkedForm);
  }

  private hasInvalidFormFields(checkedForm) {

    // when date is reset, the date remains an empty string instead of undefined.
    // Hence empty validation
    if (_.isNil(this.dateEnrolled) || _.isEmpty(this.dateEnrolled)) {
      this.showMessage('Date Enrolled is required.');
      checkedForm = false;
    }

    if (_.isNil(this.selectedLocation)) {
      this.showMessage('Location Enrolled is required.');
      checkedForm = false;
    }

    if (this.isFutureDate(this.dateEnrolled)) {
      this.showMessage('Date Enrolled should not be in future');
      checkedForm = false;
    }

    return checkedForm;
  }

  private allRequiredQuestionsAnswered(): boolean {
    if (this.hasRequiredProgramQuestions()) {
      let unAnsweredQuestions = _.filter(
        this.programVisitConfig.enrollmentOptions.requiredProgramQuestions, (question) => {
          return _.isNil(question.value);
        });
      if (unAnsweredQuestions.length > 0) {
        this.showMessage('All required questions must be filled');
        return false;
      }
      this.validateRequiredQuestions();

      if (this.hasValidationErrors) {
        return false;
      }
    }
    return true;
  }

  private hasRequiredProgramQuestions() {
    return this.programVisitConfig && !_.isUndefined(this.programVisitConfig.enrollmentOptions)
      && !_.isUndefined(this.programVisitConfig.enrollmentOptions.requiredProgramQuestions);
  }

  public goToSuccessStep(newGroup) {
    this.currentStep++;
    this.nextStep = true;
    this.newlyEnrolledGroup = newGroup;
  }

  getCurrentPatientGroups(patientUuid: string) {
    this.groupMemberService.getMemberCohortsByPatientUuid(patientUuid).subscribe((groups) => {
      this.patientCurrentGroups = _.filter(groups, (group) => !group.voided);
    });
  }

  public setUserDefaultLocation() {
    const location: any = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    if (location) {
      this.selectedLocation = {
        value: location.uuid,
        label: location.display
      };
    }
  }

}
