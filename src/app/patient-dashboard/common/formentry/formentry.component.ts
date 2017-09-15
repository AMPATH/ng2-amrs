import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, ResponseContentType, Headers } from '@angular/http';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { DraftedFormsService } from './drafted-forms.service';
import { FormFactory, EncounterAdapter, Form, PersonAttribuAdapter } from 'ng2-openmrs-formentry';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FormSubmissionService } from './form-submission.service';
import { PatientService } from '../../services/patient.service';
import { FormDataSourceService } from './form-data-source.service';
import { DataSources } from 'ng2-openmrs-formentry/dist/form-entry/data-sources/data-sources';
import { Patient } from '../../../models/patient.model';
import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import * as moment from 'moment';

import { UserService } from '../../../openmrs-api/user.service';
import { UserDefaultPropertiesService } from
  '../../../user-default-properties/user-default-properties.service';
import { MonthlyScheduleResourceService
} from '../../../etl-api/monthly-scheduled-resource.service';

@Component({
  selector: 'app-formentry',
  templateUrl: './formentry.component.html',
  styleUrls: ['./formentry.component.css']
})
export class FormentryComponent implements OnInit, OnDestroy {

  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public formName: string = '';
  public preserveFormAsDraft: boolean = true;
  public form: Form;
  public formSubmissionErrors: Array<any> = null;
  public formRenderingErrors: Array<any> = [];
  public showSuccessDialog: boolean = false;
  public patient: Patient = null;
  public submittedOrders: any = {
    encounterUuid: null,
    orders: []
  };
  private subscription: Subscription;
  private encounterUuid: string = null;
  private encounter: any = null;
  private visitUuid: string = null;
  private failedPayloadTypes: Array<string> = null;
  private compiledSchemaWithEncounter: any = null;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
              private route: ActivatedRoute,
              private formFactory: FormFactory,
              private encounterResource: EncounterResourceService,
              private encounterAdapter: EncounterAdapter,
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
              private http: Http,
              private confirmationService: ConfirmationService) {
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

      if (componentRef.draftedFormsService.lastDraftedForm !== null &&
        componentRef.draftedFormsService.lastDraftedForm !== undefined &&
        componentRef.draftedFormsService.loadDraftOnNextFormLoad) {
        componentRef.loadDraftedForm();
        return;
      } else if (componentRef.draftedFormsService.lastDraftedForm !== null &&
        componentRef.draftedFormsService.lastDraftedForm !== undefined &&
        !componentRef.draftedFormsService.loadDraftOnNextFormLoad) {
        this.confirmationService.confirm({
          header: 'Unsaved Draft Form',
          message: 'You have unsaved changes on your last form ' +
          'that will be lost upon confirmation. Do you want to continue?',
          accept: () => {
            this.draftedFormsService.setDraftedForm(null);
            componentRef.loadForm();
          },
          reject: () => {
            componentRef.loadDraftedForm();
          }
        });
        return;
      }
      componentRef.loadForm();   // load  form
    });
  }

  public ngOnDestroy() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Formentry Component Unloaded', 'ngOnDestroy');
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
    console.log('FORM MODEL:', this.form.rootNode.control);
    const isSaving = this.formSubmissionService.getSubmitStatus();
    if (!isSaving) {
      this.submitForm();
    }
  }

  public onCancel(e): void {
    this.confirmationService.confirm({
      header: 'Cancel Form',
      message: 'Leaving this form unsaved will delete this data. Are you sure you wish to proceed?',
      accept: () => {
        this.preserveFormAsDraft = false;
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
        this.patient.uuid + '/general/landing-page']);
        this.patientService.fetchPatientByUuid(this.patient.uuid);
        break;
      case 'formList':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient/' +
        this.patient.uuid + '/general/forms']);
        break;
      case 'patientSearch':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient-search'], {
          queryParams: { reset: true }
        });
        break;
      default:
        console.log('unknown path');
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

    let encounterDate = this.form.searchNodeByQuestionId('encDate');
    if (encounterDate.length > 0) {
      encounterDate[0].control.setValue(currentDate);
    }

    let encounterLocation = this.form.searchNodeByQuestionId('location', 'encounterLocation');
    if (encounterLocation.length > 0 && location) {
      encounterLocation[0].control.setValue(location.uuid);
    }

    let encounterProvider = this.form.searchNodeByQuestionId('provider', 'encounterProvider');
    if (encounterProvider.length > 0 && currentUser) {
      encounterProvider[0].control.setValue(currentUser.personUuid);
    }

  }

  private loadDraftedForm() {
    this.form = this.draftedFormsService.lastDraftedForm;

    // clear from service as it is no longer a drafted form
    this.draftedFormsService.saveRouteSnapshot(null);
    this.draftedFormsService.setDraftedForm(null);
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
    ).subscribe(
      (data) => {
        // now init private and public properties
        this.compiledSchemaWithEncounter = data[0] || null;
        this.patient = data[1] || null;
        this.encounter = data[2] || null;
        // now render form
        this.renderForm();

        this.isBusyIndicator(false);
      },
      (err) => {
        console.error(err.json());
        this.isBusyIndicator(false);
        this.formRenderingErrors
          .push('An error occured while loading form, please check your connection');
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
      console.error(e);
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

  private getEncounters(): Observable<any> {

    return Observable.create((observer: Subject<any>) => {
      if (this.encounterUuid && this.encounterUuid !== '') {
        this.encounterResource.getEncounterByUuid(this.encounterUuid)
          .subscribe((encounter) => {
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
    if (this.form.valid) {
      this.isBusyIndicator(true, 'Please wait, saving form...');
      this.formSubmissionService.setSubmitStatus(true);
      // clear formSubmissionErrors
      this.formSubmissionErrors = null;
      // reset submitted orders
      this.submittedOrders.encounterUuid = null;
      this.submittedOrders.orders = [];
      // submit form
      this.formSubmissionService.submitPayload(this.form, payloadTypes).subscribe(
        (data) => {
          this.isBusyIndicator(false); // hide busy indicator
          this.handleSuccessfulFormSubmission(data);
          console.log('All payloads submitted successfully:', data);
          this.formSubmissionService.setSubmitStatus(false);
        },
        (err) => {
          console.log('error', err);
          this.isBusyIndicator(false); // hide busy indicator
          this.handleFormSubmissionErrors(err);
          this.formSubmissionService.setSubmitStatus(false);
        });
    } else {
      this.form.markInvalidControls(this.form.rootNode);
    }
  }

  private handleFormSubmissionErrors(error: any): void {
    this.formSubmissionErrors = error.errorMessages;
    this.failedPayloadTypes = error.payloadType;
  }

  private handleSuccessfulFormSubmission(response: any): void {

    // show submitted orders if any
    this.displaySubmittedOrders(response);
    this.resetLastTab();
    this.formSubmissionErrors = null;
    this.failedPayloadTypes = null;
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
        this.form.valueProcessingInfo.providerUuid = data.providerUuid;
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
    return this.formDataSourceService.getProviderByPersonUuid(personUuid);
  }

}
