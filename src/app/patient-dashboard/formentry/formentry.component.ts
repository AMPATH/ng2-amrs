import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FormSchemaService } from '../formentry/form-schema.service';
import { FormentryHelperService } from './formentry-helper.service';
import { DraftedFormsService } from './drafted-forms.service';
import { FormFactory, EncounterAdapter, Form, PersonAttribuAdapter } from 'ng2-openmrs-formentry';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { PatientPreviousEncounterService } from '../patient-previous-encounter.service';
import { FormSubmissionService } from './form-submission.service';
import { PatientService } from '../patient.service';
import { FormDataSourceService } from './form-data-source.service';
import { Patient } from '../../models/patient.model';
import { DataSources } from 'ng2-openmrs-formentry/src/app/form-entry/data-sources/data-sources';
import { Observable, Subject } from 'rxjs';

import { ConfirmationService } from 'primeng/primeng';
import * as moment from 'moment';

import { UserService } from '../../openmrs-api/user.service';
import { UserDefaultPropertiesService } from
  '../../user-default-properties/user-default-properties.service';

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
    private draftedFormsService: DraftedFormsService,
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
  }

  wireDataSources() {
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
    this.submitForm();
  }

  public retrySubmittingPayload(): void {
    this.submitForm(this.failedPayloadTypes);
  }

  public navigateTo(path): void {
    switch (path) {
      case 'patientDashboard':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/' + this.patient.uuid + '/patient-info']);
        break;
      case 'patientSearch':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient-search']);
        break;
      default:
        console.log('unknown path');
    }

  }

  public setCurrentFormDraftedForm() {
    this.draftedFormsService.setDraftedForm(this.form);
    this.draftedFormsService.loadDraftOnNextFormLoad = false;
  }

  private loadDraftedForm() {
    this.form = this.draftedFormsService.lastDraftedForm;

    // clear from service as it is no longer a drafted form
    this.draftedFormsService.setDraftedForm(null);
  }

  private loadForm(): void {
    this.isBusyIndicator(true, 'Please wait, fetching form');
    let observableBatch: Array<Observable<any>> = [];
    // push all subscriptions to this batch eg patient, encounters, formSchema
    observableBatch.push(this.getcompiledSchemaWithEncounter()); // schema data [0]
    observableBatch.push(this.getPatient()); // patient [1]
    observableBatch.push(this.getEncounters()); // encounters [2]

    // forkjoin all requests
    Observable.forkJoin(
      observableBatch
    ).subscribe(
      data => {
        // now init private and public properties
        this.compiledSchemaWithEncounter = data[0] || null;
        this.patient = data[1] || null;
        this.encounter = data[2] || null;
        // now render form
        this.renderForm();

        this.isBusyIndicator(false);
      },
      err => {
        console.error(err);
        this.isBusyIndicator(false);
      }
      );
  }

  private renderForm(): void {
    this.formRenderingErrors = []; // clear all rendering errors
    try {
      let schema: any = this.compiledSchemaWithEncounter.schema;
      this.formName = this.compiledSchemaWithEncounter.schema.display;
      let historicalEncounter: any = this.compiledSchemaWithEncounter.encounter;
      this.dataSources.registerDataSource('patient',
        this.formDataSourceService.getPatientObject(this.patient), true);

      if (this.encounter) { // editting existing form
        this.form = this.formFactory.createForm(schema, this.dataSources.dataSources);
        this.encounterAdapter.populateForm(this.form, this.encounter);
        this.personAttribuAdapter.populateForm(this.form, this.patient.person.attributes);
        this.form.valueProcessingInfo.encounterUuid = this.encounterUuid;
      } else { // creating new from
        this.dataSources.registerDataSource('rawPrevEnc', historicalEncounter, false);
        this.form = this.formFactory.createForm(schema, this.dataSources.dataSources);
        this.form.valueProcessingInfo.patientUuid = this.patient.uuid;
        // add visit uuid if present
        if (this.visitUuid && this.visitUuid !== '')
          this.form.valueProcessingInfo.visitUuid = this.visitUuid;
        // now set default value
        this.loadDefaultValues();
      }

      // add valueProcessingInfo
      this.form.valueProcessingInfo.personUuid = this.patient.person.uuid;
      this.form.valueProcessingInfo.formUuid = schema.uuid;
      this.form.valueProcessingInfo.encounterTypeUuid = schema.encounterType.uuid;
      // Find and set a provider uuid to be used when updating orders as orderer
      this.setProviderUuid();

    } catch (ex) {
      // TODO Handle all form rendering errors
      console.error('An error occured while rendering form:', ex);
      this.formRenderingErrors.push('An error occured while rendering form: ' + ex.message);
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


  private loadDefaultValues(): void {

    let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    let currentUser = this.userService.getLoggedInUser();
    let currentDate = moment().format();

    let encounterDate = this.form.searchNodeByQuestionId('encDate');
    if (encounterDate.length > 0) {
      encounterDate[0].control.setValue(currentDate);
    }

    let encounterLocation = this.form.searchNodeByQuestionId('location');
    if (encounterLocation.length > 0 && location) {
      encounterLocation[0].control.setValue(location.uuid);
    }

    let encounterProvider = this.form.searchNodeByQuestionId('provider');
    if (encounterProvider.length > 0 && currentUser) {
      encounterProvider[0].control.setValue(currentUser.personUuid);
    }

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
      // clear formSubmissionErrors
      this.formSubmissionErrors = null;
      // submit form
      this.formSubmissionService.submitPayload(this.form, payloadTypes).subscribe(
        (data) => {
          this.isBusyIndicator(false); // hide busy indicator
          this.handleSuccessfulFormSubmission(data);
          console.log('All payloads submitted successfully:', data);
        },
        (err) => {
          console.log('error', err);
          this.isBusyIndicator(false); // hide busy indicator
          this.handleFormSubmissionErrors(err);
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
    this.formSubmissionErrors = null;
    this.failedPayloadTypes = null;
    this.showSuccessDialog = true;

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
        this.formSubmissionErrors.push({
          id: 'Provider',
          message: 'error fetching provider uuid'
        });
      }
      );

  }

  private getProviderUuid() {
    let encounterProvider = this.form.searchNodeByQuestionId('provider');
    let personUuid = '';
    if (encounterProvider.length > 0) {
      personUuid = encounterProvider[0].control.value;
    }
    return this.formDataSourceService.getProviderByPersonUuid(personUuid);
  }

}
