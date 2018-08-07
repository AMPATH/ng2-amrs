import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, ResponseContentType, Headers } from '@angular/http';

import * as moment from 'moment';
import *  as _ from 'lodash';
import { format } from 'date-fns';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { DraftedFormsService } from './drafted-forms.service';
import {
  FormFactory, EncounterAdapter, Form, PersonAttribuAdapter,
  HistoricalEncounterDataService
 } from 'ng2-openmrs-formentry';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FormSubmissionService } from './form-submission.service';
import { PatientService } from '../../services/patient.service';
import { FormDataSourceService } from './form-data-source.service';
import { DataSources } from 'ng2-openmrs-formentry/dist/form-entry/data-sources/data-sources';
import { Patient } from '../../../models/patient.model';
import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { ConfirmationService } from 'primeng/primeng';
import { FormentryHelperService } from './formentry-helper.service';

import { UserService } from '../../../openmrs-api/user.service';
import {
  UserDefaultPropertiesService
} from
  '../../../user-default-properties/user-default-properties.service';
import {
  MonthlyScheduleResourceService
}
  from '../../../etl-api/monthly-scheduled-resource.service';
import { PatientReminderService } from '../patient-reminders/patient-reminders.service';
import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';
import { ProgramsTransferCareService } from '../../programs/transfer-care/transfer-care.service';

import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PatientReferralService } from '../../../referral-module/services/patient-referral-service';
import { EncounterType } from '../../../models/encounter-type.model';
import { RetrospectiveDataEntryService
} from '../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';

@Component({
  selector: 'app-formentry',
  templateUrl: './formentry.component.html',
  styleUrls: ['./formentry.component.css']
})
export class FormentryComponent implements OnInit, OnDestroy {

