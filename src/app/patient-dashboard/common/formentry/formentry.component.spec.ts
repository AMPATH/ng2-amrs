import { TestBed, inject, async } from '@angular/core/testing';
import {
  ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot,
  Router
} from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SpyLocation } from '@angular/common/testing';
import { FormentryComponent } from './formentry.component';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { FormSchemaService } from './form-schema.service';
import { FormentryHelperService } from './formentry-helper.service';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { FakeFormFactory } from './mock/form-factory.service.mock';
import { FakeUserFactory } from './mock/user-factory.service.mock';
import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { PatientReminderService } from '../patient-reminders/patient-reminders.service';
import { DraftedFormsService } from './drafted-forms.service';
import {
  FakeDefaultUserPropertiesFactory
} from './mock/default-user-properties-factory.service.mock';

import {
  FormFactory, EncounterAdapter, OrderValueAdapter, Form,
  ObsValueAdapter, PersonAttribuAdapter, FormSchemaCompiler, ObsAdapterHelper
} from 'ngx-openmrs-formentry';
import { FakeFormSchemaCompiler } from './mock/form-schema-compiler.service.mock';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FormCreationDataResolverService } from './form-creation-data-resolver.service';
import { PatientPreviousEncounterService } from '../../services/patient-previous-encounter.service';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { UserService } from '../../../openmrs-api/user.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { SessionStorageService } from '../../../utils/session-storage.service';
import { FormSubmissionService } from './form-submission.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { Patient } from '../../../models/patient.model';
import { FormDataSourceService } from './form-data-source.service';
import { DataSources } from 'ngx-openmrs-formentry';
import { CacheModule, CacheService } from 'ionic-cache';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { ErrorLogResourceService } from '../../../etl-api/error-log-resource.service';
import { ConfirmationService } from 'primeng/primeng';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';
import {
  MonthlyScheduleResourceService
} from '../../../etl-api/monthly-scheduled-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';
import { PatientReferralsModule } from '../patient-referrals/patient-referrals.module';
import { ProgramsTransferCareService } from '../../programs/transfer-care/transfer-care.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
// import { ReferralModule } from '../../../referral-module/referral-module';
import { PatientReferralService } from '../../../program-manager/patient-referral-service';
import {
  RetrospectiveDataEntryModule
} from '../../../retrospective-data-entry/retrospective-data-entry.module';
import {
  FakeRetrospectiveDataEntryService
} from '../../../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import {
  RetrospectiveDataEntryService
} from '../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { ZscoreService } from 'src/app/shared/services/zscore.service';


export class FakeConceptResourceService {
  constructor() {
  }

  public getConceptByUuid(uuid: string, cached: boolean = false, v: string = null):
    Observable<any> {

    return of({});
  }

}

class EncounterResourceServiceMock {
  constructor() {
  }

  public getEncounterByUuid(formSchema: object): any {
    const subject = of({
      uuid: 'encounter-uuid',
      display: 'encounter'
    });
    return subject;

  }
}

class PatientServiceMock {
  public currentlyLoadedPatient: BehaviorSubject<Patient>
    = new BehaviorSubject(
      new Patient({
        uuid: 'patient-uuid',
        display: 'patient name',
        person: {
          uuid: 'person-uuid',
          display: 'person name'
        }
      })
    );

  constructor() {
  }

}

export class FakePatientReferralService {

  constructor() { }

  public saveProcessPayload(payload: any) {

  }

  public getProcessPayload() {
    return of({});
  }

}

export class FakePersonResourceService {
  public saveUpdatePerson(uuid, payload): Observable<any> {
    return Observable.of({});
  }
}

class FakeCacheStorageService {
  constructor(a, b) {
  }
  public ready() {
    return true;
  }
}

