
import { take, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, Subscription, BehaviorSubject, of, interval } from 'rxjs';
import { flatMap, first } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import { format } from 'date-fns';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { DraftedFormsService } from './drafted-forms.service';
import {
  FormFactory, EncounterAdapter, Form, PersonAttribuAdapter,
  HistoricalEncounterDataService
} from 'ngx-openmrs-formentry';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FormSubmissionService } from './form-submission.service';
import { PatientService } from '../../services/patient.service';
import { FormDataSourceService } from './form-data-source.service';
import { DataSources } from 'ngx-openmrs-formentry';
import { Patient } from '../../../models/patient.model';
import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';
import { ConfirmationService } from 'primeng/primeng';
import { FormentryHelperService } from './formentry-helper.service';
import { UserService } from '../../../openmrs-api/user.service';
import {
  UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';
import {
  MonthlyScheduleResourceService
} from '../../../etl-api/monthly-scheduled-resource.service';
import { PatientReminderService } from '../patient-reminders/patient-reminders.service';
import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';

import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import {
  RetrospectiveDataEntryService
} from '../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';

@Component({
  selector: 'app-formentry',
  templateUrl: './formentry.component.html',
  styleUrls: ['./formentry.component.css']
})
export class FormentryComponent implements OnInit, OnDestroy {

  public counter: number;
  public busyIndicator: any = {
    busy: true,
    message: 'Please wait...' // default message
  };
  public formName = '';
  public preserveFormAsDraft = true;
  public form: Form;
  public formSubmissionErrors: Array<any> = null;
  public formRenderingErrors: Array<any> = [];
  public referralPrograms: string[] = [];
  public showSuccessDialog = false;
  public showReferralDialog = false;
  public showProcessReferralsDialog;
  public referralCompleteStatus: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public patient: Patient = null;
  public submitClicked = false;
  public submittedOrders: any = {
    encounterUuid: null,
    orders: []
  };
  public submittedEncounter: any;
  public referralStatus: any;
  public diffCareReferralStatus: any = undefined;
  public programEncounter: string = null;
  public step: number;
  public referralEncounterType: string;
  public encounterLocation: any;
  private subscription: Subscription;
  private encounterUuid: string = null;
  private encounter: any = null;
  private visitUuid: string = null;
  private visitTypeUuid: string = null;
  private failedPayloadTypes: Array<string> = null;
  private compiledSchemaWithEncounter: any = null;
  private submitDuplicate = false;
  private previousEncounters = [];
  private groupUuid;
  public isGroupVisit = false;
  public enrollToGroup = false;
  public enrollToDC = false;
  public activeProgram: string;
  public formUuid: string;
  public isOncologyReferral = false;
  public oncologyReferral: boolean;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private route: ActivatedRoute,
    private formFactory: FormFactory,
    private encounterResource: EncounterResourceService,
    private encounterAdapter: EncounterAdapter,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private userService: UserService,
    private formSubmissionService: FormSubmissionService,
    private router: Router,
    private patientService: PatientService,
    private formDataSourceService: FormDataSourceService,
    private personAttribuAdapter: PersonAttribuAdapter,
    private dataSources: DataSources,
    private monthlyScheduleResourceService: MonthlyScheduleResourceService,
    private draftedFormsService: DraftedFormsService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private referralsHandler: FormentryReferralsHandlerService,
    private formentryHelperService: FormentryHelperService,
    private patientReminderService: PatientReminderService,
    private confirmationService: ConfirmationService,
    private personResourceService: PersonResourceService) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Formentry Component Loaded', 'ngOnInit');
    this.wireDataSources();
    const componentRef = this;
    this.route.params.subscribe((routeParams) => {
      if (routeParams) {
        this.activeProgram = routeParams.program;
        this.formUuid = routeParams['formUuid'];

        // get visitUuid & encounterUuid then load form
        this.route.queryParams.subscribe((params) => {
          componentRef.visitUuid = params['visitUuid'];
          componentRef.visitTypeUuid = params['visitTypeUuid'];
          componentRef.encounterUuid = params['encounter'];
          componentRef.programEncounter = params['programEncounter'];
          componentRef.oncologyReferral = params['oncologyReferral'];
          componentRef.step = params['step'] ? parseInt(params['step'], 10) : null;
          componentRef.referralEncounterType = params['referralEncounterType'];
          componentRef.groupUuid = params['groupUuid'];
          if (componentRef.draftedFormsService.lastDraftedForm !== null &&
            componentRef.draftedFormsService.lastDraftedForm !== undefined &&
            componentRef.draftedFormsService.loadDraftOnNextFormLoad) {
            componentRef.loadDraftedForm();
            return;
          } else if (componentRef.draftedFormsService.lastDraftedForm !== null &&
            componentRef.draftedFormsService.lastDraftedForm !== undefined &&
            !componentRef.draftedFormsService.loadDraftOnNextFormLoad) {
            setTimeout(() => {
              this.confirmationService.confirm({
                header: 'Unsaved Draft Form',
                message: 'You have unsaved changes on your last form ' +
                  'that will be lost upon confirmation. Do you want to continue?',
                rejectVisible: true,
                acceptVisible: true,
                accept: () => {
                  this.draftedFormsService.setDraftedForm(null);
                  componentRef.loadForm();
                },
                reject: () => {
                  componentRef.loadDraftedForm();
                }
              });

            }, 1);

            return;
          }
          if (componentRef.groupUuid) {
            console.log(!this.referralStatus && !this.step && this.isGroupVisit);
            console.log(this.referralStatus);
            console.log(this.isGroupVisit);
            console.log(this.step);
            componentRef.isGroupVisit = true;
          }
          componentRef.loadForm();   // load  form
          // this.isBusyIndicator(false);
        });
      }
    });
  }

  public ngOnDestroy() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Formentry Component Unloaded', 'ngOnDestroy');
    this.showReferralDialog = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public wireDataSources() {
    this.dataSources.registerDataSource('location',
      this.formDataSourceService.getDataSources()['location']);
    this.dataSources.registerDataSource('provider',
      this.formDataSourceService.getDataSources()['provider']);
    this.dataSources.registerDataSource('drug',
      this.formDataSourceService.getDataSources()['drug']);
    this.dataSources.registerDataSource('problem',
      this.formDataSourceService.getDataSources()['problem']);
    this.dataSources.registerDataSource('personAttribute',
      this.formDataSourceService.getDataSources()['location']);
    this.dataSources.registerDataSource('conceptAnswers',
      this.formDataSourceService.getDataSources()['conceptAnswers']);
    this.dataSources.registerDataSource('patient',
      this.formDataSourceService.getDataSources()['visitTypeUuid']);
  }

  public onSubmit(): void {
    // this.isBusyIndicator(true, 'Please wait, Submitting form');
    setTimeout(() => {
      if (!this.form.valid && this.form.showErrors) {
        document.body.scrollTop = 0;
      }
    }, 100);
    const isSaving = this.formSubmissionService.getSubmitStatus();

    if (!isSaving) {
      this.submitForm();
    } else {
      this.isBusyIndicator(false, '');
    }
  }

  public onCancel(e): void {
    this.confirmationService.confirm({
      header: 'Cancel Form',
      message: 'Leaving this form unsaved will delete this data. Are you sure you wish to proceed?',
      rejectVisible: true,
      acceptVisible: true,
      accept: () => {
        this.preserveFormAsDraft = false;
        // allow the user to cancel
        // this.draftedFormsService.setCancelState();
        this.resetLastTab();
        window.history.go(-1);
      },
      reject: () => {
      }
    });
  }

  public retrySubmittingPayload(): void {
    this.submitForm(this.failedPayloadTypes);
  }

  public navigateTo(path): void {
    switch (path) {
      case 'patientDashboard':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient/' +
          this.patient.uuid + '/general/general/landing-page']);
        this.patientService.reloadCurrentPatient();
        break;
      case 'formList':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient/' +
          this.patient.uuid + '/general/general/forms']);
        break;
      case 'programManager':
        this.preserveFormAsDraft = false;
        this.route.queryParams.subscribe((params) => {
          const step = params['parentComponent'].split(':')[1];
          if (step === 'landing-page') {
            this.router.navigate(['/patient-dashboard/patient/' +
              this.patient.uuid + '/general/general/landing-page']);
          } else if (step === 'new') {
            this.router.navigate(['/patient-dashboard/patient/' +
              this.patient.uuid + '/general/general/program-manager/new-program', 'step',
            params['step']]);
          } else if (step === 'edit') {
            this.router.navigate(['/patient-dashboard/patient/' +
              this.patient.uuid + '/general/general/program-manager/edit-program', 'step',
            params['step']]);
          }
        });
        break;
      case 'programManagerReferral':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient/' +
          this.patient.uuid + '/general/general/program-manager/new-program', 'step', 3]);
        break;
      case 'oncologyReferral':
        this.preserveFormAsDraft = false;
        this.referralStatus = null;
        this.showSuccessDialog = false;
        this.toggleOncologyReferral();
        this.router.navigate(['/patient-dashboard/patient/' +
          this.patient.uuid + '/oncology/' + this.activeProgram + '/formentry/696086df-8299-419e-b434-cb2403248207'],
          { queryParams: { oncologyReferral: true } });
        break;
      case 'patientSearch':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient-search'], {
          queryParams: { reset: true }
        });
        break;
      case 'groupManager':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/clinic-dashboard/' + this.encounterLocation.value + '/general/group-manager/group/' + this.groupUuid]);
        break;
      case 'groupEnrollment':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient/' +
          this.patient.uuid + '/general/general/group-enrollment'], { queryParams: { referral: true } });
        break;
      default:
        console.error('unknown path');
    }

  }

  public setCurrentFormDraftedForm() {
    this.draftedFormsService.saveRouteSnapshot(this.route.snapshot);
    this.draftedFormsService.setDraftedForm(this.form);
    this.draftedFormsService.loadDraftOnNextFormLoad = false;
  }

  public loadDefaultValues(): void {
    let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    const currentUser = this.userService.getLoggedInUser();
    let currentDate = moment().format();
    this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
      if (retroSettings && retroSettings.enabled) {
        location = {
          uuid: retroSettings.location.value,
          display: retroSettings.location.label
        };
        currentDate = moment(this.setRetroDateTime(retroSettings)).format();
      }

      const encounterDate = this.form.searchNodeByQuestionId('encDate');
      if (encounterDate.length > 0) {
        encounterDate[0].control.setValue(currentDate);
      }
      const encounterLocation = this.form.searchNodeByQuestionId('location',
        'encounterLocation');
      if (encounterLocation.length > 0 && location) {
        this.encounterLocation = { value: location.uuid, label: location.display };
        encounterLocation[0].control.setValue(location.uuid);
      }

      const encounterProvider = this.form.searchNodeByQuestionId('provider',
        'encounterProvider');
      if (encounterProvider.length > 0 &&
        this.compiledSchemaWithEncounter &&
        this.compiledSchemaWithEncounter.provider !== {}) {
        let provider = this.compiledSchemaWithEncounter.provider.uuid;
        if (retroSettings && retroSettings.enabled) {
          provider = retroSettings.provider.value;
        }
        encounterProvider[0].control.setValue(provider);
      }
    });
  }

  public onAbortingReferral(event) {
    this.referralStatus = null;
    this.referralCompleteStatus.next(false);
  }

  public shouldShowPatientReferralsDialog(data: any): void {
    // if the user does not fill in a field with the id `patientReferral` or `referralLocation`, this dialog should NOT be displayed
    // conversely, if the user fills in a field with the id `patientReferral` or `referralLocation`, the dialog should be displayed
    this.submittedEncounter = data;

    const referralQuestion = this.form.searchNodeByQuestionId('patientReferral');
    const referralLocation = this.form.searchNodeByQuestionId('referralLocation');

    if (referralQuestion.length > 0 && _.isNil(this.programEncounter)) {
      // show referrals dialog
      const referralData = { submittedEncounter: data };
      const referralPrograms = this.form.searchNodeByQuestionId('referralsOrdered');
      if (referralPrograms.length > 0) {
        const answer = _.first(referralPrograms).control.value;
        this.searchReferralConcepts(answer).pipe(take(1)).subscribe((concepts) => {
          this.referralPrograms = _.filter(this.patient.enrolledPrograms, (program: any) => {
            return _.includes(_.map(concepts, 'uuid'), program.concept.uuid);
          });
          if (this.referralPrograms.length > 0) {
            _.extend(referralData, {
              isReferral: true,
              selectedProgram: _.first(this.referralPrograms)
            });
            this.referralStatus = referralData;
          }
        });
      }
    } else if (referralLocation.length > 0 && referralLocation[0].control.value && _.isNil(this.programEncounter)) {
      // show referrals dialog; this is an oncology referral
      const referralData = { submittedEncounter: data };
      localStorage.setItem('referralLocation', _.first(referralLocation).control.value);
      localStorage.setItem('referralVisitEncounter', JSON.stringify(data));

      if (this.referralPrograms) {
        _.extend(referralData, {
          isReferral: true,
          selectedProgram: this.activeProgram
        });
        this.isOncologyReferral = true;
        this.referralStatus = referralData;
      }
    } else {
      // do not show referrals dialog; this is not a referral
      this.referralCompleteStatus.next(false);
    }
  }

  public updatePatientDemographics(data: any): void {
    // check if patient status was filled

    const patientCareStatus = this.getPatientStatusQuestion();
    const deathDate = this.form.searchNodeByQuestionId('deathDate');
    let causeOfDeath = this.form.searchNodeByQuestionId('reasdeath');
    if (causeOfDeath.length === 0) {
      causeOfDeath = this.form.searchNodeByQuestionId('deathCause');
    }

    // if question exists provide for demographic update
    /* UPDATE: at the moment, only deathDate  and cause are the only consistent concepts across
     *  the forms.
     *  none of the fields are required. By assumption, if someone fills death death and cause,
     *  the patient is dead
     */
    const personNamePayload: any = {
      dead: false,
      deathDate: null,
      causeOfDeath: null
    };

    if (patientCareStatus.length > 0 && causeOfDeath.length > 0
      && _.first(patientCareStatus).control.value !== 'a89335d6-1350-11df-a1f1-0026b9') {
      this.personResourceService.saveUpdatePerson(this.patient.uuid, personNamePayload)
        .subscribe(() => { });
    }

    if ((causeOfDeath.length > 0 && _.first(causeOfDeath).control.value.length > 0)
      && (deathDate.length > 0 && _.first(deathDate).control.value.length > 0)) {
      personNamePayload.dead = true;
      personNamePayload.deathDate = _.first(deathDate).control.value;
      personNamePayload.causeOfDeath = _.first(causeOfDeath).control.value;
      this.personResourceService.saveUpdatePerson(this.patient.uuid, personNamePayload)
        .subscribe(() => { });
    }
  }

  public handleProgramManagerRedirects(data: any): void {
    // check if patient status was filled
    const patientCareStatus = this.getPatientStatusQuestion();
    const referralQuestion = this.getReferralsQuestion();
    let force = false;
    if (patientCareStatus.length > 0) {
      force = true;
    }
    let step = [];
    const queryParams = {};
    if (this.shouldRedirectToProgramManager(patientCareStatus, force)) {
      this.preserveFormAsDraft = false;
      this.saveTransferLocationIfSpecified();
      // MCH/PMTCT
      if (_.first(patientCareStatus).control.value === 'a8a17d80-1350-11df-a1f1-0026b9348838') {
        // PMTCT Uuid
        _.merge(queryParams, {
          program: '781d897a-1359-11df-a1f1-0026b9348838',
          notice: 'pmtct'
        });
        step = ['step', 3];
      }
      this.router.navigate(_.concat(['/patient-dashboard/patient/' +
        this.patient.uuid + '/general/general/program-manager/edit-program'], step), {
          queryParams: queryParams
        });
        this.draftedFormsService.setCancelState();
    }
    if (referralQuestion.length > 0) {
      // Enhanced adherence HIV Program
      if (_.includes(_.first(referralQuestion).control.value, 'a9431295-9862-405b-b694-534f093ca0ad')) {
        // Enhanced adherence HIV Program
        _.merge(queryParams, {
          program: 'c4246ff0-b081-460c-bcc5-b0678012659e',
          notice: 'adherence'
        });
        step = ['step', 3];
        const location: any = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
        localStorage.setItem('transferLocation', location.uuid);
      }
      // HIV Differentiated Program
      if (_.includes(_.first(referralQuestion).control.value, '7c6f0599-3e3e-4f42-87a2-2ce66f1e96d0')) {
        // HIV Differentiated Program
        _.merge(queryParams, {
          program: '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
          notice: 'dc'
        });
        step = ['step', 3];
        const location: any = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
        localStorage.setItem('transferLocation', location.uuid);
      }
      this.router.navigate(_.concat(['/patient-dashboard/patient/' +
        this.patient.uuid + '/general/general/program-manager/edit-program'], step), {
          queryParams: queryParams
        });
      this.draftedFormsService.setCancelState();
    }
  }

  private shouldRedirectToProgramManager(answer: any[], force?: boolean) {
    // if (force === true) {
    //   return true;
    // }
    const transferOut = this.form.searchNodeByQuestionId('careStatus');
    if (transferOut.length > 0) {
      answer = transferOut;
    }
    if (answer.length > 0) {
      return _.includes([
        'a89c2f42-1350-11df-a1f1-0026b9348838', // AMPATH
        'a89c301e-1350-11df-a1f1-0026b9348838', // Non-AMPATH
        'a8a17d80-1350-11df-a1f1-0026b9348838' // MCH/PMTCT
      ], _.first(answer).control.value);
    }
    return false;
  }

  private getPatientStatusQuestion() {
    // (questionId is patstat in Outreach Field Follow-Up Form V1.0)
    // (questionId is careStatus in Transfer Out Form v0.01 and other forms
    let patientCareStatus = this.form.searchNodeByQuestionId('patstat');
    if (patientCareStatus.length === 0) {
      patientCareStatus = this.form.searchNodeByQuestionId('careStatus');
    }
    return patientCareStatus;
  }

  private getReferralsQuestion() {
    let referralsQuestion = this.form.searchNodeByQuestionId('referrals');
    if (referralsQuestion.length === 0) {
      referralsQuestion = this.form.searchNodeByQuestionId('patientReferrals');
    }
    return (referralsQuestion.length > 0 && !_.isEmpty(_.first(referralsQuestion).control.value)) ? referralsQuestion : [];
  }

  private saveTransferLocationIfSpecified() {
    const transferLocation = this.form.searchNodeByQuestionId('transfered_out_to_ampath');
    if (transferLocation.length > 0) {
      localStorage.setItem('transferLocation', _.first(transferLocation).control.value);
    }
  }

  private searchReferralConcepts(concepts) {
    const searchBatch: Array<Observable<any>> = [];
    _.each(concepts, (concept: any) => {
      searchBatch.push(this.conceptResourceService.getConceptByUuid(concept));
    });
    return forkJoin(searchBatch);
  }

  private setRetroDateTime(settings) {
    return new Date(settings.visitDate + ', ' + settings.visitTime);
  }

  private loadDraftedForm() {
    this.form = this.draftedFormsService.lastDraftedForm;
    this.formName = this.form.schema.display;

    // get patient

    this.getPatient().pipe(take(1)).subscribe((results) => {
      this.patient = results;
    });

    // clear from service as it is no longer a drafted form
    this.draftedFormsService.saveRouteSnapshot(null);
    this.draftedFormsService.setDraftedForm(null);
    this.isBusyIndicator(false);
  }

  private loadForm(): void {
    this.isBusyIndicator(true, 'Please wait, loading form');
    const observableBatch: Array<Observable<any>> = [];
    // push all subscriptions to this batch eg patient, encounters, formSchema
    observableBatch.push(this.getcompiledSchemaWithEncounter()); // schema data [0]
    observableBatch.push(this.getPatient()); // patient [1]
    observableBatch.push(this.getEncounters()); // encounters [2]

    // forkjoin all requests
    this.subscription = forkJoin(
      observableBatch
    )
      // .pipe(flatMap((data) => {
      //   // now init private and public properties
      //   this.compiledSchemaWithEncounter = data[0] || null;
      //   this.patient = data[1] || null;
      //   this.encounter = data[2] || null;
      //   // now render form
      //   return this.patientReminderService.getPatientReminders(this.patient.person.uuid);
      // }))
      .subscribe((data: any) => {
        this.compiledSchemaWithEncounter = data[0] || null;
        this.patient = data[1] || null;
        this.encounter = data[2] || null;
        this.renderForm();
        this.isBusyIndicator(false);
      }, (err) => {
        console.error(err);
        this.isBusyIndicator(false);
        // this.formRenderingErrors
        //  .push('An error occured while loading form, please check your connection');
      }
      );
  }

  /**
   * This is a temporary work around till form relations are build properly
   */
  private formRelationsFix(form: any) {
    const childControls = [
      'difOfCaregiver',
      'missADose',
      'receiveADose',
      'trueOfCaregiver',
      'adherenceAss'
    ];

    const onArtControl = form.searchNodeByQuestionId('onArt');
    const pcpProphylaxisCurrentControl = form.searchNodeByQuestionId('pcpProphylaxisCurrent');
    const onTbProphylaxisControl = form.searchNodeByQuestionId('onTbProphylaxis');

    childControls.forEach((cControl) => {
      const childControl = form.searchNodeByQuestionId(cControl);

      if (onArtControl && onArtControl[0] && childControl[0]) {
        this.updateRelatedControlFix(onArtControl[0], childControl[0]);
      }

      if (pcpProphylaxisCurrentControl && pcpProphylaxisCurrentControl[0] && childControl[1]) {
        this.updateRelatedControlFix(pcpProphylaxisCurrentControl[0], childControl[1]);
      }

      if (onTbProphylaxisControl && onTbProphylaxisControl[0] && childControl[2]) {
        this.updateRelatedControlFix(onTbProphylaxisControl[0], childControl[2]);
      }
    });

    const tbProphyAdherencenotes = form.searchNodeByQuestionId('tbProphyAdherencenotes');
    this.updateRelatedControlFix(onTbProphylaxisControl[0], tbProphyAdherencenotes[0]);
    const tbAdherencenotes = form.searchNodeByQuestionId('tbAdherencenotes');
    this.updateRelatedControlFix(onTbProphylaxisControl[0], tbAdherencenotes[0]);

  }

  private updateRelatedControlFix(parentControl, childControl) {
    if (childControl) {
      childControl.control.controlRelations.addRelatedControls(parentControl.control);
      childControl.control.controlRelations.relations.forEach((relation) => {
        relation.updateControlBasedOnRelation(parentControl);
      });
    }
  }

  private renderForm(): void {
    this.formRenderingErrors = []; // clear all rendering errors
    try {
      const schema: any = this.compiledSchemaWithEncounter.schema;
      this.formName = this.compiledSchemaWithEncounter.schema.display;
      const historicalEncounter: any = this.compiledSchemaWithEncounter.encounter;
      this.dataSources.registerDataSource('patient',
        this.formDataSourceService.getPatientObject(this.patient), true);
      this.dataSources.registerDataSource('monthlyScheduleResourceService',
        this.monthlyScheduleResourceService);
      this.dataSources.registerDataSource('patient',
        { visitTypeUuid: this.visitTypeUuid }, true);
      this.dataSources.registerDataSource('userLocation',
        this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject());
      this.dataSources.registerDataSource('file', {
        fileUpload: this.fileUploadResourceService.upload.bind(this.fileUploadResourceService),
        fetchFile: this.fileUploadResourceService.getFile.bind(this.fileUploadResourceService)
      });

      // set up visit encounters data source
      this.setUpVisitEncountersDataObject();

      // for the case of hiv, set-up the hiv summary
      this.setUpHivSummaryDataObject();


      if (this.encounter) { // editing existing form
        this.form = this.formFactory.createForm(schema, this.dataSources.dataSources);
        this.formRelationsFix(this.form);
        this.encounterAdapter.populateForm(this.form, this.encounter);
        this.personAttribuAdapter.populateForm(this.form, this.patient.person.attributes);
        this.form.valueProcessingInfo.encounterUuid = this.encounterUuid;
      } else { // creating new from
        this.dataSources.registerDataSource('rawPrevEnc', historicalEncounter, false);
        this.form = this.formFactory.createForm(schema, this.dataSources.dataSources);
        this.formRelationsFix(this.form);
        this.form.valueProcessingInfo.patientUuid = this.patient.uuid;
        // add visit uuid if present
        if (this.visitUuid && this.visitUuid !== '') {
          this.form.valueProcessingInfo.visitUuid = this.visitUuid;
        }
        // add visit type if present
        if (this.visitTypeUuid && this.visitTypeUuid !== '') {
          this.dataSources.registerDataSource('patient',
            { visitTypeUuid: this.visitTypeUuid }, true);
          this.form.valueProcessingInfo.visitTypeUuid = this.visitTypeUuid;
        }
        // now set default value
        this.loadDefaultValues();
      }
      // add valueProcessingInfo
      this.form.valueProcessingInfo.personUuid = this.patient.person.uuid;
      this.form.valueProcessingInfo.formUuid = schema.uuid;

      this.setUpWHOCascading();
      if (schema.encounterType) {
        this.form.valueProcessingInfo.encounterTypeUuid = schema.encounterType.uuid;
      } else {
        throw new Error('Please associate the form with an encounter type.');
      }
      // Find and set a provider uuid to be used when updating orders as orderer
      this.setProviderUuid();

    } catch (ex) {
      // TODO Handle all form rendering errors
      console.error('An error occured while rendering form:', ex);
      this.formRenderingErrors.push('An error occured while rendering form: ' + ex.message);
    }

  }

  private setUpHivSummaryDataObject() {
    if (Array.isArray(this.compiledSchemaWithEncounter.hivSummary) &&
      this.compiledSchemaWithEncounter.hivSummary.length > 0) {
      this.dataSources.registerDataSource('lastHivSummary',
        this.compiledSchemaWithEncounter.hivSummary[0]);
    } else {
      this.dataSources.registerDataSource('lastHivSummary', null);
    }
  }

  private setUpVisitEncountersDataObject() {

    const hd = new HistoricalEncounterDataService();
    if (this.compiledSchemaWithEncounter.visit &&
      this.compiledSchemaWithEncounter.visit.encounters &&
      Array.isArray(this.compiledSchemaWithEncounter.visit.encounters)) {
      const visitEncounters: Array<any> = this.compiledSchemaWithEncounter.visit.encounters;
      visitEncounters.forEach((enc) => {
        hd.registerEncounters(enc.encounterType.uuid, enc);
      });
    }

    this.dataSources.registerDataSource('visitEnc', hd);

    // console.log('Visit Value', this.dataSources.dataSources['visitEnc']
    //   .getObject('a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7')
    //   .getValue('93aa3f1d-1c39-4196-b5e6-8adc916cd5d6'));
    // console.log('Visit Value', this.dataSources.dataSources['visitEnc']
    //   .getObject('a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7')
    //   .getValue('9ce5dbf0-a141-4ad8-8c9d-cd2bf84fe72b'));
  }

  private setUpWHOCascading() {
    try {
      let whoQuestions = this.form.searchNodeByQuestionId('adultWhoStage');

      if (whoQuestions.length === 0) {
        whoQuestions = this.form.searchNodeByQuestionId('pedWhoStage');
      }

      const whoStageQuestion = whoQuestions[0];

      whoStageQuestion.control.valueChanges.subscribe((val) => {
        if (val && val !== '') {
          const source = this.form.dataSourcesContainer.dataSources['conceptAnswers'];
          if (source.changeConcept) {
            source.changeConcept(val);
          }
        }
      });

    } catch (e) {
      console.error('Error setting up Who Staging Cascading');
      // console.error(e);
    }

  }

  private getcompiledSchemaWithEncounter(): Observable<any> {

    return Observable.create((observer: Subject<any>) => {
      this.route.data.subscribe(
        (routeData: any) => {
          observer.next(routeData.compiledSchemaWithEncounter);
        },
        (err) => {
          observer.error(err);
        });
    }).pipe(first((value: any) => value.schema.uuid === this.formUuid));
  }

  private getPatient(): Observable<Patient> {

    return Observable.create((observer: Subject<Patient>) => {
      this.patientService.currentlyLoadedPatient.subscribe(
        (patient) => {
          if (patient) {
            observer.next(patient);
          }
        },
        (err) => {
          observer.error(err);
        });
    }).pipe(first());
  }

  private registerVLDatasource(reminders: any) {
    if (reminders) {
      const vlReminder = _.find(reminders['generatedReminders'], (o: any) => {
        return o.title === 'Viral Load Reminder';
      });
      if (vlReminder) {
        this.dataSources.registerDataSource('vlFormAlert', { needsVl: true }, true);
      } else {
        this.dataSources.registerDataSource('vlFormAlert', { needsVl: false }, true);
      }
    }

  }

  private getEncounters(): Observable<any> {

    return Observable.create((observer: Subject<any>) => {
      if (this.encounterUuid && this.encounterUuid !== '') {
        this.encounterResource.getEncounterByUuid(this.encounterUuid).subscribe((encounter) => {
          // let wrappedEnconter: Encounter = new Encounter(encounter);
          observer.next(encounter);
        }, (error) => {
          observer.error(error);
        });
      } else {
        observer.next(null);
      }
    }).pipe(first());
  }

  private submitForm(payloadTypes: Array<string> = ['encounter', 'personAttribute']): void {
    this.isBusyIndicator(true, 'Please wait, saving form...');
    this.form.showErrors = !this.form.valid;
    this.disableSubmitBtn();
    // this.handleFormReferrals();
    if (this.form.valid) {
      this.formSubmissionService.setSubmitStatus(true);
      // this.isBusyIndicator(true, 'Please wait, saving form...');
      // clear formSubmissionErrors
      this.formSubmissionErrors = null;
      // reset submitted orders
      this.submittedOrders.encounterUuid = null;
      this.submittedOrders.orders = [];
      // submit form
      this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
        if (retroSettings && retroSettings.enabled) {
          if (this.formSubmissionService.getSubmitStatus() === true) {
            this.confirmRetrospectiveSubmission(payloadTypes);
          }
        } else {
          this.saveEncounterOrUpdateOnCheckDuplicate(payloadTypes);
        }
      });
    } else {
      this.form.markInvalidControls(this.form.rootNode);
      this.enableSubmitBtn();
      this.isBusyIndicator(false, '');
    }

  }

  private saveEncounterOrUpdate(payloadTypes) {
    this.isBusyIndicator(true, 'Please wait, saving form...');
    this.formSubmissionService.submitPayload(this.form, payloadTypes).pipe(take(1)).subscribe(
      (data) => {
        this.isBusyIndicator(false); // hide busy indicator
        this.handleSuccessfulFormSubmission(data);
        console.log('All payloads submitted successfully:', data);
        this.formSubmissionService.setSubmitStatus(false);
        this.enableSubmitBtn();
      },
      (err) => {
        console.error('error', err);
        this.isBusyIndicator(false); // hide busy indicator
        this.handleFormSubmissionErrors(err);
        this.enableSubmitBtn();
        this.formSubmissionService.setSubmitStatus(false);
      });
  }
  private checkDuplicate(payloadTypes) {
    this.patientService.currentlyLoadedPatientUuid
      .pipe(flatMap((patientUuid: string) => {
        return this.encounterResource.getEncountersByPatientUuid(patientUuid);
      }), flatMap((encounters) => {
        this.previousEncounters = encounters;
        if (this.formentryHelperService.encounterTypeFilled(encounters,
          this.form.schema.encounterType.uuid,
          this.extractEncounterDate()) && !this.submitDuplicate) {
          return of(true);
        } else {
          return of(false);
        }
      })).pipe(take(1)).subscribe(
        (isDuplicate) => {
          this.isBusyIndicator(false); // hide busy indicator
          if (isDuplicate) {
            this.saveDuplicate(payloadTypes);
          } else {
            this.saveEncounterOrUpdate(payloadTypes);
          }
        },
        (err) => {
          console.error('error', err);
          this.isBusyIndicator(false); // hide busy indicator
          this.handleFormSubmissionErrors(err);
          this.enableSubmitBtn();
          this.formSubmissionService.setSubmitStatus(false);
        });
  }

  private checkFormSumittedStatus() {

    const submitStatus = this.submitClicked;
    return submitStatus;

  }

  private resetSubmitStatus() {

    this.submitClicked = false;

  }

  private disableSubmitBtn() {

    const submitBtn = document.getElementById('formentry-submit-btn');
    if (typeof submitBtn === 'undefined' || submitBtn === null) {

    } else {

      document.getElementById('formentry-submit-btn').setAttribute('disabled', 'true');

    }
  }

  private enableSubmitBtn() {

    const submitBtn = document.getElementById('formentry-submit-btn');

    if (typeof submitBtn === 'undefined' || submitBtn === null) {

    } else {

      document.getElementById('formentry-submit-btn').removeAttribute('disabled');

      this.resetSubmitStatus();
    }

  }

  private extractEncounterDate() {
    const nodes = this.form.searchNodeByQuestionId('encDate');
    if (nodes.length > 0) {
      return nodes[0].control.value;
    }
    return '';
  }

  private saveDuplicate(payloadTypes: any) {
    const encounterDate = this.extractEncounterDate();
    const duplicateEncounter = this.formentryHelperService
      .getLastDuplicateEncounter(this.previousEncounters,
        this.form.schema.encounterType.uuid, encounterDate);
    const duplicateMoment = Object.assign({}, moment);
    const encounterDateMoment = moment(new Date(encounterDate));
    this.confirmationService.confirm({
      header: 'Form Duplication warning',
      key: 'duplicateWarning',
      message: `A similar form was completed on  ` +
        `${format(duplicateEncounter.encounterDatetime, 'DD/MM/YYYY')} ` +
        ` at ${format(duplicateEncounter.encounterDatetime, 'HH:mm')} ` +
        `by  ${duplicateEncounter.encounterProviders[0].provider.display}
      Are you sure you want to submit this encounter ` +
        ` for the current specified date ${format(new Date(encounterDate), 'DD/MM/YYYY')} at ` +
        `${format(new Date(encounterDate), 'HH:mm')}`,
      accept: () => {
        this.submitDuplicate = true;
        this.saveEncounterOrUpdate(payloadTypes);
      },
      reject: () => {
        this.submitDuplicate = false;
        this.formSubmissionService.setSubmitStatus(false);
      }
    });
  }
  private handleFormSubmissionErrors(error: any): void {
    this.formSubmissionErrors = error.errorMessages;
    this.failedPayloadTypes = error.payloadType;
  }

  private handleSuccessfulFormSubmission(response: any): void {
    // allow other forms to be filled ( set as incomplete for the guard to allow navigation)
    // show submitted orders if any
    this.displaySubmittedOrders(response);
    this.resetLastTab();
    this.formSubmissionErrors = null;
    this.failedPayloadTypes = null;
    // this.showSuccessDialog = true;
    this.updatePatientDemographics(response);
    this.handleProgramManagerRedirects(response);
    // handle referrals here
    this.handleFormReferrals(response);
  }

  private handleFormReferrals(data: any) {
    this.shouldShowPatientReferralsDialog(data);
    if (this.oncologyReferral) {
      this.referralsHandler.handleOncologyReferral(this.patient,
        {
          submittedEncounter: this.submittedEncounter,
          programUuid: this.activeProgram
        }
      ).subscribe(
        (result) => {
          this.referralCompleteStatus.next(true);
        },
        (error) => {
          console.error('An error occured handling the oncology referral: ', error);
        });
    }
    this.referralCompleteStatus.pipe(take(1)).subscribe((success) => {

      const referralsData = this.referralsHandler.extractRequiredValues(this.form);
      this.diffCareReferralStatus = undefined;

      if (referralsData.hasDifferentiatedCareReferal) {
        this.showProcessReferralsDialog = true;
      } else {
        // display success dialog
        this.showSuccessDialog = true;
      }
      // this.showSuccessDialog = true;
    });
  }

  public handleReferralToDC() {
    this.showProcessReferralsDialog = false;
    if (this.enrollToDC) {
      this.isBusyIndicator(true, 'Enrolling Patient to Differentiated care program...');
      this.referralsHandler.handleFormReferals(this.patient,
        this.form).pipe(
          take(1)).subscribe(
            (results) => {
              this.isBusyIndicator(false, '');
              this.showSuccessDialog = true;
              this.diffCareReferralStatus = results.differentiatedCare;
              interval(10000).pipe(map((x) => this.counter = x));
              setTimeout(() => {
                if (this.enrollToGroup) {
                  this.navigateTo('groupEnrollment');
                }
              }, 10000);
            },
            (error) => {
              console.error('Error processing referrals', error);
              this.isBusyIndicator(false, '');
              this.showSuccessDialog = true;
              this.diffCareReferralStatus = error.differentiatedCare;
            }
          );
    } else {
      this.showSuccessDialog = true;
    }
  }

  public toggleEnrollToDC() {
    this.enrollToDC = !this.enrollToDC;
    if (!this.enrollToDC) {
      this.enrollToGroup = false;
    }
  }

  public toggleOncologyReferral() {
    this.isOncologyReferral = !this.isOncologyReferral;
  }

  public toggleEnrollToGroup() {
    this.enrollToGroup = !this.enrollToGroup;
  }

  public cancelReferralToDC() {
    this.showProcessReferralsDialog = false;
    this.showSuccessDialog = true;
  }

  private resetLastTab() {
    this.form.valueProcessingInfo.lastFormTab = 0;
  }

  private displaySubmittedOrders(response: any): void {
    if (response && response.length > 0) {
      let orders: Array<any> = response[0].orders || [];
      // display ordered orders
      this.submittedOrders.encounterUuid = response[0].uuid || null;
      this.submittedOrders.orders = orders;

      // resolve order numbers
      if (this.submittedOrders.orders.length > 0) {
        this.encounterResource.getEncounterByUuid(this.submittedOrders.encounterUuid).pipe(
          take(1)).subscribe((encounter) => {
            if (encounter && encounter.orders) {
              orders = [];
              // filter out voided orders : voided is not included so we use auditInfo
              for (const order of encounter.orders) {
                if (!order.auditInfo.dateVoided) {
                  orders.push(order);
                }
              }
              this.submittedOrders.orders = orders || [];
            }
          });
      }
    }
  }

  private isBusyIndicator(isBusy: boolean, message: string = 'Please wait...'): void {
    if (isBusy === true) {
      this.busyIndicator = {
        busy: true,
        message: message
      };
    } else {
      this.busyIndicator = {
        busy: false,
        message: message
      };
    }

  }

  private setProviderUuid() {
    const request = this.getProviderUuid();
    request.subscribe(
      (data) => {
        this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
          let provider = data.providerUuid;
          if (retroSettings && retroSettings.enabled) {
            provider = retroSettings.provider.value;
          }
          this.form.valueProcessingInfo.providerUuid = provider;
          const encounterProvider = this.form.searchNodeByQuestionId('provider',
            'encounterProvider');
          if (encounterProvider.length > 0) {
            encounterProvider[0].control.setValue(provider);
          }
        });
      },
      (error) => {
        console.warn('Provider not found. Are you a provider?');
      }
    );

  }

  private getProviderUuid() {
    const encounterProvider = this.form.searchNodeByQuestionId('provider', 'encounterProvider');
    let personUuid = '';
    if (encounterProvider.length > 0) {
      personUuid = encounterProvider[0].control.value;
    }
    return this.formDataSourceService.getProviderByUuid(personUuid);
  }

  private confirmRetrospectiveSubmission(payloadTypes): void {
    this.isBusyIndicator(false);
    this.confirmationService.confirm({
      header: 'Retrospective Form Submission',
      message: 'This form is going to be submitted retrospectively. ' +
        'Are you sure you wish to proceed?',
      rejectVisible: true,
      acceptVisible: true,
      accept: () => {
        this.saveEncounterOrUpdateOnCheckDuplicate(payloadTypes);
      },
      reject: () => {
        this.isBusyIndicator(false); // hide busy indicator
        this.formSubmissionService.setSubmitStatus(false);
        this.enableSubmitBtn();
      }
    });
  }

  private saveEncounterOrUpdateOnCheckDuplicate(payloadTypes) {
    if (this.encounterUuid) {
      this.saveEncounterOrUpdate(payloadTypes);
    } else {
      this.checkDuplicate(payloadTypes);
    }
  }

  public hideProcessReferralsDialog() {
    this.showProcessReferralsDialog = false;
  }

}
