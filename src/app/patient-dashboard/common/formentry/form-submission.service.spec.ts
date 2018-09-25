
import {throwError as observableThrowError, of,  Observable, Subject } from 'rxjs';
import { TestBed, async, fakeAsync, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { Http, BaseRequestOptions, Response, ResponseOptions, HttpModule } from '@angular/http';
import { FormSubmissionService } from './form-submission.service';
import {
  EncounterAdapter, PersonAttribuAdapter, OrderValueAdapter, ObsValueAdapter, ObsAdapterHelper, Form
} from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { AppSettingsService } from '../../../app-settings';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { FormentryHelperService } from './formentry-helper.service';
import { FormDataSourceService } from './form-data-source.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { ErrorLogResourceService } from '../../../etl-api/error-log-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../../../shared/services/data-cache.service';

describe('Service: FormSubmissionService', () => {

  // sample field error
  let sampleFieldError: any = {
    error: {
      message: 'Invalid Submission',
      code: 'webservices.rest.error.invalid.submission',
      globalErrors: [],
      fieldErrors: {
        encounterDatetime: [
          {
            code: 'Encounter.datetimeShouldBeInVisitDatesRange',
            message: 'The encounter datetime should be between the visit start and stop dates.'
          }
        ]
      }
    }
  };

  // sample payload
  let sampleEncounterPayload: any = {
    encounterType: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
    form: '81f92a8a-ff5c-415d-a34c-b5bdca2406be',
    obs: [],
    order: [],
    patient: '5ead308a-1359-11df-a1f1-0026b9348838',
    provider: '34',
    visit: '85a7746e-4d8d-4722-b3eb-ce79195266de',
  };

  // sample schema
  let schema: any = {
    uuid: 'form-uuid',
    display: 'form',
    encounterType: {
      uuid: 'type-uuid',
      display: 'sample',
    }
  };

  // previous encs
  let renderableForm = {
    valid: true,
    schema: schema,
    valueProcessingInfo: {
      patientUuid: 'patientUuid',
      personUuid: 'personUuid',
      visitUuid: 'visitUuid',
      encounterTypeUuid: 'encounterTypeUuid',
      formUuid: 'formUuid',
      encounterUuid: 'encounterUuid',
      providerUuid: 'providerUuid',
      utcOffset: '+0300'
    },
    searchNodeByQuestionId: (param) => {
      return [];
    }

  } as Form;

  // sample submission error
  let sampleSubmissionError: any = {
    code: 'org.openmrs.module.webservices.rest.web.resource.impl.BaseDelegatingResource:748',
    // tslint:disable-next-line:max-line-length
    detail: 'org.openmrs.module.webservices.rest.web.response.ConversionException: unknown provider ↵',
    message: 'Unable to convert object into response content',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        BaseRequestOptions,
        MockBackend,
        FormSubmissionService,
        EncounterAdapter,
        PersonAttribuAdapter,
        EncounterResourceService,
        PersonResourceService,
        OrderValueAdapter,
        ObsValueAdapter,
        ObsAdapterHelper,
        LocalStorageService,
        FormentryHelperService,
        AppSettingsService,
        ProviderResourceService,
        ConceptResourceService,
        LocationResourceService,
        FormDataSourceService,
        ErrorLogResourceService,
        DataCacheService,
        CacheService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
      ],
      imports: [
        HttpModule, CacheModule
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of FormSubmissionService', () => {
    let service: FormSubmissionService = TestBed.get(FormSubmissionService);
    expect(service).toBeTruthy();
  });

  it('should submit payload when supplied with a valid form object:: New Form',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // spy encounterResourceService
        spyOn(encounterResourceService, 'saveEncounter').and.callFake(
          (payload) => {
            return of(payload);
          });

        // spy personResourceService
        spyOn(personResourceService, 'saveUpdatePerson').and.callFake(
          (payload) => {
            return of(payload);
          });

        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return sampleEncounterPayload;
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return [
              {
                attributeType: 'attribute-type-uuid',
                value: 'Test Race'
              }
            ];
          });

        formSchemaService.submitPayload(renderableForm as Form);
        expect(encounterResourceService.saveEncounter).toHaveBeenCalled();
        expect(personResourceService.saveUpdatePerson).toHaveBeenCalled();
      })
  );

  it('should submit payload when supplied with a valid form object:: Editting Form',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // spy encounterResourceService
        spyOn(encounterResourceService, 'saveEncounter').and.callFake(
          (payload) => {
            return of(payload);
          });

        // spy personResourceService
        spyOn(personResourceService, 'saveUpdatePerson').and.callFake(
          (payload) => {
            return of(payload);
          });

        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return sampleEncounterPayload;
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return [
              {
                attributeType: 'attribute-type-uuid',
                value: 'Test Race'
              }
            ];
          });
        renderableForm.valueProcessingInfo.encounterUuid = 'sample-uuid';
        formSchemaService.submitPayload(renderableForm as Form);
        expect(encounterResourceService.saveEncounter).toHaveBeenCalled();
        expect(personResourceService.saveUpdatePerson).toHaveBeenCalled();
      })
  );

  it('should not submit personAttribute payload if generated payload is null or empty',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // spy encounterResourceService
        spyOn(personResourceService, 'saveUpdatePerson').and.callFake(
          (payload) => {
            return of(payload);
          });
        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return {}; // setting it to empty
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return []; // setting it to empty
          });
        // renderable form has no obs, no orders, no encounter and no person attribute
        formSchemaService.submitPayload(renderableForm as Form);
        expect(personResourceService.saveUpdatePerson).not.toHaveBeenCalled();
      })
  );

  it('should not submit encounter payload if generated payload is null or empty' +
    ' :: Case when creating new form',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // case when creating new encounter
        spyOn(encounterResourceService, 'saveEncounter').and.callFake(
          (payload) => {
            return of(payload);
          });

        // case when creating new encounter
        spyOn(encounterResourceService, 'updateEncounter').and.callFake(
          (payload) => {
            return of(payload);
          });
        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return {};
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return [];
          });
        // renderable form has no obs, no orders, no encounter
        formSchemaService.submitPayload(renderableForm as Form);
        expect(encounterResourceService.saveEncounter).not.toHaveBeenCalled();
        expect(encounterResourceService.updateEncounter).not.toHaveBeenCalled();
      })
  );

  it('should not submit encounter payload if generated payload is null or empty' +
    ' :: Case when editting existing form',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // case when creating new encounter
        spyOn(encounterResourceService, 'saveEncounter').and.callFake(
          (payload) => {
            return of(payload);
          });

        // case when creating new encounter
        spyOn(encounterResourceService, 'updateEncounter').and.callFake(
          (payload) => {
            return of(payload);
          });
        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return {};
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return [];
          });
        // renderable form has no obs, no orders, no encounter
        renderableForm.valueProcessingInfo.encounterUuid = 'sample-uuid';
        formSchemaService.submitPayload(renderableForm as Form);
        expect(encounterResourceService.saveEncounter).not.toHaveBeenCalled();
        expect(encounterResourceService.updateEncounter).not.toHaveBeenCalled();
      })
  );


  it('should throw error when encounter payload fails to save',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // spy encounterResourceService
        spyOn(encounterResourceService, 'saveEncounter').and.callFake(
          (payload) => {
            // throw an error
            return observableThrowError(sampleSubmissionError);
          });

        // spy personResourceService
        spyOn(personResourceService, 'saveUpdatePerson').and.callFake(
          (payload) => {
            return of(payload);
          });

        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return sampleEncounterPayload;
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return [
              {
                attributeType: 'attribute-type-uuid',
                value: 'Test Race'
              }
            ];
          });

        // spy on
        let formSubmissionSuccesIndicator: boolean = false;
        let submissionError: any = null;
        formSchemaService.submitPayload(renderableForm as Form).take(1).subscribe(
          (responses: Array<any>) => {
            formSubmissionSuccesIndicator = true;
            submissionError = null;
            expect(formSubmissionSuccesIndicator).toBeFalsy;
          },
          (err) => {
            console.error('An error occurred, ---->', err);
            submissionError = err;
            formSubmissionSuccesIndicator = false;
          });
        expect(encounterResourceService.saveEncounter).toHaveBeenCalled();
        expect(personResourceService.saveUpdatePerson).toHaveBeenCalled();
        // we expect it to throw error
        expect(formSubmissionSuccesIndicator).toBeFalsy;
        expect(submissionError).not.toBeNull;
      })
  );

  it('should throw error when personAttribute payload fails to save',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // spy encounterResourceService
        spyOn(encounterResourceService, 'saveEncounter').and.callFake(
          (payload) => {
            return of(payload);
          });

        // spy personResourceService
        spyOn(personResourceService, 'saveUpdatePerson').and.callFake(
          (payload) => {
            // Throw an error
            return observableThrowError(sampleSubmissionError);
          });

        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return sampleEncounterPayload;
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return [
              {
                attributeType: 'attribute-type-uuid',
                value: 'Test Race'
              }
            ];
          });

        // spy on
        let formSubmissionSuccesIndicator: boolean = false;
        let submissionError: any = null;
        formSchemaService.submitPayload(renderableForm as Form).take(1).subscribe(
          (responses: Array<any>) => {
            formSubmissionSuccesIndicator = true;
            submissionError = null;
            expect(formSubmissionSuccesIndicator).toBeFalsy;
          },
          err => {
            console.error('An error occurred, ---->', err);
            submissionError = err;
            formSubmissionSuccesIndicator = false;
          });
        expect(encounterResourceService.saveEncounter).toHaveBeenCalled();
        expect(personResourceService.saveUpdatePerson).toHaveBeenCalled();
        // we expect it to throw error
        expect(formSubmissionSuccesIndicator).toBeFalsy;
        expect(submissionError).not.toBeNull;
      })
  );

  it('should throw error when all payloads fail to save',
    inject([FormSubmissionService, EncounterResourceService, PersonAttribuAdapter,
        EncounterAdapter, PersonResourceService],
      (formSchemaService: FormSubmissionService,
       encounterResourceService: EncounterResourceService,
       personAttribuAdapter: PersonAttribuAdapter,
       encounterAdapter: EncounterAdapter,
       personResourceService: PersonResourceService) => {

        // spy encounterResourceService
        spyOn(encounterResourceService, 'saveEncounter').and.callFake(
          (payload) => {
            // Throw an error
            return observableThrowError(sampleSubmissionError);
          });

        // spy personResourceService
        spyOn(personResourceService, 'saveUpdatePerson').and.callFake(
          (payload) => {
            // Throw an error
            return observableThrowError(sampleSubmissionError);
          });

        // encounter adaptor
        spyOn(encounterAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return sampleEncounterPayload;
          });

        // person attributes adaptor
        spyOn(personAttribuAdapter, 'generateFormPayload').and.callFake(
          (payload) => {
            return [
              {
                attributeType: 'attribute-type-uuid',
                value: 'Test Race'
              }
            ];
          });

        // spy on
        let formSubmissionSuccesIndicator: boolean = false;
        let submissionError: any = null;
        formSchemaService.submitPayload(renderableForm as Form).take(1).subscribe(
          (responses: Array<any>) => {
            formSubmissionSuccesIndicator = true;
            submissionError = null;
            expect(formSubmissionSuccesIndicator).toBeFalsy;
          },
          (err) => {
            console.error('An error occurred, ---->', err);
            submissionError = err;
            formSubmissionSuccesIndicator = false;
          });
        expect(encounterResourceService.saveEncounter).toHaveBeenCalled();
        expect(personResourceService.saveUpdatePerson).toHaveBeenCalled();
        // we expect it to throw error
        expect(formSubmissionSuccesIndicator).toBeFalsy;
        expect(submissionError).not.toBeNull;
      })
  );

});

