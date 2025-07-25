import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { ProgramManagerBaseComponent } from '../base/program-manager-base.component';
import { PatientService } from '../../patient-dashboard/services/patient.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { UserDefaultPropertiesService } from '../../user-default-properties/user-default-properties.service';

import { LocalStorageService } from '../../utils/local-storage.service';
import { ProgramManagerService } from '../program-manager.service';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { CommunityGroupMemberService } from '../../openmrs-api/community-group-member-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { RisonService } from '../../shared/services/rison-service';
import { PatientTypeService } from 'src/app/etl-api/patient-type.service';

@Component({
  selector: 'new-program',
  templateUrl: './new-program.component.html',
  styleUrls: ['./new-program.component.css']
})
export class NewProgramComponent
  extends ProgramManagerBaseComponent
  implements OnInit {
  public newlyEnrolledGroup: any;
  public unenrolledProgrames: any[] = [];
  public unenrollmentForms: string[] = [];
  public today: Date = new Date();
  public newlyEnrolledProgram: any;
  public unenrollExpressely = false;
  public enrolling = false;
  public isReferral = false;
  public isButtonVisible = true;
  public maxDate: string;
  public reasonForUnenroll = `
  The selected program is incompatible with the following programs, please unenroll to continue.`;
  public enrollToGroup: string;
  public groupEnrollmentState: any;
  public patientCurrentGroups: any;
  public retroSettings: any;
  public enrollPatientToGroup = false;
  public modalRef: BsModalRef;
  public autoEnrolFromGroup = false;
  showOtzEnrollmentForm = false;
  patientType: string;

  constructor(
    public patientService: PatientService,
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
    private locationResourceService: LocationResourceService,
    private groupMemberService: CommunityGroupMemberService,
    private risonService: RisonService,
    private modalService: BsModalService,
    public patientTypeService: PatientTypeService
  ) {
    super(
      patientService,
      programService,
      router,
      route,
      departmentProgramService,
      userDefaultPropertiesService,
      patientProgramResourceService,
      cdRef,
      localStorageService
    );
    this.maxDate = moment().format('YYYY-MM-DD');
    this.dateEnrolled = moment().format('YYYY-MM-DD');
  }

  public ngOnInit() {
    this.showForms = false;
    this.isButtonVisible = true;
    this.route.params.subscribe((params) => {
      this.getDepartmentConf();
      this.loadPatientProgramConfig()
        .pipe(take(1))
        .subscribe(
          (loaded) => {
            if (loaded) {
              this.setUserDefaultLocation();
              this.loaded = true;
              this.getCurrentPatientGroups(this.patient.uuid);
              const dept = JSON.parse(
                this.localStorageService.getItem('userDefaultDepartment')
              );
              this.department = dept[0].itemName;
              this.selectDepartment(dept[0].itemName);
              if (this.route.snapshot.queryParams.program) {
                this.selectProgram(this.route.snapshot.queryParams.program);
              }
              if (params['step']) {
                this.loadOnParamInit(params);
              }
              this.loadQueryParams();
            }
          },
          () => {
            this.loaded = true;
            this.hasError = true;
          }
        );
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
    if (
      this.selectedProgram.concept.uuid ===
      'fd90d6b2-7302-4a9c-ad1b-1f93eff77afb'
    ) {
      const otzEnrollmentFormUuid = 'ca5ccb72-5623-4b94-97a3-6b5dac5f8560';
      this.showOtzEnrollmentForm = true;
      this.router.navigate([
        '/patient-dashboard/patient/' +
          this.patient.uuid +
          '/general/general/formentry/' +
          otzEnrollmentFormUuid
      ]);
    } else {
      this.programVisitConfig = this.allPatientProgramVisitConfigs[
        this.program
      ];
      this.addToStepInfo({
        selectedProgram: this.selectedProgram,
        programVisitConfig: this.programVisitConfig
      });
      this.checkForRequiredQuestions();
      this.checkIfEnrollmentIsAllowed();
      this.goToDetails();
    }
  }

  public goToProgram() {
    if (this.department) {
      this.removeMessage();
      this.availableDepartmentPrograms = _.orderBy(
        this.getProgramsByDepartmentName(),
        ['name'],
        ['asc']
      );
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
    if (this.currentStep < 3) {
      this.currentStep += 2;
    }
    this.jumpStep = this.currentStep;
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
      this.unenrollAndGoToDetails();
    } else {
      this.showMessage('Please select a program to continue');
    }
  }

  public showEnrollmentFormsOrEnrollOnValidation() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    if (this.formValidated() && !this.hasValidationErrors) {
      this.filterStateChangeEncounterTypes();
      // if there are no required forms, go ahead and enroll the patient
      if (this.enrollmentEncounters.length > 0) {
        this.showForms = true;
      } else {
        if (this.isReferral) {
          this.referPatient();
        } else {
          this.isButtonVisible = false;
          this.enrollPatientToProgram();
        }
      }
    }
  }

  public enrollPatientToProgram() {
    if (
      this.selectedProgram.programUuid ===
        'c19aec66-1a40-4588-9b03-b6be55a8dd1d' &&
      this.patient.person.age < 15
    ) {
      this.showMessage(
        'Clients aged 15 and above are eligible for PrEP enrollment'
      );
      setTimeout(() => {
        this.removeMessage();
      }, 5000);
      return;
    }
    this.enrolling = true;
    const payload = {
      programUuid: this.selectedProgram.programUuid,
      patient: this.patient,
      dateEnrolled: this.dateEnrolled,
      dateCompleted: this.dateCompleted,
      location: this.selectedLocation.value,
      enrollmentUuid: ''
    };
    const params = {
      value: this.patientType,
      patient: this.patient.uuid
    };
    this.patientTypeService.setPatientStatus(params).subscribe({
      next: (data) => {},
      error: (e) => {}
    });
    this.programManagerService
      .enrollPatient(payload)
      .subscribe((enrollment) => {
        if (
          enrollment.program.uuid === 'c4246ff0-b081-460c-bcc5-b0678012659e'
        ) {
          enrollment.display = 'VIREMIA PROGRAM';
          this.newlyEnrolledProgram = enrollment;
        } else {
          this.newlyEnrolledProgram = enrollment;
        }
        if (this.enrollmentEncounters.length > 0) {
          _.extend(this.newlyEnrolledProgram, {
            formFilled: this.getFilledForm(_.first(this.enrollmentEncounters))
          });
        }
        this.enrolling = false;
        this.isButtonVisible = true;
        this.completeEnrollment();
      });
  }

  public startVisit() {
    const dashboardRoutesConfig: any = this.routesProviderService
      .patientDashboardConfig;
    const route: any = _.find(
      dashboardRoutesConfig.programs,
      (_r: any) => _r['programUuid'] === this.newlyEnrolledProgram.program.uuid
    );
    const _route =
      '/patient-dashboard/patient/' +
      this.patient.uuid +
      '/' +
      route.alias +
      '/' +
      route.baseRoute +
      '/visit';

    this.router.navigate([_route], {});
  }

  public referPatient() {
    this.removeMessage();
    this.enrolling = true;
    const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    const payload = {
      submittedEncounter: this.submittedEncounter,
      referredToLocation: this.selectedLocation
        ? this.selectedLocation.value
        : location.uuid,
      referredFromLocation: location.uuid,
      patient: this.patient,
      dateEnrolled: this.dateEnrolled,
      programUuid: this.selectedProgram.programUuid
    };
    this.programManagerService.referPatient(payload).subscribe(
      (enrollment) => {
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
      },
      (error) => {
        this.enrolling = false;
        if (
          error.error &&
          error.error.message &&
          error.error.message.match(/Duplicate record exists/)
        ) {
          this.showMessage(
            'This patient has already been referred to this location in same program'
          );
        } else {
          console.log(error);
        }
      }
    );
  }

  public fillEnrollmentForm(form) {
    const _route =
      '/patient-dashboard/patient/' +
      this.patient.uuid +
      '/general/general/formentry';
    const routeOptions = {
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
      this.requiredProgramQuestions = this.programVisitConfig.enrollmentOptions.requiredProgramQuestions;
    }
  }

  public onRequiredQuestionChange(question) {
    if (question.qtype === 'patient Type') {
      this.patientType = question.value;
    }
    question = this.checkRelatedQuestions(question);
    // pick questions that have wrong answer
    const questionWithWrongAnswer = _.find(
      this.requiredProgramQuestions,
      (q) => {
        return question.qtype === q.qtype && q.value !== q.enrollIf;
      }
    );
    if (question.qtype === 'enrollToGroup') {
      this.enrollToGroup = question.value;
    }

    if (questionWithWrongAnswer) {
      this.preQualifyProgramEnrollment(questionWithWrongAnswer);
    } else {
      this.removeMessage();
      this.isButtonVisible = true;
    }
  }

  public editProgram(program) {
    const _route =
      '/patient-dashboard/patient/' +
      this.patient.uuid +
      '/general/general/program-manager/edit-program';
    const routeOptions = {};
    this.router.navigate([_route], routeOptions);
  }

  public filterStateChangeEncounterTypes(): void {
    if (this.hasStateChangeEncounterTypes()) {
      let encounterTypes = this.programVisitConfig.enrollmentOptions
        .stateChangeEncounterTypes.enrollment;
      const unenrollmentEncounterTypes = this.programVisitConfig
        .enrollmentOptions.stateChangeEncounterTypes.incompatible;
      if (this.isReferral) {
        encounterTypes = this.programVisitConfig.enrollmentOptions
          .stateChangeEncounterTypes.referral;
      }
      if (unenrollmentEncounterTypes) {
        this.unenrollmentForms = _.map(
          _.filter(unenrollmentEncounterTypes, 'required'),
          'uuid'
        );
      }
      this.enrollmentEncounters = _.map(
        _.filter(encounterTypes, 'required'),
        'uuid'
      );
    }
  }

  public deserializeStepInfo() {
    const stepInfo = this.localStorageService.getObject('pm-data');
    if (stepInfo) {
      this.department = stepInfo.department;
      this.selectedProgram = stepInfo.selectedProgram;
      this.program = this.selectedProgram.programUuid;
      this.dateEnrolled = stepInfo.dateEnrolled || this.dateEnrolled;
      this.selectedLocation =
        stepInfo.selectedLocation || this.selectedLocation;
      this.submittedEncounter = stepInfo.submittedEncounter || [];
      this.enrollmentEncounters = stepInfo.enrollmentEncounters || [];
      this.incompatibleProgrames = stepInfo.incompatibleProgrames || [];
      this.isReferral = stepInfo.isReferral || false;
      this.programVisitConfig =
        stepInfo.programVisitConfig ||
        this.allPatientProgramVisitConfigs[this.program];
      this.availableDepartmentPrograms = this.getProgramsByDepartmentName();
    } else {
      console.log('Going Back to new');
      this.currentStep = 1;
      this.jumpStep = -1;
      const _route =
        '/patient-dashboard/patient/' +
        this.patient.uuid +
        '/general/general/program-manager/new-program';
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
        } else {
          // reset its selected answer and remove it from the required questions
          rq.value = null;
          _.remove(this.requiredProgramQuestions, (_rq) => {
            return rq.qtype === _rq.qtype;
          });
        }
      });
    }
    this.requiredProgramQuestions = _.uniqBy(
      this.requiredProgramQuestions,
      'qtype'
    );
    return question;
  }

  private resetRequiredQuestion(question): any {
    const questions = this.programVisitConfig.enrollmentOptions
      .requiredProgramQuestions;
    const targetQuestion = _.find(questions, (q: any) => {
      return question.qtype === q.qtype;
    });
    return targetQuestion ? targetQuestion : question;
  }

  private loadOnParamInit(params: any) {
    this.currentStep = parseInt(params.step, 10);
    this.jumpStep = this.currentStep;

    const queryParams: any = this.route.snapshot.queryParams;
    const enrollMentQuestionsObject = this.risonService.decode(
      queryParams.enrollMentQuestions
    );

    this.enrollPatientToGroup = enrollMentQuestionsObject.enrollPatient;
    this.deserializeStepInfo();
    if (this.currentStep === 3) {
      this.unenrollAndGoToDetails();
    }
    if (this.currentStep === 4) {
      this.jumpStep = 6;
      if (this.isReferral) {
        this.referPatient();
      } else if (!this.enrollPatientToGroup) {
        this.enrollPatientToProgram();
      }
    }
  }
  private resolveLocationDetails(locationUuid): void {
    this.locationResourceService
      .getLocationByUuid(locationUuid)
      .subscribe((location) => {
        this.selectedLocation = {
          value: location.uuid,
          label: location.name
        };
      });
  }
  private loadQueryParams() {
    const queryParams: any = this.route.snapshot.queryParams;
    if (queryParams.enrollMentQuestions) {
      this.preFillEnrollmentQuestions(queryParams.enrollMentQuestions);
    }
    this.resolveLocationDetails(this.route.snapshot.queryParams.locationUuid);
  }

  private preFillEnrollmentQuestions(enrollMentQuestions: any) {
    const enrollMentQuestionsObject = this.risonService.decode(
      enrollMentQuestions
    );
    for (const key in enrollMentQuestionsObject) {
      if (enrollMentQuestionsObject.hasOwnProperty(key)) {
        const answer = enrollMentQuestionsObject[key];
        const question = this.resetRequiredQuestion({ qtype: key });
        question.value = answer;
      }
    }
  }

  private getFilledForm(encounterType) {
    // get immediate encounter of type filled
    const encounterFilled = _.find(this.patient.encounters, (encounter) => {
      return encounter.encounterType.uuid === encounterType;
    });
    if (encounterFilled) {
      return encounterFilled.form.name;
    }
  }

  private completeEnrollment() {
    if (this.enrollPatientToGroup) {
      let count = 1;
      this.refreshPatient().subscribe((refreshing) => {
        if (!refreshing) {
          this.groupEnrollmentState = {
            patient: this.patient,
            action: 'Enroll',
            currentEnrolledPrograms: _.filter(
              this.enrolledProgrames,
              (program) => program.isEnrolled
            ),
            currentGroups: this.patientCurrentGroups
          };
          if (count === 1) {
            this.currentStep++;
            this.nextStep = true;
            count++;
            this.showMessage(
              `Patient auto-enrolled into DC program, Continue enrolling patient into existing or new DC group`,
              `info`
            );
          }
        }
      });
    } else if (this.enrollToGroup === 'true') {
      let count = 1;
      this.refreshPatient().subscribe((refreshing) => {
        if (!refreshing) {
          this.groupEnrollmentState = {
            patient: this.patient,
            action: 'Enroll',
            currentEnrolledPrograms: _.filter(
              this.enrolledProgrames,
              (program) => program.isEnrolled
            ),
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
      this.unenrolledProgrames = this.getSerializedStepInfo(
        'incompatibleProgrames'
      );
      this.tick(3000).then(() => {
        this.refreshPatient();
        this.localStorageService.remove('pm-data');
        const queryParams: any = this.route.snapshot.queryParams;
        if (queryParams.groupUuid && queryParams.enrollMentQuestions) {
          const enrollMentQuestionsObject = this.risonService.decode(
            queryParams.enrollMentQuestions
          );
          if (enrollMentQuestionsObject.enrollToGroup) {
            this.enrollIntoGroup(queryParams);
          }
        } else {
          this.navigateToRoute(queryParams.redirectUrl);
        }
      });
    }
  }

  private enrollIntoGroup(queryParams) {
    this.groupMemberService
      .createMember(queryParams.groupUuid, this.patient.uuid)
      .subscribe(
        (result) => {
          this.navigateToRoute(queryParams.redirectUrl);
        },
        (error) => {
          console.error('Error', error);
        }
      );
  }

  private navigateToRoute(url: string) {
    if (url && !_.isEmpty(url)) {
      this.router.navigateByUrl(url);
    }
  }

  private unenrollAndGoToDetails() {
    if (this.isIncompatibleChoice()) {
      _.each(this.incompatibleProgrames, (program) => {
        if (program.uuid === '334c9e98-173f-4454-a8ce-f80b20b7fdf0') {
          this.autoEnrolFromGroup = true;
        }
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
      if (this.enrollPatientToGroup) {
        this.enrollPatientToProgram();
      }
    } else {
      this.skipIncompatibilityStep();
    }
  }

  private skipIncompatibilityStep() {
    if (this.enrollPatientToGroup) {
      this.enrollPatientToProgram();
    } else {
      const program = this.route.snapshot.queryParams.program;
      this.currentStep = this.currentStep + (program ? 1 : 2);
      this.jumpStep = this.currentStep;
      this.title = 'Start';
      // Had to add this to make the next step work
      this.localStorageService.setObject('pm-data', this.stepInfo);
    }
  }

  private checkIfEnrollmentIsAllowed(): void {
    if (
      this.programVisitConfig &&
      !_.isUndefined(this.programVisitConfig.enrollmentAllowed)
    ) {
      if (!this.programVisitConfig.enrollmentAllowed) {
        this.showMessage(
          'The patient is not allowed to be enrolled in this program. ' +
            'Please confirm the sex of the patient.'
        );
        this.isButtonVisible = false;
      } else {
        this.removeMessage();
        this.isButtonVisible = true;
      }
    } else {
      this.removeMessage();
      this.isButtonVisible = true;
    }
  }

  private checkIfSameEnrollmentLocationAllowed() {
    const patientEnrolled =
      !_.isNil(this.selectedProgram.enrolledProgram) &&
      _.isNull(this.selectedProgram.enrolledProgram.dateCompleted);
    if (patientEnrolled && !_.isNil(this.selectedLocation)) {
      const hasLocation = this.selectedProgram.enrolledProgram._openmrsModel
        .location;
      if (
        !_.isNil(hasLocation) &&
        hasLocation.uuid === this.selectedLocation.value
      ) {
        this.showMessage(
          'Patient is already enrolled in this location in same program.'
        );
      } else {
        this.removeMessage();
      }
    }
  }

  private preQualifyProgramEnrollment(question: any) {
    const requiredStatus = _.find(
      question.answers,
      (ans) => ans.value === question.enrollIf
    );
    if (requiredStatus && question.value !== question.enrollIf) {
      this
        .showMessage(`The question <strong><em>${question.name}</em></strong> MUST be
          '${requiredStatus.label}' to be able to enroll the patient into this program`);
      this.isButtonVisible = false;
    } else {
      this.removeMessage();
      this.isButtonVisible = true;
    }
  }

  private validateRequiredQuestions() {
    if (this.requiredProgramQuestions.length > 0) {
      this.onRequiredQuestionChange('');
    }
  }

  private formValidated() {
    const checkedForm =
      this.allRequiredQuestionsAnswered() &&
      !_.isNil(this.selectedLocation) &&
      !_.isNil(this.dateEnrolled);
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
      const unAnsweredQuestions = _.filter(
        this.programVisitConfig.enrollmentOptions.requiredProgramQuestions,
        (question) => {
          return _.isNil(question.value);
        }
      );
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
    return (
      this.programVisitConfig &&
      !_.isUndefined(this.programVisitConfig.enrollmentOptions) &&
      !_.isUndefined(
        this.programVisitConfig.enrollmentOptions.requiredProgramQuestions
      )
    );
  }

  public goToSuccessStep(newGroup) {
    this.currentStep++;
    this.nextStep = true;
    this.newlyEnrolledGroup = newGroup;
    this.removeMessage();
  }

  public getCurrentPatientGroups(patientUuid: string) {
    this.groupMemberService
      .getMemberCohortsByPatientUuid(patientUuid)
      .subscribe((groups) => {
        this.patientCurrentGroups = _.filter(groups, (group) => !group.voided);
      });
  }

  public showDcGroupUnEnrollmentModal(modal: TemplateRef<any>) {
    if (this.autoEnrolFromGroup && this.patientCurrentGroups.length > 0) {
      this.modalRef = this.modalService.show(modal, { class: 'modal-lg' });
    } else {
      this.showEnrollmentFormsOrEnrollOnValidation();
    }
  }
}
