import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { format } from 'date-fns';
import { take, map } from 'rxjs/operators';
import { flatMap, first } from 'rxjs/operators';
import {
  forkJoin,
  Observable,
  Subject,
  Subscription,
  BehaviorSubject,
  of,
  interval
} from 'rxjs';

import { DataSources } from '@ampath-kenya/ngx-openmrs-formentry';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { ConfirmationService } from 'primeng/primeng';
import { DraftedFormsService } from './drafted-forms.service';
import {
  FormFactory,
  EncounterAdapter,
  Form,
  PersonAttribuAdapter,
  HistoricalEncounterDataService
} from '@ampath-kenya/ngx-openmrs-formentry';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { FormentryHelperService } from './formentry-helper.service';
import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';
import { FormDataSourceService } from './form-data-source.service';
import { FormSubmissionService } from './form-submission.service';
import { MonthlyScheduleResourceService } from '../../../etl-api/monthly-scheduled-resource.service';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';

import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { RetrospectiveDataEntryService } from '../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { PatientTransferService } from './patient-transfer.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { UserService } from '../../../openmrs-api/user.service';
import { PatientConsentResourceService } from './../../../openmrs-api/patient-consent-resource.service';
import { Covid19ResourceService } from './../../../etl-api/covid-19-resource-service';

// interfaces
import { ReferralStatus } from './../../../interfaces/referral-status.interface';
import { Covid19StatusSummary } from './../../../interfaces/covid-19-summary.interface';

// constants
import { FormUuids } from './../../../constants/forms.constants';
import { ProgramManagerService } from 'src/app/program-manager/program-manager.service';

interface RefProgram {
  uuid: string;
  name: string;
  locationUuid: string;
}