xdescribe('Component: FormentryComponent', () => {
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  const schema: any = {
    uuid: 'form-uuid',
    display: 'form',
    encounterType: {
      uuid: 'type-uuid',
      display: 'sample',
    },
    pages: [
      {
        label: 'Plan',
        sections: [
          {
            label: 'Referrals',
            questions: [
              {
                id: 'referrals',
                questionOptions: {
                  rendering: 'multiCheckbox',
                  answers: [
                    {
                      concept: 'a899e0ac-1350-11df-a1f1-0026b9348838',
                      label: 'None'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  };

  const previousEncounter: any = {
    encounterType: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
    form: '81f92a8a-ff5c-415d-a34c-b5bdca2406be',
    obs: [],
    order: [],
    patient: '5ead308a-1359-11df-a1f1-0026b9348838',
    provider: '34',
    visit: '85a7746e-4d8d-4722-b3eb-ce79195266de',
  };

  const renderableForm = {
    valid: true,
    schema: schema,
    valueProcessingInfo: {
      patientUuid: 'patientUuid',
      visitUuid: 'visitUuid',
      encounterTypeUuid: 'encounterTypeUuid',
      formUuid: 'formUuid',
      encounterUuid: 'encounterUuid',
      providerUuid: 'providerUuid',
      utcOffset: '+0300'
    },
    searchNodeByQuestionId: (param) => {
      return [{
        control: {
          value: ['1']
        }
      }];
    }

  } as Form;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CacheModule,
        PatientReferralsModule,
        HttpClientTestingModule
      ],
      providers: [
        PatientReminderResourceService,
        PatientProgramResourceService,
        FormentryComponent,
        FormSchemaService,
        FormentryHelperService,
        FormsResourceService,
        AppSettingsService,
        LocalStorageService,
        PersonResourceService,
        EncounterAdapter,
        OrderValueAdapter,
        ObsAdapterHelper,
        PatientService,
        PatientProgramService,
        ProgramService,
        RoutesProviderService,
        ProgramResourceService,
        PatientResourceService,
        FormCreationDataResolverService,
        PatientPreviousEncounterService,
        ProgramEnrollmentResourceService,
        MonthlyScheduleResourceService,
        ObsValueAdapter,
        PersonAttribuAdapter,
        FormDataSourceService,
        ProviderResourceService,
        LocationResourceService,
        DataSources,
        DraftedFormsService,
        FormSubmissionService,
        ErrorLogResourceService,
        ConfirmationService,
        DataCacheService,
        FileUploadResourceService,
        CacheService,
        FormentryReferralsHandlerService,
        VisitResourceService,
        HivSummaryResourceService,
        ZscoreService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
        {
          provide: EncounterResourceService, useFactory: () => {
            return new EncounterResourceServiceMock();
          }, deps: []
        },
        {
          provide: PatientService, useFactory: () => {
            return new PatientServiceMock();
          }, deps: []
        },
        { provide: Router, useValue: router },
        {
          provide: FormSchemaCompiler, useFactory: () => {
            return new FakeFormSchemaCompiler();
          }, deps: []
        },
        {
          provide: FormFactory, useFactory: () => {
            return new FakeFormFactory();
          }, deps: []
        },
        { provide: Location, useClass: SpyLocation },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ encounter: 'encounter-uuid' }),
            params: of({ formUuid: 'form-uuid' }),
            data: of({
              compiledSchemaWithEncounter: {
                encounter: {},
                schema: schema
              }
            }),
            snapshot: { params: { formUuid: 'form-uuid' } }
          }
        },
        PatientReminderService,
        {
          provide: UserService, useFactory: () => {
            return new FakeUserFactory();
          }, deps: []
        },
        {
          provide: UserDefaultPropertiesService, useFactory: () => {
            return new FakeDefaultUserPropertiesFactory();
          }, deps: []
        },
        {
          provide: ConceptResourceService, useFactory: () => {
            return new FakeConceptResourceService();
          }, deps: []
        },
        {
          provide: PersonResourceService, useFactory: () => {
            return new FakePersonResourceService();
          }, deps: []
        },
        {
          provide: PatientReferralService, useFactory: () => {
            return new FakePatientReferralService();
          }, deps: []
        },
        {
          provide: RetrospectiveDataEntryService, useFactory: () => {
            return new FakeRetrospectiveDataEntryService();
          }
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of FormentryComponent', () => {
    const formentryComponent: FormentryComponent = TestBed.get(FormentryComponent);
    expect(formentryComponent).toBeTruthy();
  });

  it('should fetch and compile formschema when the component initializes with a valid form-uuid',
    inject([FormSchemaService, FormCreationDataResolverService,
      PatientPreviousEncounterService],
      (formSchemaService: FormSchemaService, resolver: FormCreationDataResolverService,
        prevEncService: PatientPreviousEncounterService) => {

        const uuid = 'form-uuid';
        spyOn(resolver, 'resolve').and.callFake((params) => {

          return new Promise((resolve, reject) => {

          });
        });
        spyOn(formSchemaService, 'getFormSchemaByUuid').and.callFake((params) => {
          const subject = new BehaviorSubject<any>({});
          subject.next({
            uuid: uuid,
            display: 'form'
          });
          return subject;
        });
        const mockSnapshot: any = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot',
          ['toString']);
        resolver.resolve(new ActivatedRouteSnapshot(), mockSnapshot);
        expect(resolver.resolve).toHaveBeenCalled();
        // check if it compiles
        formSchemaService.getFormSchemaByUuid(uuid);
        expect(formSchemaService.getFormSchemaByUuid).toHaveBeenCalled();

      })
  );

  it('should generate renderable form from compiled schema when the component ' +
    'initializes with a valid form-uuid',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter) => {

        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        spyOn(formFactory, 'createForm').and.callFake((form) => {
          return renderableForm;
        });
        formentryComponent.ngOnInit();
        // check if it creates  and reder form
        expect(formFactory.createForm).toHaveBeenCalled();

      })
  );

  it('should populate form with historical values/ encounters when creating new form',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute, DataSources],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute, dataSources: DataSources) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        spyOn(formFactory, 'createForm').and.callFake((form, historicalEncounter) => {
          expect(form).toBeDefined();
          expect(historicalEncounter).toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({ encounter: '' });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // check if createForm was called with schema and  historicalEncounter parameters
        // calling  formFactory.createForm(a) -means creating form without hitorical enc
        // calling  formFactory.createForm(a,b) --means creating form with encounters
        expect(formFactory.createForm)
          .toHaveBeenCalledWith(schema, dataSources.dataSources);
        expect(formFactory.createForm).not.toHaveBeenCalledWith(schema);

      })
  );

  it('should NOT populate form with historical values/ encounters when ' +
    'editting an existing form. Case: editting exsting form',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute, DataSources],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute, dataSources: DataSources) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        spyOn(formFactory, 'createForm').and.callFake((form, dataSource) => {
          expect(form).toBeDefined();
          expect(dataSource.rawPrevEnc).not.toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({ encounter: 'encounte-uuid' });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // check if createForm was called with schema and  historicalEncounter parameters
        // calling  formFactory.createForm(a) -means creating form without hitorical enc
        // calling  formFactory.createForm(a,b) --means creating form with encounters
        // expect(formFactory.createForm).toHaveBeenCalled();

      })
  );

  it('should tie encounter/form to a visit if visit-uuid exists: Case: creating new form',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        spyOn(formFactory, 'createForm').and.callFake((form, historicalEncounter) => {
          expect(form).toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({
          encounter: '',
          visitUuid: 'visit-uuid'
        });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // check if form has visit uuid
        expect(formentryComponent.form.valueProcessingInfo.visitUuid).toBe('visitUuid');

      })
  );

  it('should NOT tie encounter/form to a visit even if the visit-uuid is defined' +
    ' when editting form: Case Editting existing form',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        spyOn(formFactory, 'createForm').and.callFake((form, historicalEncounter) => {
          expect(form).toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({
          visitUuid: 'visit-uuid',
          encounter: 'encounetr-uuid'
        });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // form should not have visit uuid
        expect(formentryComponent.form.valueProcessingInfo.visitUuid).toBeNull();


      })
  );

  it('should populate form with default values. Case: creating new form',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute, UserService, UserDefaultPropertiesService],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute, userService: UserService,
        userDefaultPropertiesService: UserDefaultPropertiesService) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        // spy userDefaultPropertiesService
        spyOn(userDefaultPropertiesService, 'getCurrentUserDefaultLocationObject')
          .and.callFake((param) => {
            return {
              uuid: 'location-uuid',
              display: 'location'
            };
          });

        // spy userService
        spyOn(userService, 'getLoggedInUser')
          .and.callFake((param) => {
            return {
              personUuid: 'person-uuid',
              display: 'person name'
            };
          });


        spyOn(formFactory, 'createForm').and.callFake((form, historicalEncounter) => {
          expect(form).toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({
          encounter: '' // --> this means we are creating new form
        });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // now check to ensure we are setting default data
        expect(userDefaultPropertiesService.getCurrentUserDefaultLocationObject)
          .toHaveBeenCalled();
        // expect(userService.getLoggedInUser).toHaveBeenCalled();


      })
  );

  it('should NOT populate form with default values when editting form',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute, UserService, MonthlyScheduleResourceService,
      UserDefaultPropertiesService],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute, userService: UserService,
        monthlyScheduleResourceService: MonthlyScheduleResourceService,
        userDefaultPropertiesService: UserDefaultPropertiesService) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        // spy userDefaultPropertiesService
        spyOn(userDefaultPropertiesService, 'getCurrentUserDefaultLocationObject')
          .and.callFake((param) => {
            return {
              uuid: 'location-uuid',
              display: 'location'
            };
          });

        // spy userService
        spyOn(userService, 'getLoggedInUser')
          .and.callFake((param) => {
            return {
              personUuid: 'person-uuid',
              display: 'person name'
            };
          });


        spyOn(formFactory, 'createForm').and.callFake((form, historicalEncounter) => {
          expect(form).toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({
          encounter: 'encounter-uuid' // --> this means we are editting existing form
        });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        spyOn(formentryComponent, 'loadDefaultValues').and.callFake(() => {
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // now check to ensure we are not setting default data
        activatedRoute.params.subscribe(() => {
          expect(formentryComponent.loadDefaultValues).not.toHaveBeenCalled();
        });

        expect(userService.getLoggedInUser).not.toHaveBeenCalled();
      })
  );

  it('should populate form object with necessary valueProcessingInfo required' +
    ' for payload generation',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        spyOn(formFactory, 'createForm').and.callFake((form, historicalEncounter) => {
          expect(form).toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({
          encounter: 'encounetr-uuid',
          visitUuid: 'visit-uuid'
        });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // check valueProcessingInfo
        expect(formentryComponent.form.valueProcessingInfo.encounterUuid).not.toBeNull();
        expect(formentryComponent.form.valueProcessingInfo.personUuid).not.toBeNull();
        expect(formentryComponent.form.valueProcessingInfo.formUuid).not.toBeNull();
        expect(formentryComponent.form.valueProcessingInfo.encounterTypeUuid).not.toBeNull();


      })
  );
  it('should populate form with encounter, obs, orders when editting form',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute, DataSources],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute, dataSources: DataSources) => {
        spyOn(encounterAdapter, 'populateForm').and.callFake((form) => {
          return form;
        });

        spyOn(formFactory, 'createForm').and.callFake((form, dataSource) => {
          expect(form).toBeDefined();
          expect(dataSource.rawPrevEnc).not.toBeDefined();
          return renderableForm;
        });
        // providing required dependancies like historical encounter
        activatedRoute.queryParams = of({ encounter: 'encounter-uuid' });
        activatedRoute.params = of({ formUuid: 'form-uuid' });
        activatedRoute.data = of({
          compiledSchemaWithEncounter: {
            encounter: previousEncounter,
            schema: schema
          }
        });
        formentryComponent.ngOnInit();
        // check if it calls createForm
        expect(formFactory.createForm).toHaveBeenCalled();
        // check if createForm was called with schema parameter only
        // calling  formFactory.createForm(a) -means creating form without hitorical enc
        // calling  formFactory.createForm(a,b) --means creating form with encounters
        expect(formFactory.createForm).toHaveBeenCalled();
        // check if form was populated with selected encounter
        // expect(encounterAdapter.populateForm).toHaveBeenCalled();
        // expect(encounterAdapter.populateForm).toHaveBeenCalled();

      })
  );
  it('should show patient referrals dialog when `Referrals` question is answered',
    inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
      ActivatedRoute, DataSources],
      (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
        formFactory: FormFactory, encounterAdapter: EncounterAdapter,
        activatedRoute: ActivatedRoute, dataSources: DataSources) => {

        spyOn(formFactory, 'createForm').and.callFake((form) => {
          return renderableForm;
        });
        formentryComponent.ngOnInit();
        formentryComponent.shouldShowPatientReferralsDialog({});
        // check if it calls createForm
        expect(formentryComponent.showReferralDialog).toBeFalsy();
      })
  );
});