  public busyIndicator: any = {
    busy: true,
    message: 'Please wait...' // default message
  };
  public formName: string = '';
  public preserveFormAsDraft: boolean = true;
  public form: Form;
  public formSubmissionErrors: Array<any> = null;
  public formRenderingErrors: Array<any> = [];
  public referralPrograms: string[] = [];
  public showSuccessDialog: boolean = false;
  public showReferralDialog: boolean = false;
  public referralCompleteStatus: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public patient: Patient = null;
  public submitClicked: boolean = false;
  public submittedOrders: any = {
    encounterUuid: null,
    orders: []
  };
  public submittedEncounter: any;
  public diffCareReferralStatus: any = undefined;
  public transferCareForm: string = null;
  public programEncounter: string = null;
  public referralEncounterType: string;
  public encounterLocation: any;
  private subscription: Subscription;
  private encounterUuid: string = null;
  private encounter: any = null;
  private visitUuid: string = null;
  private failedPayloadTypes: Array<string> = null;
  private compiledSchemaWithEncounter: any = null;
  private submitDuplicate: boolean = false;
  private previousEncounters = [];

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
              private patientReferralService: PatientReferralService,
              private conceptResourceService: ConceptResourceService,
              private referralsHandler: FormentryReferralsHandlerService,
              private formentryHelperService: FormentryHelperService,
              private patientReminderService: PatientReminderService,
              private transferCareService: ProgramsTransferCareService,
              private confirmationService: ConfirmationService,
              private personResourceService: PersonResourceService) {
  }

  public ngOnInit() {

    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Formentry Component Loaded', 'ngOnInit');
    this.wireDataSources();
    let componentRef = this;

    // get visitUuid & encounterUuid then load form
    this.route.queryParams.subscribe((params) => {
      componentRef.visitUuid = params['visitUuid'];
      componentRef.encounterUuid = params['encounter'];
      componentRef.transferCareForm = params['transferCareEncounter'];
      componentRef.programEncounter = params['programEncounter'];
      componentRef.referralEncounterType = params['referralEncounterType'];
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
      componentRef.loadForm();   // load  form
      this.isBusyIndicator(false);
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
  }

  public onSubmit(): void {
    setTimeout(() => {
      if (!this.form.valid && this.form.showErrors) {
        document.body.scrollTop = 0;
      }
    }, 100);
    const isSaving = this.formSubmissionService.getSubmitStatus();

    if (!isSaving) {
      this.submitForm();
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
        this.transferCareService.setTransferStatus(false);
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
        this.patientService.fetchPatientByUuid(this.patient.uuid);
        break;
      case 'formList':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient/' +
          this.patient.uuid + '/general/general/forms']);
        break;
      case 'transferCareformWizard':
        this.preserveFormAsDraft = false;
        let processId = _.uniqueId('form_transfer_care_');
        if (this.transferCareService.isModal.getValue()) {
          this.router.navigate(['/patient-dashboard/patient/' +
            this.patient.uuid + '/general/general/landing-page'],
            {queryParams: {completeEnrollment: true, processId: processId}});
        } else {
          this.router.navigate(['/patient-dashboard/patient/' +
          this.patient.uuid + '/general/general/programs/transfer-care/forms'],
            {queryParams: {processId: processId}});
        }
        break;
      case 'enrollmentManager':
        this.preserveFormAsDraft = false;
        this.patientReferralService.getProcessPayload().subscribe((payload) => {
          if (payload && _.isUndefined(payload.submittedEncounter)) {
            // use this processId to signal end of process
            _.extend(payload, {
              processId: _.uniqueId('referral_')
            });
            this.patientReferralService.saveProcessPayload(_.extend(payload,
              {
                submittedEncounter: {
                  encounter: this.submittedEncounter,
                  encounterLocation: this.encounterLocation
                }
              }));
          }
        });
        this.route.queryParams.subscribe((params) => {
          let toLandingPage = params['parentComponent'] === 'landing-page';
          if (toLandingPage) {
            this.router.navigate(['/patient-dashboard/patient/' +
            this.patient.uuid + '/general/general/landing-page']);
          } else {
            this.router.navigate(['/patient-dashboard/patient/' +
            this.patient.uuid + '/general/general/programs/enrollment-manager']);
          }
        });
        break;
      case 'patientSearch':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient-search'], {
          queryParams: {reset: true}
        });
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
    let currentUser = this.userService.getLoggedInUser();
    let currentDate = moment().format();
    // let retroSettings = this.retrospectiveDataEntryService.retroSettings.value;
    this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
      if (retroSettings && retroSettings.enabled) {
        location = {
          uuid: retroSettings.location.value,
          display: retroSettings.location.label
        };
        currentDate = moment(this.setRetroDateTime(retroSettings)).format();
      }

      let encounterDate = this.form.searchNodeByQuestionId('encDate');
      if (encounterDate.length > 0) {
        encounterDate[0].control.setValue(currentDate);
      }

      let encounterLocation = this.form.searchNodeByQuestionId('location',
        'encounterLocation');
      if (encounterLocation.length > 0 && location) {
        this.encounterLocation = { value: location.uuid, label: location.display };
        encounterLocation[0].control.setValue(location.uuid);
      }

      let encounterProvider = this.form.searchNodeByQuestionId('provider',
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

    this.autoSelectReferPatientStateIfReferring();
  }

  public autoSelectReferPatientStateIfReferring() {
    let patientState = this.form.searchNodeByQuestionId('state');
    if (patientState.length > 0 && (_.isNil(this.referralEncounterType)
        || !_.includes(['DERMRESPONSE'], this.form.schema.encounterType.name))) {
      // refer concept uuid
      let referConceptUuuid = '0c5565c5-45cf-40ab-aa6d-5694aeabae18';
      patientState[0].control.setValue(referConceptUuuid);
    }
  }

  public onAbortingReferral(event) {
    this.showReferralDialog = false;
    this.referralCompleteStatus.next(false);
  }

  public onReferralSuccess() {
    this.showReferralDialog = false;
    this.referralPrograms = [];
    this.referralCompleteStatus.next(true);
  }

  public shouldShowPatientReferralsDialog(data: any): void {
    this.submittedEncounter = data;
    // check if referral question was filled (questionId is either referrals or patientReferrals)
    let referralQuestion = this.form.searchNodeByQuestionId('referrals');
    if (referralQuestion.length === 0) {
      referralQuestion = this.form.searchNodeByQuestionId('patientReferrals');
    }
    // if form has `Patient State` question
    if (referralQuestion.length === 0) {
      referralQuestion = this.form.searchNodeByQuestionId('state');
    }
    // if question exists provide for referrals
    if (referralQuestion.length > 0 && _.isNil(this.programEncounter)) {
      let answer = _.first(referralQuestion).control.value;
      if (answer) {
        let dermEncounterTypes = ['DERMATOLOGY', 'DERMATOLOGYREFERRAL', 'DERMINITIAL',
          'DERMRESPONSE', 'DERMRETURN'];
        if (_.includes(dermEncounterTypes, this.form.schema.encounterType.name)) {
          this.referralPrograms = _.filter(this.patient.enrolledPrograms, (program: any) => {
            return program.programUuid === 'b3575274-1850-429b-bb8f-2ff83faedbaf'
              || program.programUuid === '781d8768-1359-11df-a1f1-0026b9348837';
          });
          if (this.referralPrograms.length > 0) {
            this.showReferralDialog = true;
          }
        } else {
          // map concept with program
          this.searchReferralConcepts(answer).subscribe((concepts) => {
            this.referralPrograms = _.filter(this.patient.enrolledPrograms, (program: any) => {
              return _.includes(_.map(concepts, 'uuid'), program.concept.uuid);
            });
          });
          if (this.referralPrograms.length > 0) {
            this.showReferralDialog = true;
          }
        }
      }
    } else {
      this.referralCompleteStatus.next(false);
    }
  }

  public updatePatientDemographics(data: any): void {
    // check if patient status was filled
    // (questionId is patstat in Outreach Field Follow-Up Form V1.0)
    let patientCareStatus = this.form.searchNodeByQuestionId('patstat');
    let deathDate = this.form.searchNodeByQuestionId('deathDate');
    let causeOfDeath = this.form.searchNodeByQuestionId('reasdeath');
    if (causeOfDeath.length === 0 ) {
      causeOfDeath = this.form.searchNodeByQuestionId('deathCause');
    }

    // if question exists provide for demographic update
    /* UPDATE: at the moment, only deathDate  and cause are the only consistent concepts across
     *  the forms.
     *  none of the fields are required. By assumption, if someone fills death death and cause,
     *  the patient is dead
     */

    if (patientCareStatus.length > 0
      && _.first(patientCareStatus).control.value !== 'a89335d6-1350-11df-a1f1-0026b9') {
      this.personResourceService.saveUpdatePerson(this.patient.uuid, {
        dead : false,
        deathDate: null,
        causeOfDeath: null
      }).subscribe(() => {

        });
    }

    if ((causeOfDeath.length > 0 && _.first(causeOfDeath).control.value.length > 0)
      && (deathDate.length > 0 && _.first(deathDate).control.value.length > 0)) {
        let personNamePayload = {
          dead: true,
          deathDate: _.first(deathDate).control.value,
          causeOfDeath: _.first(causeOfDeath).control.value
        };

        this.personResourceService.saveUpdatePerson(this.patient.uuid, personNamePayload)
          .subscribe(() => {

        });
    }
  }

  private searchReferralConcepts(concepts) {
    let searchBatch: Array<Observable<any>> = [];
    _.each(concepts, (concept: any) => {
        searchBatch.push(this.conceptResourceService.getConceptByUuid(concept));
    });
    return Observable.forkJoin(searchBatch);
  }

  private setRetroDateTime(settings) {
    return new Date(settings.visitDate + ', ' + settings.visitTime);
  }

  private loadDraftedForm() {
    this.form = this.draftedFormsService.lastDraftedForm;
    this.formName = this.form.schema.display;

    // get patient

    this.getPatient().subscribe((results) => {
      this.patient = results;
    });

    // clear from service as it is no longer a drafted form
    this.draftedFormsService.saveRouteSnapshot(null);
    this.draftedFormsService.setDraftedForm(null);
    this.isBusyIndicator(false);
  }

  private loadForm(): void {
    this.isBusyIndicator(true, 'Please wait, loading form');
    let observableBatch: Array<Observable<any>> = [];
    // push all subscriptions to this batch eg patient, encounters, formSchema
    observableBatch.push(this.getcompiledSchemaWithEncounter()); // schema data [0]
    observableBatch.push(this.getPatient()); // patient [1]
    observableBatch.push(this.getEncounters()); // encounters [2]

    // forkjoin all requests
    this.subscription = Observable.forkJoin(
      observableBatch
    ).flatMap((data) => {
      // now init private and public properties
      this.compiledSchemaWithEncounter = data[0] || null;
      this.patient = data[1] || null;
      this.encounter = data[2] || null;
      // now render form
      return this.patientReminderService.getPatientReminders(this.patient.person.uuid);
    }).subscribe(
      (data: any) => {
        console.log(data.generatedReminders);
        let reminder = _.find(data.generatedReminders, (o: any) => {
          return o.title === 'Viral Load Reminder';
        });
        if (reminder) {
          this.dataSources.registerDataSource('vlFormAlert', {needsVl: true}, true);
        }
        this.renderForm();
        this.isBusyIndicator(false);
      },
      (err) => {
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
    let childControls = [
      'difOfCaregiver',
      'missADose',
      'receiveADose',
      'trueOfCaregiver',
      'adherenceAss'
    ];

    let onArtControl = form.searchNodeByQuestionId('onArt');
    let pcpProphylaxisCurrentControl = form.searchNodeByQuestionId('pcpProphylaxisCurrent');
    let onTbProphylaxisControl = form.searchNodeByQuestionId('onTbProphylaxis');

    childControls.forEach((cControl) => {
      let childControl = form.searchNodeByQuestionId(cControl);

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

    let tbProphyAdherencenotes = form.searchNodeByQuestionId('tbProphyAdherencenotes');
    this.updateRelatedControlFix(onTbProphylaxisControl[0], tbProphyAdherencenotes[0]);
    let tbAdherencenotes = form.searchNodeByQuestionId('tbAdherencenotes');
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
      let schema: any = this.compiledSchemaWithEncounter.schema;
      this.formName = this.compiledSchemaWithEncounter.schema.display;
      let historicalEncounter: any = this.compiledSchemaWithEncounter.encounter;
      this.dataSources.registerDataSource('patient',
        this.formDataSourceService.getPatientObject(this.patient), true);
      this.dataSources.registerDataSource('monthlyScheduleResourceService',
        this.monthlyScheduleResourceService);
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

    let hd = new HistoricalEncounterDataService();
    if (this.compiledSchemaWithEncounter.visit &&
      this.compiledSchemaWithEncounter.visit.encounters &&
      Array.isArray(this.compiledSchemaWithEncounter.visit.encounters)) {
      let visitEncounters: Array<any> = this.compiledSchemaWithEncounter.visit.encounters;
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

      let whoStageQuestion = whoQuestions[0];

      whoStageQuestion.control.valueChanges.subscribe((val) => {
        if (val && val !== '') {
          let source = this.form.dataSourcesContainer.dataSources['conceptAnswers'];
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
    }).first();
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
    }).first();
  }

  private registerVLDatasource(reminders: any) {
    if (reminders) {
      let vlReminder = _.find(reminders['generatedReminders'], (o: any) => {
        return o.title === 'Viral Load Reminder';
      });
      if (vlReminder) {
        this.dataSources.registerDataSource('vlFormAlert', {needsVl: true}, true);
      } else {
        this.dataSources.registerDataSource('vlFormAlert', {needsVl: false}, true);
      }
    }

  }

  private getEncounters(): Observable<any> {

    return Observable.create((observer: Subject<any>) => {
      if (this.encounterUuid && this.encounterUuid !== '') {
        this.encounterResource.getEncounterByUuid(this.encounterUuid)
          .subscribe((encounter) => {
            // let wrappedEnconter: Encounter = new Encounter(encounter);
            observer.next(encounter);
          }, (error) => {
            observer.error(error);
          });
      } else {
        observer.next(null);
      }
    }).first();
  }

  private submitForm(payloadTypes: Array<string> = ['encounter', 'personAttribute']): void {
    this.form.showErrors = !this.form.valid;
    this.disableSubmitBtn();
    // this.handleFormReferrals();
    if (this.form.valid) {
      this.isBusyIndicator(true, 'Please wait, saving form...');
      this.formSubmissionService.setSubmitStatus(true);
      // clear formSubmissionErrors
      this.formSubmissionErrors = null;
      // reset submitted orders
      this.submittedOrders.encounterUuid = null;
      this.submittedOrders.orders = [];
      // submit form
      let retroSettings = this.retrospectiveDataEntryService.retroSettings.value;
      if (retroSettings && retroSettings.enabled) {
        this.confirmRetrospectiveSubmission(payloadTypes);
      } else {
        this.saveEncounterOrUpdateOnCheckDuplicate(payloadTypes);
      }

    } else {

      // document.getElementById('formentry-submit-btn').setAttribute('disabled', 'true');
      this.form.markInvalidControls(this.form.rootNode);
      this.enableSubmitBtn();
    }

    }

  private saveEncounterOrUpdate(payloadTypes) {
    this.formSubmissionService.submitPayload(this.form, payloadTypes).subscribe(
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
        .flatMap((patientUuid: string) => {
          return this.encounterResource.getEncountersByPatientUuid(patientUuid);
        }
        ).flatMap((encounters) => {
      this.previousEncounters = encounters;
      if (this.formentryHelperService.encounterTypeFilled(encounters,
        this.form.schema.encounterType.uuid,
        this.extractEncounterDate()) && !this.submitDuplicate) {
        return Observable.of(true);
      }else {
        return Observable.of(false);
      }
    }).subscribe(
      (isDuplicate) => {
        this.isBusyIndicator(false); // hide busy indicator
        if (isDuplicate) {
          this.saveDuplicate();
        }else {
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

    let submitStatus = this.submitClicked;
    return submitStatus;

  }

  private resetSubmitStatus() {

    this.submitClicked = false;

  }

  private disableSubmitBtn() {

    let submitBtn = document.getElementById('formentry-submit-btn');
    if (typeof submitBtn === 'undefined' || submitBtn === null) {

    } else {

      document.getElementById('formentry-submit-btn').setAttribute('disabled', 'true');

    }
  }

  private enableSubmitBtn() {

    let submitBtn = document.getElementById('formentry-submit-btn');

    if (typeof submitBtn === 'undefined' || submitBtn === null) {

    } else {

      document.getElementById('formentry-submit-btn').removeAttribute('disabled');

      this.resetSubmitStatus();
    }

  }

  private extractEncounterDate() {
    let nodes = this.form.searchNodeByQuestionId('encDate');
    if (nodes.length > 0) {
      return nodes[0].control.value;
    }
    return '';
  }

  private saveDuplicate() {
    let encounterDate = this.extractEncounterDate();
    let duplicateEncounter = this.formentryHelperService
    .getLastDuplicateEncounter(this.previousEncounters,
      this.form.schema.encounterType.uuid, encounterDate);
    let duplicateMoment = Object.assign({}, moment);
    let encounterDateMoment = moment(new Date(encounterDate));
    this.confirmationService.confirm({
      header: 'Form Duplication warning',
      key: 'duplicateWarning',
      message: `A similar form was completed on  ` +
      `${format(duplicateEncounter.encounterDatetime , 'DD/MM/YYYY')} ` +
      ` at ${format(duplicateEncounter.encounterDatetime, 'HH:mm')} ` +
      `by  ${duplicateEncounter.encounterProviders[0].provider.display}
      Are you sure you want to submit this encounter ` +
      ` for the current specified date ${format(new Date(encounterDate), 'DD/MM/YYYY')} at ` +
      `${format(new Date(encounterDate), 'HH:mm')}`,
      accept: () => {
        this.submitDuplicate = true;
        this.submitForm();
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
    this.transferCareService.setTransferStatus(false);
    // show submitted orders if any
    this.displaySubmittedOrders(response);
    this.resetLastTab();
    this.formSubmissionErrors = null;
    this.failedPayloadTypes = null;
    // this.showSuccessDialog = true;
    this.updatePatientDemographics(response);
    // handle referrals here
    this.handleFormReferrals(response);
  }

  private handleFormReferrals(data: any) {
    this.shouldShowPatientReferralsDialog(data);
    this.referralCompleteStatus.subscribe((success) => {

      let referralsData = this.referralsHandler.extractRequiredValues(this.form);
      this.diffCareReferralStatus = undefined;

      if (referralsData.hasDifferentiatedCareReferal) {
        this.confirmationService.confirm({
          header: 'Process Referrals',
          message: 'You have referred the patient to ' +
          'differentiated care program. Do you want to enroll patient to the program?',
          accept: () => {
            this.isBusyIndicator(true, 'Enrolling Patient to Differentiated care program ....');
            this.referralsHandler.handleFormReferals(this.patient,
              this.form)
              .subscribe(
                (results) => {
                  this.isBusyIndicator(false, '');
                  this.showSuccessDialog = true;
                  this.diffCareReferralStatus = results.differentiatedCare;
                },
                (error) => {
                  console.error('Error processing referrals', error);
                  this.isBusyIndicator(false, '');
                  this.showSuccessDialog = true;
                  this.diffCareReferralStatus = error.differentiatedCare;
                }
              );
          },
          reject: () => {
            this.showSuccessDialog = true;
          }
        });

      } else {
        // display success dialog
        this.showSuccessDialog = true;
      }
      // this.showSuccessDialog = true;
    });
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
        this.encounterResource.getEncounterByUuid(this.submittedOrders.encounterUuid)
          .subscribe((encounter) => {
            if (encounter && encounter.orders) {
              orders = [];
              // filter out voided orders : voided is not included so we use auditInfo
              for (let order of encounter.orders) {
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
    let request = this.getProviderUuid();
    request
      .subscribe(
        (data) => {
          this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
            let provider = data.providerUuid;
            if (retroSettings && retroSettings.enabled) {
              provider = retroSettings.provider.value;
            }
            this.form.valueProcessingInfo.providerUuid = provider;
          });

        },
        (error) => {
          console.warn('Provider not found. Are you a provider?');
        }
      );

  }

  private getProviderUuid() {
    let encounterProvider = this.form.searchNodeByQuestionId('provider', 'encounterProvider');
    let personUuid = '';
    if (encounterProvider.length > 0) {
      personUuid = encounterProvider[0].control.value;
    }
    return this.formDataSourceService.getProviderByUuid(personUuid);
  }

  private confirmRetrospectiveSubmission(payloadTypes): void {
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

}