@Component({
  selector: 'app-formentry',
  templateUrl: './formentry.component.html',
  styleUrls: ['./formentry.component.css']
})
export class FormentryComponent implements OnInit, OnDestroy {
  public activeProgram: string;
  public busyIndicator: any = {
    busy: true,
    message: 'Please wait...' // default message
  };
  public cdmReferralFormUuid = 'd70566bb-436e-4fe3-828d-1793258ba60e';
  public oncologyReferralFormUuid = '696086df-8299-419e-b434-cb2403248207';
  public counter: number;
  public diffCareReferralStatus: any = undefined;
  public encounterLocation: any;
  public enrollToGroup = false;
  public enrollToDC = false;
  public enrollToHivRefferalProgram = null;
  public form: Form;
  public formName = '';
  public formRenderingErrors: Array<any> = [];
  public formSubmissionErrors: Array<any> = null;
  public formUuid: string;
  public isGroupVisit = false;
  public isOncologyReferral = false;
  public isReferral: boolean;
  public oncologyReferral: boolean;
  public patient: Patient = null;
  public preserveFormAsDraft = true;
  public programClass: string;
  public programEncounter: string = null;
  public referralCompleteStatus: BehaviorSubject<boolean> = new BehaviorSubject(
    null
  );
  public referralEncounterType: string;
  public referralStatus: any;
  public referralSuccess = false;
  public referralValidity = true;
  public refProgram: string;
  public refLocation: string;
  public showSuccessDialog = false;
  public showReferralDialog = false;
  public showProcessReferralsDialog;
  public showInternalMovementReferralsDialog = false;
  public internalRefProgram: RefProgram = {
    uuid: '',
    name: '',
    locationUuid: ''
  };
  public step: number;
  public submitClicked = false;
  public submittedEncounter: any;
  public submittedOrders: any = {
    encounterUuid: null,
    orders: []
  };
  public visitTypeUuid: string = null;
  public warnMCHTransfer: boolean;
  private compiledSchemaWithEncounter: any = null;
  private encounter: any = null;
  private encounterUuid: string = null;
  private failedPayloadTypes: Array<string> = null;
  private groupUuid;
  private previousEncounters = [];
  private submitDuplicate = false;
  private subscription: Subscription;
  private visitUuid: string = null;
  private hasCallConsent = false;
  private familyTestingEncounterUuid: any;
  private covidAssessment: any;
  private updateContacts: boolean;
  private covid19VaccineStatus: string;
  private internalMovementFormUuid = FormUuids.INTERNAL_MOVEMENT_FORM_UUID;
  public referToHivProgram = 0;
  public hivReferralStatus: ReferralStatus = {
    status: '',
    message: ''
  };
  public isOtzProgram = false;
  private YES_ELIGIBLE_FOR_DELIVERY_CONCEPT =
    'a899b35c-1350-11df-a1f1-0026b9348838';
  private COMMUNITY_PHARMACY_CONCEPT = '33363568-fb62-4063-b0ac-e37be1d23514';
  private isEligibleForDelivery = false;

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    public route: ActivatedRoute,
    private conceptResourceService: ConceptResourceService,
    private confirmationService: ConfirmationService,
    private dataSources: DataSources,
    public draftedFormsService: DraftedFormsService,
    private encounterAdapter: EncounterAdapter,
    private formFactory: FormFactory,
    private encounterResource: EncounterResourceService,
    private fileUploadResourceService: FileUploadResourceService,
    private formentryHelperService: FormentryHelperService,
    private referralsHandler: FormentryReferralsHandlerService,
    private formDataSourceService: FormDataSourceService,
    private formSubmissionService: FormSubmissionService,
    private monthlyScheduleResourceService: MonthlyScheduleResourceService,
    private patientService: PatientService,
    private patientTransferService: PatientTransferService,
    private patientProgramResourceService: PatientProgramResourceService,
    private personAttribuAdapter: PersonAttribuAdapter,
    private personResourceService: PersonResourceService,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    public router: Router,
    private userService: UserService,
    public userDefaultPropertiesService: UserDefaultPropertiesService,
    public patientConsentResourceService: PatientConsentResourceService,
    private covid19Service: Covid19ResourceService,
    private propertyLocationService: UserDefaultPropertiesService,
    private programManagerService: ProgramManagerService
  ) {}

  public ngOnInit() {
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Formentry Component Loaded',
      'ngOnInit'
    );
    this.wireDataSources();
    const componentRef = this;
    this.route.params.subscribe((routeParams) => {
      if (routeParams) {
        this.activeProgram = routeParams.program;
        this.formUuid = routeParams['formUuid'];
        this.programClass = routeParams['programClass'];
        // get visitUuid & encounterUuid then load form
        this.route.queryParams.subscribe((params) => {
          componentRef.encounterUuid = params['encounter'];
          componentRef.groupUuid = params['groupUuid'];
          componentRef.isReferral = params['isReferral'];
          componentRef.programEncounter = params['programEncounter'];
          componentRef.referralEncounterType = params['referralEncounterType'];
          componentRef.step = params['step']
            ? parseInt(params['step'], 10)
            : null;
          componentRef.visitTypeUuid = params['visitTypeUuid'];
          componentRef.visitUuid = params['visitUuid'];
          if (
            componentRef.draftedFormsService.lastDraftedForm !== null &&
            componentRef.draftedFormsService.lastDraftedForm !== undefined &&
            componentRef.draftedFormsService.loadDraftOnNextFormLoad
          ) {
            componentRef.loadDraftedForm();
            return;
          } else if (
            componentRef.draftedFormsService.lastDraftedForm !== null &&
            componentRef.draftedFormsService.lastDraftedForm !== undefined &&
            !componentRef.draftedFormsService.loadDraftOnNextFormLoad
          ) {
            setTimeout(() => {
              this.confirmationService.confirm({
                header: 'Unsaved Draft Form',
                message:
                  'You have unsaved changes on your last form ' +
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
            componentRef.isGroupVisit = true;
          }
          this.patientTransferService.componentRef = componentRef;
          componentRef.loadForm(); // load form
          // this.isBusyIndicator(false);
        });
      }
    });
  }

  public ngOnDestroy() {
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Formentry Component Unloaded',
      'ngOnDestroy'
    );
    this.showReferralDialog = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public wireDataSources() {
    this.dataSources.registerDataSource(
      'location',
      this.formDataSourceService.getDataSources()['location']
    );
    this.dataSources.registerDataSource(
      'siblingLocations',
      this.formDataSourceService.getDataSources()['siblingLocations']
    );
    this.dataSources.registerDataSource(
      'provider',
      this.formDataSourceService.getDataSources()['provider']
    );
    this.dataSources.registerDataSource(
      'drug',
      this.formDataSourceService.getDataSources()['drug']
    );
    this.dataSources.registerDataSource(
      'problem',
      this.formDataSourceService.getDataSources()['problem']
    );
    this.dataSources.registerDataSource(
      'personAttribute',
      this.formDataSourceService.getDataSources()['location']
    );
    this.dataSources.registerDataSource(
      'conceptAnswers',
      this.formDataSourceService.getDataSources()['conceptAnswers']
    );
    this.dataSources.registerDataSource(
      'patient',
      this.formDataSourceService.getDataSources()['visitTypeUuid']
    );
    this.dataSources.registerDataSource(
      'patient',
      this.formDataSourceService.getDataSources()['hasCallConsent']
    );
    this.dataSources.registerDataSource(
      'patient',
      this.formDataSourceService.getDataSources()['covid19VaccinationStatus']
    );
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
      message:
        'Leaving this form unsaved will delete this data. Are you sure you wish to proceed?',
      rejectVisible: true,
      acceptVisible: true,
      accept: () => {
        this.preserveFormAsDraft = false;
        // allow the user to cancel
        // this.draftedFormsService.setCancelState();
        this.resetLastTab();
        window.history.go(-1);
      },
      reject: () => {}
    });
  }

  public retrySubmittingPayload(): void {
    this.submitForm(this.failedPayloadTypes);
  }

  public navigateTo(path: string): void {
    switch (path) {
      case 'patientDashboard':
        this.preserveFormAsDraft = false;
        this.router.navigate([
          '/patient-dashboard/patient/' +
            this.patient.uuid +
            '/general/general/landing-page'
        ]);
        this.patientService.reloadCurrentPatient();
        break;
      case 'formList':
        this.preserveFormAsDraft = false;
        this.router.navigate([
          '/patient-dashboard/patient/' +
            this.patient.uuid +
            '/general/general/forms'
        ]);
        break;
      case 'programManager':
        this.navigateToProgramManager();
        break;
      case 'programManagerReferral':
        this.preserveFormAsDraft = false;
        this.router.navigate([
          '/patient-dashboard/patient/' +
            this.patient.uuid +
            '/general/general/program-manager/new-program',
          'step',
          3
        ]);
        break;
      case 'programReferral':
        this.preserveFormAsDraft = false;
        this.referralStatus = null;
        this.showSuccessDialog = false;
        this.toggleReferral();
        this.router.navigate(
          [
            '/patient-dashboard/patient/' +
              this.patient.uuid +
              `/${this.programClass}/` +
              this.activeProgram +
              '/formentry',
            this.programClass === 'cdm'
              ? this.cdmReferralFormUuid
              : this.oncologyReferralFormUuid
          ],
          { queryParams: { isReferral: true } }
        );
        break;
      case 'patientSearch':
        this.preserveFormAsDraft = false;
        this.router.navigate(['/patient-dashboard/patient-search'], {
          queryParams: { reset: true }
        });
        break;
      case 'groupManager':
        this.preserveFormAsDraft = false;
        this.router.navigate([
          '/clinic-dashboard/' +
            this.encounterLocation.value +
            '/general/group-manager/group/' +
            this.groupUuid
        ]);
        break;
      case 'groupDashboard':
        this.preserveFormAsDraft = false;
        this.router.navigate([
          '/clinic-dashboard/' +
            this.encounterLocation.value +
            '/hiv/group-manager'
        ]);
        break;
      case 'groupEnrollment':
        this.preserveFormAsDraft = false;
        this.router.navigate(
          [
            '/patient-dashboard/patient/' +
              this.patient.uuid +
              '/general/general/group-enrollment'
          ],
          { queryParams: { referral: true } }
        );
        break;
      case 'covidAssessment':
        this.showSuccessDialog = false;
        this.preserveFormAsDraft = false;
        if (this.covidAssessment) {
          const covidAssessmentFormUUID = `0a9fc16e-4c00-4842-a1e4-e4bafeb6e226`;
          const url = `/patient-dashboard/patient/${this.patient.uuid}/general/general/formentry/${covidAssessmentFormUUID}`;
          this.router.navigate([url], {
            queryParams: {
              encounter: this.covidAssessment.uuid,
              visitTypeUuid: ''
            }
          });
        } else {
          this.router.navigate([
            '/patient-dashboard/patient/' +
              this.patient.uuid +
              '/hiv/' +
              this.activeProgram +
              '/formentry/0a9fc16e-4c00-4842-a1e4-e4bafeb6e226'
          ]);
        }
        break;
      case 'familyHistory':
        this.showSuccessDialog = false;
        this.preserveFormAsDraft = false;
        if (this.familyTestingEncounterUuid) {
          const familyPartnerHistoryFormV1 = `3fbc8512-b37b-4bc2-a0f4-8d0ac7955127`;
          const url = `/patient-dashboard/patient/${this.patient.uuid}/general/general/formentry/${familyPartnerHistoryFormV1}`;
          this.router.navigate([url], {
            queryParams: {
              encounter: this.familyTestingEncounterUuid.uuid,
              visitTypeUuid: ''
            }
          });
        } else {
          this.router.navigate([
            '/patient-dashboard/patient/' +
              this.patient.uuid +
              '/hiv/' +
              this.activeProgram +
              '/formentry/3fbc8512-b37b-4bc2-a0f4-8d0ac7955127'
          ]);
        }
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
    this.retrospectiveDataEntryService.retroSettings.subscribe(
      (retroSettings) => {
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
        const encounterLocation = this.form.searchNodeByQuestionId(
          'location',
          'encounterLocation'
        );
        if (encounterLocation.length > 0 && location) {
          this.encounterLocation = {
            value: location.uuid,
            label: location.display
          };
          encounterLocation[0].control.setValue(location.uuid);
        }

        const encounterProvider = this.form.searchNodeByQuestionId(
          'provider',
          'encounterProvider'
        );
        if (
          encounterProvider.length > 0 &&
          this.compiledSchemaWithEncounter &&
          this.compiledSchemaWithEncounter.provider !== {}
        ) {
          let provider = this.compiledSchemaWithEncounter.provider.uuid;
          if (retroSettings && retroSettings.enabled) {
            provider = retroSettings.provider.value;
          }
          encounterProvider[0].control.setValue(provider);
        }
      }
    );
  }

  public onAbortingReferral(event) {
    // this.isValidReferral = true;
    this.referralStatus = null;
    this.referralCompleteStatus.next(false);
  }

  public shouldShowPatientReferralsDialog(data: any): void {
    this.submittedEncounter = data;
    // Check if referral location question was answered in the form (question id is `referralLocation`)
    const referralLocation = this.form.searchNodeByQuestionId(
      'referralLocation'
    );
    if (
      referralLocation.length > 0 &&
      _.first(referralLocation).control.value
    ) {
      const referralData = { submittedEncounter: data };
      // Check if the `Is this patient a referral` question was answered in the form (id `patientReferral`)
      const referralQuestion = this.form.searchNodeByQuestionId(
        'patientReferral'
      );
      if (referralQuestion.length > 0 && _.isNil(this.programEncounter)) {
        // CDM referral
        const referralsOrdered = this.form.searchNodeByQuestionId(
          'referralsOrdered'
        );
        if (referralsOrdered.length > 0) {
          const answer = _.first(referralsOrdered).control.value;
          this.searchReferralConcepts(answer)
            .pipe(take(1))
            .subscribe((concepts) => {
              const referralPrograms = _.filter(
                this.patient.enrolledPrograms,
                (program: any) => {
                  return _.includes(
                    _.map(concepts, 'uuid'),
                    program.concept.uuid
                  );
                }
              );
              if (referralPrograms.length > 0) {
                _.extend(referralData, {
                  isReferral: true,
                  patient: this.patient,
                  referralLocation: _.first(referralLocation).control.value,
                  selectedProgram: _.first(referralPrograms)
                });
                this.referralStatus = referralData;
                localStorage.setItem(
                  'referralProgram',
                  _.first(referralPrograms).programUuid
                );
                localStorage.setItem(
                  'referralLocation',
                  _.first(referralLocation).control.value
                );
                localStorage.setItem(
                  'referralVisitEncounter',
                  JSON.stringify(data)
                );
              }
            });
        }
      } else {
        _.extend(referralData, {
          isReferral: true,
          patient: this.patient,
          referralLocation: _.first(referralLocation).control.value
        });

        this.patientProgramResourceService
          .getAllProgramVisitConfigs()
          .subscribe((response) => {
            if (response) {
              const programVisitConfig = JSON.parse(JSON.stringify(response));

              const resolvedProgramUuid = _.findKey(
                programVisitConfig,
                (config) => {
                  return _.find(
                    config.visitTypes,
                    (visitType) => visitType.uuid === this.visitTypeUuid
                  );
                }
              );

              if (this.activeProgram === 'general') {
                referralData['selectedProgram'] = resolvedProgramUuid;
                localStorage.setItem('referralProgram', resolvedProgramUuid);
              } else if (this.activeProgram !== 'general') {
                referralData['selectedProgram'] = this.activeProgram;
                localStorage.setItem('referralProgram', this.activeProgram);
              }

              this.referralStatus = referralData;
              localStorage.setItem(
                'referralLocation',
                _.first(referralLocation).control.value
              );
              localStorage.setItem(
                'referralVisitEncounter',
                JSON.stringify(data)
              );
            }
          });
      }
    } else {
      // Not a referral
      this.referralCompleteStatus.next(false);
    }
  }

  // // }
  public updatePatientDemographics(data: any): void {
    // check if patient status was filled

    const patientCareStatus = this.patientTransferService.getPatientStatusQuestion();
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

    if (
      patientCareStatus.length > 0 &&
      causeOfDeath.length > 0 &&
      _.first(patientCareStatus).control.value !==
        'a89335d6-1350-11df-a1f1-0026b9'
    ) {
      this.personResourceService
        .saveUpdatePerson(this.patient.uuid, personNamePayload)
        .subscribe(() => {});
    }

    if (
      causeOfDeath.length > 0 &&
      _.first(causeOfDeath).control.value.length > 0 &&
      deathDate.length > 0 &&
      _.first(deathDate).control.value.length > 0
    ) {
      personNamePayload.dead = true;
      personNamePayload.deathDate = _.first(deathDate).control.value;
      personNamePayload.causeOfDeath = _.first(causeOfDeath).control.value;
      this.personResourceService
        .saveUpdatePerson(this.patient.uuid, personNamePayload)
        .subscribe(() => {});
    }
  }

  public handleProgramManagerRedirects(data: any): void {
    const step = ['step', 3];
    this.patientTransferService
      .handleProgramManagerRedirects(data, this.patient)
      .subscribe((transfer) => {
        this.preserveFormAsDraft = false;
        if (this.formUuid === 'cff39194-cb9c-41df-8e5d-3fc8763fa286') {
          this.router.navigate(
            _.concat(
              [
                '/patient-dashboard/patient/' +
                  this.patient.uuid +
                  '/general/general/program-manager/edit-program'
              ],
              step
            )
          );
        }
        if (
          transfer &&
          transfer.transfer === true &&
          this.formUuid !== 'cff39194-cb9c-41df-8e5d-3fc8763fa286'
        ) {
          this.preserveFormAsDraft = false;
          this.showSuccessDialog = false;
          if (transfer.loadTransferOutForm) {
            setTimeout(() => {
              this.confirmationService.confirm({
                header: 'Confirm Patient Transfer',
                rejectVisible: true,
                acceptVisible: true,
                message: `You have chosen to transfer the patient out.  Do you wish to complete the transfer?`,
                accept: () => {
                  this.router.navigate(
                    [
                      '/patient-dashboard/patient/' +
                        this.patient.uuid +
                        '/hiv/' +
                        this.activeProgram +
                        '/formentry/4f8b3fc4-7262-45f7-81b0-7bed31655fcd'
                    ],
                    { queryParams: transfer.params }
                  );
                },
                reject: () => {
                  this.showSuccessDialog = true;
                }
              });
            }, 1);
          } else if (transfer.loadProjectBeyondForm) {
            this.confirmationService.confirm({
              header: 'Confirm Patient Consent',
              rejectVisible: true,
              acceptVisible: true,
              message: `You have chosen to consent this patient for medication delivery. Do you wish to complete consent?`,
              accept: () => {
                this.router.navigate(
                  [
                    '/patient-dashboard/patient/' +
                      this.patient.uuid +
                      '/hiv/' +
                      this.activeProgram +
                      '/formentry/1a12eede-98ca-4691-86d3-bbfb564d45c2'
                  ],
                  { queryParams: transfer.params }
                );
              },
              reject: () => {
                this.showSuccessDialog = true;
              }
            });
          } else if (transfer.loadCommunityPharmacyForm) {
            setTimeout(() => {
              this.confirmationService.confirm({
                header: 'Confirm Community Pharmacy Refill Presciption',
                rejectVisible: true,
                acceptVisible: true,
                message: `You have chosen to fill community pharmacy presciption for this patient as mode of medication delivery. Do you wish to continue?`,
                accept: () => {
                  localStorage.removeItem('community_model_uuid');
                  this.router.navigate(
                    [
                      '/patient-dashboard/patient/' +
                        this.patient.uuid +
                        '/hiv/' +
                        this.activeProgram +
                        '/formentry/b88c3e58-2393-4216-bda3-f8e820648083'
                    ],
                    { queryParams: transfer.params }
                  );
                },
                reject: () => {
                  this.showSuccessDialog = true;
                }
              });
            }, 1);
          } else if (transfer.loadInternalMovementForm) {
            setTimeout(() => {
              this.confirmationService.confirm({
                header: 'Confirm Patient movement',
                rejectVisible: true,
                acceptVisible: true,
                message:
                  'You Have chosen to move this client to another clinic. Do you wish to complete the movement?',
                accept: () => {
                  this.router.navigate(
                    [
                      `/patient-dashboard/patient/${this.patient.uuid}/hiv/${this.activeProgram}/formentry/${this.internalMovementFormUuid}`
                    ],
                    { queryParams: transfer.params }
                  );
                },
                reject: () => {
                  this.showSuccessDialog = true;
                }
              });
            }, 1);
          } else {
            this.router.navigate(
              _.concat(
                [
                  '/patient-dashboard/patient/' +
                    this.patient.uuid +
                    '/general/general/program-manager/edit-program'
                ],
                step
              ),
              {
                queryParams: transfer.params
              }
            );
          }
        } else if (
          transfer &&
          transfer.transfer === false &&
          transfer.warnTransfer === true
        ) {
          this.warnMCHTransfer = true;
        } else {
          this.showSuccessDialog = true;
        }
      });
  }

  private navigateToProgramManager() {
    this.preserveFormAsDraft = false;
    this.route.queryParams.subscribe((params) => {
      const step = params['parentComponent'].split(':')[1];
      if (step === 'landing-page') {
        this.router.navigate([
          '/patient-dashboard/patient/' +
            this.patient.uuid +
            '/general/general/landing-page'
        ]);
      } else if (step === 'new') {
        this.router.navigate([
          '/patient-dashboard/patient/' +
            this.patient.uuid +
            '/general/general/program-manager/new-program',
          'step',
          params['step']
        ]);
      } else if (step === 'edit') {
        this.router.navigate([
          '/patient-dashboard/patient/' +
            this.patient.uuid +
            '/general/general/program-manager/edit-program',
          'step',
          params['step']
        ]);
      }
    });
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

    this.getPatient()
      .pipe(take(1))
      .subscribe((results) => {
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
    this.subscription = forkJoin(observableBatch)
      // .pipe(flatMap((data) => {
      //   // now init private and public properties
      //   this.compiledSchemaWithEncounter = data[0] || null;
      //   this.patient = data[1] || null;
      //   this.encounter = data[2] || null;
      //   // now render form
      //   return this.patientReminderService.getPatientReminders(this.patient.person.uuid);
      // }))
      .subscribe(
        (data: any) => {
          this.compiledSchemaWithEncounter = data[0] || null;
          this.patient = data[1] || null;
          this.encounter = data[2] || null;
          this.getPatientCovid19VaccineStatus(this.patient.uuid);
          // fetch patient consent after patient has been loaded
          this.patientConsentResourceService
            .getPatientCallConsent(this.patient.uuid)
            .subscribe(
              (results: any) => {
                this.hasCallConsent = results.hasCallConsent;
                this.renderForm();
                this.isBusyIndicator(false);
              },
              (error) => {
                this.renderForm();
                this.isBusyIndicator(false);
              }
            );
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
    const childControls = [
      'difOfCaregiver',
      'missADose',
      'receiveADose',
      'trueOfCaregiver',
      'adherenceAss'
    ];

    const onArtControl = form.searchNodeByQuestionId('onArt');
    const pcpProphylaxisCurrentControl = form.searchNodeByQuestionId(
      'pcpProphylaxisCurrent'
    );
    const onTbProphylaxisControl = form.searchNodeByQuestionId(
      'onTbProphylaxis'
    );

    childControls.forEach((cControl) => {
      const childControl = form.searchNodeByQuestionId(cControl);

      if (onArtControl && onArtControl[0] && childControl[0]) {
        this.updateRelatedControlFix(onArtControl[0], childControl[0]);
      }

      if (
        pcpProphylaxisCurrentControl &&
        pcpProphylaxisCurrentControl[0] &&
        childControl[1]
      ) {
        this.updateRelatedControlFix(
          pcpProphylaxisCurrentControl[0],
          childControl[1]
        );
      }

      if (
        onTbProphylaxisControl &&
        onTbProphylaxisControl[0] &&
        childControl[2]
      ) {
        this.updateRelatedControlFix(
          onTbProphylaxisControl[0],
          childControl[2]
        );
      }
    });

    const tbProphyAdherencenotes = form.searchNodeByQuestionId(
      'tbProphyAdherencenotes'
    );
    this.updateRelatedControlFix(
      onTbProphylaxisControl[0],
      tbProphyAdherencenotes[0]
    );
    const tbAdherencenotes = form.searchNodeByQuestionId('tbAdherencenotes');
    this.updateRelatedControlFix(
      onTbProphylaxisControl[0],
      tbAdherencenotes[0]
    );
  }

  private updateRelatedControlFix(parentControl, childControl) {
    if (childControl) {
      childControl.control.controlRelations.addRelatedControls(
        parentControl.control
      );
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
      const historicalEncounter: any = this.compiledSchemaWithEncounter
        .encounter;
      this.dataSources.registerDataSource(
        'patient',
        this.formDataSourceService.getPatientObject(this.patient),
        true
      );
      this.dataSources.registerDataSource(
        'monthlyScheduleResourceService',
        this.monthlyScheduleResourceService
      );
      this.dataSources.registerDataSource(
        'patient',
        { visitTypeUuid: this.visitTypeUuid },
        true
      );
      this.dataSources.registerDataSource(
        'patient',
        { hasCallConsent: this.hasCallConsent },
        true
      );
      this.dataSources.registerDataSource(
        'userLocation',
        this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject()
      );
      this.dataSources.registerDataSource('file', {
        fileUpload: this.fileUploadResourceService.upload.bind(
          this.fileUploadResourceService
        ),
        fetchFile: this.fileUploadResourceService.getFile.bind(
          this.fileUploadResourceService
        )
      });
      // set up visit encounters data source
      this.setUpVisitEncountersDataObject();

      // for the case of hiv, set-up the hiv summary
      this.setUpHivSummaryDataObject();

      if (this.encounter) {
        // editing existing form
        this.form = this.formFactory.createForm(
          schema,
          this.dataSources.dataSources
        );
        this.formRelationsFix(this.form);
        this.encounterAdapter.populateForm(this.form, this.encounter);
        this.personAttribuAdapter.populateForm(
          this.form,
          this.patient.person.attributes
        );
        this.form.valueProcessingInfo.encounterUuid = this.encounterUuid;
      } else {
        // creating new from
        this.dataSources.registerDataSource(
          'patient',
          { covid19VaccineStatus: this.covid19VaccineStatus },
          true
        );
        this.dataSources.registerDataSource(
          'rawPrevEnc',
          historicalEncounter,
          false
        );
        this.form = this.formFactory.createForm(
          schema,
          this.dataSources.dataSources
        );
        this.formRelationsFix(this.form);
        this.form.valueProcessingInfo.patientUuid = this.patient.uuid;
        // add visit uuid if present
        if (this.visitUuid && this.visitUuid !== '') {
          this.form.valueProcessingInfo.visitUuid = this.visitUuid;
        }
        // add visit type if present
        if (this.visitTypeUuid && this.visitTypeUuid !== '') {
          this.dataSources.registerDataSource(
            'patient',
            { visitTypeUuid: this.visitTypeUuid },
            true
          );
          this.form.valueProcessingInfo.visitTypeUuid = this.visitTypeUuid;
        }
        if (this.hasCallConsent) {
          this.dataSources.registerDataSource(
            'patient',
            { hasCallConsent: this.hasCallConsent },
            true
          );
          this.form.valueProcessingInfo.callConset = this.hasCallConsent;
        }
        if (this.covid19VaccineStatus !== '') {
          this.dataSources.registerDataSource(
            'patient',
            { covid19VaccineStatus: this.covid19VaccineStatus },
            true
          );
          this.form.valueProcessingInfo.covid19VaccineStatus = this.covid19VaccineStatus;
        }
        // now set default value
        this.loadDefaultValues();
      }
      // add valueProcessingInfo
      this.form.valueProcessingInfo.personUuid = this.patient.person.uuid;
      this.form.valueProcessingInfo.formUuid = schema.uuid;
      this.setUpWHOCascading();
      if (schema.encounterType) {
        this.form.valueProcessingInfo.encounterTypeUuid =
          schema.encounterType.uuid;
      } else {
        throw new Error('Please associate the form with an encounter type.');
      }
      // Find and set a provider uuid to be used when updating orders as orderer
      this.setProviderUuid();

      // prefill transferOut details in AMPATH POC Transfer Out Form (4f8b3fc4-7262-45f7-81b0-7bed31655fcd)
      if (this.formUuid === '4f8b3fc4-7262-45f7-81b0-7bed31655fcd') {
        this.patientTransferService.prefillTransferOptions();
      }
      //  Check if contacts exist
      this.familyTestingEncounterUuid = this.patient.encounters.find(
        (encounter) =>
          encounter.encounterType.uuid ===
          '975ae894-7660-4224-b777-468c2e710a2a'
      );
      if (this.familyTestingEncounterUuid) {
        this.updateContacts = true;
      }
      // Check if covid assessment has been done
      this.covidAssessment = this.patient.encounters.find(
        (encounter) =>
          encounter.encounterType.uuid ===
          '466d6707-8429-4e61-b5a0-d63444f5ad35'
      );
    } catch (ex) {
      // TODO Handle all form rendering errors
      console.error('An error occured while rendering form:', ex);
      this.formRenderingErrors.push(
        'An error occured while rendering form: ' + ex.message
      );
    }
  }

  private setUpHivSummaryDataObject() {
    if (
      Array.isArray(this.compiledSchemaWithEncounter.hivSummary) &&
      this.compiledSchemaWithEncounter.hivSummary.length > 0
    ) {
      this.dataSources.registerDataSource(
        'lastHivSummary',
        this.compiledSchemaWithEncounter.hivSummary[0]
      );
    } else {
      this.dataSources.registerDataSource('lastHivSummary', null);
    }
  }

  private setUpVisitEncountersDataObject() {
    const hd = new HistoricalEncounterDataService();
    if (
      this.compiledSchemaWithEncounter.visit &&
      this.compiledSchemaWithEncounter.visit.encounters &&
      Array.isArray(this.compiledSchemaWithEncounter.visit.encounters)
    ) {
      const visitEncounters: Array<any> = this.compiledSchemaWithEncounter.visit
        .encounters;
      visitEncounters.forEach((enc) => {
        hd.registerEncounters(enc.encounterType.uuid, enc);
      });
    }

    this.dataSources.registerDataSource('visitEnc', hd);
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
          const source = this.form.dataSourcesContainer.dataSources[
            'conceptAnswers'
          ];
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
        }
      );
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
        }
      );
    }).pipe(first());
  }

  private registerVLDatasource(reminders: any) {
    if (reminders) {
      const vlReminder = _.find(reminders['generatedReminders'], (o: any) => {
        return o.title === 'Viral Load Reminder';
      });
      if (vlReminder) {
        this.dataSources.registerDataSource(
          'vlFormAlert',
          { needsVl: true },
          true
        );
      } else {
        this.dataSources.registerDataSource(
          'vlFormAlert',
          { needsVl: false },
          true
        );
      }
    }
  }

  private getEncounters(): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (this.encounterUuid && this.encounterUuid !== '') {
        this.encounterResource.getEncounterByUuid(this.encounterUuid).subscribe(
          (encounter) => {
            // let wrappedEnconter: Encounter = new Encounter(encounter);
            observer.next(encounter);
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.next(null);
      }
    }).pipe(first());
  }

  private submitForm(
    payloadTypes: Array<string> = ['encounter', 'personAttribute']
  ): void {
    this.form.showErrors = !this.form.valid;
    this.isBusyIndicator(true, 'Please wait, saving form...');
    this.disableSubmitBtn();
    if (this.form.valid && this.validOnMCHTransfer()) {
      this.formSubmissionService.setSubmitStatus(true);
      // clear formSubmissionErrors
      this.formSubmissionErrors = null;
      // reset submitted orders
      this.submittedOrders.encounterUuid = null;
      this.submittedOrders.orders = [];
      this.warnMCHTransfer = false;
      // submit form
      this.retrospectiveDataEntryService.retroSettings.subscribe(
        (retroSettings) => {
          if (retroSettings && retroSettings.enabled) {
            if (this.formSubmissionService.getSubmitStatus() === true) {
              this.confirmRetrospectiveSubmission(payloadTypes);
            }
          } else {
            this.saveEncounterOrUpdateOnCheckDuplicate(payloadTypes);
          }
        }
      );
    } else {
      this.form.markInvalidControls(this.form.rootNode);
      this.enableSubmitBtn();
      this.isBusyIndicator(false, '');
    }
  }

  private saveEncounterOrUpdate(payloadTypes) {
    const optionalArgs = {
      covid19VaccineStatus: this.covid19VaccineStatus
    };
    this.isBusyIndicator(true, 'Please wait, saving form...');
    this.formSubmissionService
      .submitPayload(this.form, payloadTypes, optionalArgs)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.isBusyIndicator(false); // hide busy indicator
          this.handleSuccessfulFormSubmission(data);
          this.formSubmissionService.setSubmitStatus(false);
          this.enableSubmitBtn();
          if (this.formUuid === 'ca5ccb72-5623-4b94-97a3-6b5dac5f8560') {
            this.isOtzProgram = true;
            this.enrollPatientToOtzProgram();
          }
          if (this.formUuid === 'ecd6011b-3263-41c8-bc8e-a1dfa3b939f7') {
            const patientCategorizatonStatus = this.getPatientCategorizationQstn();
            const patientCommunityModelStatus = this.getPatientCommunityModelQstn();

            if (patientCategorizatonStatus) {
              this.isEligibleForDelivery = true;
            }

            if (patientCommunityModelStatus) {
              localStorage.setItem(
                'community_model_uuid',
                this.COMMUNITY_PHARMACY_CONCEPT
              );
            }
          }
        },
        (err) => {
          console.error('error', err);
          this.isBusyIndicator(false); // hide busy indicator
          this.handleFormSubmissionErrors(err);
          this.enableSubmitBtn();
          this.formSubmissionService.setSubmitStatus(false);
        }
      );
  }

  private getPatientCategorizationQstn(): boolean {
    const eligibleForDeliveryQuestion = this.form.searchNodeByQuestionId(
      'EligibleDelivery'
    );
    return this.hasExpectedAnswer(
      eligibleForDeliveryQuestion,
      this.YES_ELIGIBLE_FOR_DELIVERY_CONCEPT
    );
  }

  private getPatientCommunityModelQstn(): boolean {
    const eligibleDeliveryQuestion = this.form.searchNodeByQuestionId(
      'communityModel'
    );
    // return this.containsEligibleForDeliveryAnwer(eligibleDeliveryQuestion);
    return this.hasExpectedAnswer(
      eligibleDeliveryQuestion,
      this.COMMUNITY_PHARMACY_CONCEPT
    );
  }

  private hasExpectedAnswer(questions: any[], expectedValue: string): boolean {
    if (!questions || questions.length === 0) {
      return false;
    }

    const firstQuestion = _.first(questions);
    const value =
      firstQuestion && firstQuestion.control
        ? firstQuestion.control.value
        : null;

    return value === expectedValue;
  }

  private enrollPatientToOtzProgram() {
    const formattedDate = new Date(this.extractEncounterDate())
      .toISOString()
      .slice(0, 10);
    const payload = {
      programUuid: '203571d6-a4f2-4953-9e8b-e1105e2340f5',
      patient: this.patient,
      dateEnrolled: formattedDate,
      dateCompleted: '',
      location: this.encounterLocation.value,
      enrollmentUuid: ''
    };

    this.programManagerService.enrollPatient(payload).subscribe(
      (enrollment) => {
        console.log('response', enrollment);
        this.isBusyIndicator(false);
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  private checkDuplicate(payloadTypes) {
    this.patientService.currentlyLoadedPatientUuid
      .pipe(
        flatMap((patientUuid: string) => {
          return this.encounterResource.getEncountersByPatientUuid(patientUuid);
        }),
        flatMap((encounters) => {
          this.previousEncounters = encounters;
          if (
            this.formentryHelperService.encounterTypeFilled(
              encounters,
              this.form.schema.encounterType.uuid,
              this.extractEncounterDate()
            ) &&
            !this.submitDuplicate
          ) {
            return of(true);
          } else {
            return of(false);
          }
        })
      )
      .pipe(take(1))
      .subscribe(
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
        }
      );
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
      document
        .getElementById('formentry-submit-btn')
        .setAttribute('disabled', 'true');
    }
  }

  private enableSubmitBtn() {
    const submitBtn = document.getElementById('formentry-submit-btn');
    if (typeof submitBtn === 'undefined' || submitBtn === null) {
    } else {
      document
        .getElementById('formentry-submit-btn')
        .removeAttribute('disabled');
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
    const duplicateEncounter = this.formentryHelperService.getLastDuplicateEncounter(
      this.previousEncounters,
      this.form.schema.encounterType.uuid,
      encounterDate
    );
    const duplicateMoment = Object.assign({}, moment);
    const encounterDateMoment = moment(new Date(encounterDate));
    this.confirmationService.confirm({
      header: 'Form Duplication warning',
      key: 'duplicateWarning',
      message:
        `A similar form was completed on  ` +
        `${format(duplicateEncounter.encounterDatetime, 'DD/MM/YYYY')} ` +
        ` at ${format(duplicateEncounter.encounterDatetime, 'HH:mm')} ` +
        `by  ${duplicateEncounter.encounterProviders[0].provider.display}
      Are you sure you want to submit this encounter ` +
        ` for the current specified date ${format(
          new Date(encounterDate),
          'DD/MM/YYYY'
        )} at ` +
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
    // handle referrals here
    this.handleFormReferrals(response);
  }

  private handleFormReferrals(data: any) {
    this.shouldShowPatientReferralsDialog(data);
    const dcExit = this.form.searchNodeByQuestionId('dcCarePlan');
    const referredToLocation = this.form.searchNodeByQuestionId(
      'location',
      'encounterLocation'
    );
    if (
      dcExit.length > 0 &&
      _.first(dcExit).control.value === 'a8af50f4-1350-11df-a1f1-0026b9348838'
    ) {
      this.isReferral = true;
      localStorage.setItem(
        'referralProgram',
        '781d85b0-1359-11df-a1f1-0026b9348838'
      );
      localStorage.setItem(
        'referralLocation',
        _.first(referredToLocation).control.value
      );
      localStorage.setItem(
        'refLocation',
        this.propertyLocationService.getCurrentUserDefaultLocationObject()
          .display
      );
      localStorage.setItem('refProgram', 'Standard HIV Treatment');
    }
    if (this.isReferral) {
      const referralProgram = localStorage.getItem('referralProgram');
      this.refProgram = referralProgram;
      this.refLocation = this.encounterLocation;
      const referralInfo = {
        programUuid: referralProgram,
        submittedEncounter: this.submittedEncounter,
        referredToLocation: referredToLocation
      };
      this.referralsHandler
        .handleProgramReferral(this.patient, referralInfo)
        .subscribe(
          (result) => {
            this.refProgram = localStorage.getItem('refProgram');
            this.refLocation = localStorage.getItem('refLocation');
            this.referralSuccess = true;
            this.referralCompleteStatus.next(true);
          },
          (error) => {
            this.referralSuccess = false;
            if (
              error.error &&
              error.error.message &&
              error.error.message.match(/Duplicate record exists/)
            ) {
              console.error(
                "It looks like you've already referred this patient to the specified location"
              );
            } else {
              console.error('An error occured handling the referral: ', error);
            }
          }
        );
    }
    this.referralCompleteStatus.pipe(take(1)).subscribe((success) => {
      const referralsData = this.referralsHandler.extractRequiredValues(
        this.form
      );
      this.diffCareReferralStatus = undefined;

      if (referralsData.hasDifferentiatedCareReferal) {
        this.showProcessReferralsDialog = true;
      } else if (referralsData.isInterMovementForm) {
        this.showInternalMovementReferralsDialog = true;
        this.internalRefProgram = this.referralsHandler.getReferralProgram(
          referralsData
        );
      } else {
        // this.showSuccessDialog = true;
        // display success dialog
        this.handleProgramManagerRedirects(data);
      }
      // this.showSuccessDialog = true;
    });
  }

  public onValidityCheck(validity: boolean): void {
    this.referralValidity = validity;
  }

  public handleReferralToDC() {
    this.showProcessReferralsDialog = false;
    if (this.enrollToDC) {
      this.isBusyIndicator(
        true,
        'Enrolling Patient to Differentiated Service Delivery program...'
      );
      this.referralsHandler
        .handleFormReferrals(this.patient, this.form)
        .pipe(take(1))
        .subscribe(
          (results) => {
            this.isBusyIndicator(false, '');
            // this.showSuccessDialog = true;
            this.diffCareReferralStatus = results.differentiatedCare;
            interval(10000).pipe(map((x) => (this.counter = x)));
            setTimeout(() => {
              if (this.enrollToGroup) {
                this.navigateTo('groupEnrollment');
              }
            }, 10000);
            if (this.isEligibleForDelivery) {
              this.preserveFormAsDraft = false;
              this.confirmationService.confirm({
                header: 'Confirm Patient Consent',
                rejectVisible: true,
                acceptVisible: true,
                message: `You have chosen to consent this patient for medication delivery. Do you wish to complete consent?`,
                accept: () => {
                  this.router.navigate(
                    [
                      '/patient-dashboard/patient/' +
                        this.patient.uuid +
                        '/hiv/' +
                        this.activeProgram +
                        '/formentry/1a12eede-98ca-4691-86d3-bbfb564d45c2'
                    ]
                    // { queryParams: "" }
                  );
                },
                reject: () => {
                  this.showSuccessDialog = true;
                }
              });
            } else {
              this.showSuccessDialog = true;
            }
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

  public handleHivRefferal(
    program: RefProgram,
    enrollToHivRefferalProgram: boolean
  ): void {
    if (this.enrollToHivRefferalProgram) {
      this.referToHivProgram = 1;
    } else {
      this.referToHivProgram = 2;
    }
  }

  public onHivReferralStatusChange($statusChange: ReferralStatus): void {
    if ($statusChange.status.length > 0) {
      this.hivReferralStatus = $statusChange;
    }
  }

  private completeHivRefferal(): void {
    this.showInternalMovementReferralsDialog = false;
    this.showSuccessDialog = true;
  }

  public cancelHivReferral(): void {
    this.showInternalMovementReferralsDialog = false;
  }

  public toggleEnrollToDC() {
    this.enrollToDC = !this.enrollToDC;
    if (!this.enrollToDC) {
      this.enrollToGroup = false;
    }
  }

  public toggleEnrollHivRefferalProgram(toggle: boolean): void {
    this.enrollToHivRefferalProgram = toggle;
  }

  public toggleReferral() {
    this.isReferral = !this.isReferral;
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
        this.encounterResource
          .getEncounterByUuid(this.submittedOrders.encounterUuid)
          .pipe(take(1))
          .subscribe((encounter) => {
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

  private isBusyIndicator(
    isBusy: boolean,
    message: string = 'Please wait...'
  ): void {
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
        this.retrospectiveDataEntryService.retroSettings.subscribe(
          (retroSettings) => {
            let provider = data.providerUuid;
            if (retroSettings && retroSettings.enabled) {
              provider = retroSettings.provider.value;
            }
            this.form.valueProcessingInfo.providerUuid = provider;
            const encounterProvider = this.form.searchNodeByQuestionId(
              'provider',
              'encounterProvider'
            );
            if (encounterProvider.length > 0) {
              encounterProvider[0].control.setValue(provider);
            }
          }
        );
      },
      (error) => {
        console.warn('Provider not found. Are you a provider?');
      }
    );
  }

  private getProviderUuid() {
    const encounterProvider = this.form.searchNodeByQuestionId(
      'provider',
      'encounterProvider'
    );
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
      message:
        'This form is going to be submitted retrospectively. ' +
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

  private validOnMCHTransfer(): boolean {
    const patientObj: any = this.formDataSourceService.getPatientObject(
      this.patient
    );
    const careStatus = this.patientTransferService.getPatientStatusQuestion();
    let validTransfer = true;
    if (careStatus.length > 0) {
      validTransfer =
        _.isEmpty(_.first(careStatus).control.value) ||
        (!_.isEmpty(_.first(careStatus).control.value) &&
          !_.includes(
            [
              '1f09e809-8ea3-45e6-a71f-16e6a0d72390',
              'a8a17d80-1350-11df-a1f1-0026b9348838'
            ],
            _.first(careStatus).control.value
          )) ||
        (_.includes(
          [
            '1f09e809-8ea3-45e6-a71f-16e6a0d72390',
            'a8a17d80-1350-11df-a1f1-0026b9348838'
          ],
          _.first(careStatus).control.value
        ) &&
          patientObj.sex === 'F');
    }
    if (!validTransfer) {
      this.warnMCHTransfer = true;
    }
    return validTransfer;
  }

  private getPatientCovid19VaccineStatus(patientUuid: string): void {
    this.covid19Service
      .getCovid19VaccinationStatus(patientUuid)
      .subscribe((result: Covid19StatusSummary) => {
        if (result) {
          this.covid19VaccineStatus = result.vaccination_status_code;
        }
      });
  }
}
