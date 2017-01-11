import { TestBed, inject } from '@angular/core/testing';
import {
  BaseRequestOptions, Http, HttpModule
} from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { FormsResourceService } from '../../openmrs-api/forms-resource.service';
import { FormSchemaService } from './form-schema.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { FormSchemaCompiler } from 'ng2-openmrs-formentry';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../../app-settings/app-settings.service';

describe('Service: FormSchemaService', () => {

  // mock data for formMetaData
  let formMetaData: any = {
    uuid: 'adult-return-formMetaData-uuid',
    display: 'Adult Return Visit Form v0.01',
    resources: [
      {
        dataType: 'AmpathJsonSchema',
        name: 'json schema',
        uuid: '57991389-dbd4-4d15-8802-4b1ac560fb57',
        valueReference: 'adult-return-formClobData-uuid',
      }
    ]
  };

  // mock data for formClobData
  let formClobData: any = {
    uuid: 'adult-return-formClobData-uuid',
    name: 'Adult Return Visit Form v0.01',
    referencedForms: [
      {
        formName: 'component_vitals',
        alias: 'vt',
        ref: {
          uuid: 'component_vitals_formMetaData-uuid',
          display: 'vitals component',
        }
      },
      {
        formName: 'component_social-history',
        alias: 'sh',
        ref: {
          uuid: 'component_social-history_formMetaData-uuid',
          display: 'social history component',
        }
      }
    ]
  };

  // mock data for compiledSchema
  let compiledSchema: any = {
    uuid: 'form-uuid',
    formMetaData: formMetaData,
    formClobData: formClobData
  };

  // configure test bed
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        FormSchemaService,
        LocalStorageService,
        FormSchemaCompiler,
        FormsResourceService,
        BaseRequestOptions,
        MockBackend,
        AppSettingsService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService
      ],
      imports: [
        HttpModule
      ]

    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of FormSchemaService', () => {
    let service: FormSchemaService = TestBed.get(FormSchemaService);
    expect(service).toBeTruthy();
  });

  it('should have all required methods defined and exposed as a public member ' +
    'for the first time', () => {
    let service: FormSchemaService = TestBed.get(FormSchemaService);
    expect(service.getFormSchemaByUuid).toBeTruthy();
  });

  it('should hit the server to fetch Form Metadata when getFormSchemaByUuid is called for the ' +
    'the first time(**Not cached)', inject([FormsResourceService, FormSchemaService],
    (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService) => {
      let uuid: string = 'form-uuid';
      spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
        let subject = new BehaviorSubject<any>({});
        subject.next(formMetaData);
        return subject;
      });
      formSchemaService.getFormSchemaByUuid(uuid);
      expect(formsResourceService.getFormMetaDataByUuid).toHaveBeenCalled();

    }));

  it('should hit the server to fetch Form Clobdata when getFormSchemaByUuid is called for the ' +
    'the first time(**Not cached)', inject([FormsResourceService, FormSchemaService],
    (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService) => {
      let uuid: string = 'form-uuid';
      spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
        let subject = new BehaviorSubject<any>({});
        subject.next(formMetaData);
        return subject;
      });
      spyOn(formsResourceService, 'getFormClobDataByUuid').and.callThrough();
      formSchemaService.getFormSchemaByUuid(uuid);
      expect(formsResourceService.getFormClobDataByUuid).toHaveBeenCalled();

    }));

  it('should hit the server several times in order to fetch all referenced form components ' +
    'when getFormSchemaByUuid is called for the first time(**Not cached)',
    inject([FormsResourceService, FormSchemaService],
      (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService) => {
        let uuid: string = 'form-uuid';
        let numberOfMetaDataCalls: number = 0;
        let numberOfClobDataCalls: number = 0;
        spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
          let subject = new BehaviorSubject<any>({});
          switch (params) {
            case'form-uuid':
              subject.next(formMetaData);
              break;
            case'component_vitals_formMetaData-uuid':
              numberOfMetaDataCalls++;
              subject.next({
                uuid: 'component_vitals_formMetaData-uuid',
                display: 'Vitals Component',
                resources: [
                  {
                    dataType: 'AmpathJsonSchema',
                    name: 'json schema',
                    uuid: 'json-uuid',
                    valueReference: 'component_vitals_formClobData-uuid',
                  }
                ]
              });
              break;
            case'component_social-history_formMetaData-uuid':
              numberOfMetaDataCalls++;
              subject.next({
                uuid: 'component_social-history_formMetaData-uuid',
                display: 'Social History Component',
                resources: [
                  {
                    dataType: 'AmpathJsonSchema',
                    name: 'json schema',
                    uuid: 'json-uuid',
                    valueReference: 'component_social-history_formClobData-uuid',
                  }
                ]
              });
              break;
            default:
              subject.error('Unknown form-meta-data-uuid/component-uuid: ' + params);

          }
          return subject;
        });

        spyOn(formsResourceService, 'getFormClobDataByUuid').and.callFake(function (params) {
          let subject = new BehaviorSubject<any>({});
          switch (params) {
            case'adult-return-formClobData-uuid':
              subject.next(formClobData);
              break;
            case'component_vitals_formClobData-uuid':
              numberOfClobDataCalls++;
              subject.next({
                uuid: 'component_vitals_formClobData-uuid',
                name: 'Vitals Component',
                processor: 'EncounterFormProcessor',
                pages: []
              });
              break;
            case'component_social-history_formClobData-uuid':
              numberOfClobDataCalls++;
              subject.next({
                uuid: 'component_social-history_formClobData-uuid',
                name: 'Social History Component',
                processor: 'EncounterFormProcessor',
                pages: []
              });
              break;
            default:
              subject.error('Unknown form-clob-data-uuid/component-uuid: ' + params);

          }
          return subject;
        });
        formSchemaService.getFormSchemaByUuid(uuid);
        // determine if  getFormClobDataByUuid and getFormMetaDataByUuid was hit
        expect(formsResourceService.getFormClobDataByUuid).toHaveBeenCalled();
        expect(formsResourceService.getFormMetaDataByUuid).toHaveBeenCalled();
        // check number of calls.
        // Number of calls should be same as formClobData.length + 1 for main form
        // getFormClobDataByUuid
        expect(formsResourceService.getFormClobDataByUuid)
          .toHaveBeenCalledTimes(formClobData.referencedForms.length + 1);
        // getFormMetaDataByUuid
        expect(formsResourceService.getFormMetaDataByUuid)
          .toHaveBeenCalledTimes(formClobData.referencedForms.length + 2);
        // Finally check the counts for the components/referenced forms
        expect(numberOfClobDataCalls).toBe(formClobData.referencedForms.length);
        expect(numberOfMetaDataCalls).toBe(formClobData.referencedForms.length);

      }));


  it('should not hit the server to fetch Form Clobdata and Form metadata when compiled ' +
    'schema is already cached (**Cached)',
    inject([FormsResourceService, FormSchemaService,
        LocalStorageService],
      (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService,
       localStorageService: LocalStorageService) => {
        let uuid: string = 'form-uuid';
        spyOn(localStorageService, 'getObject').and.callFake(function (params) {
          return compiledSchema; // return cached & compiled schema
        });
        spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
          let subject = new BehaviorSubject<any>({});
          subject.next(formMetaData);
          return subject;
        });
        spyOn(formsResourceService, 'getFormClobDataByUuid').and.callThrough();
        // make the call
        formSchemaService.getFormSchemaByUuid(uuid);
        // specifications
        expect(formsResourceService.getFormClobDataByUuid).not.toHaveBeenCalled();
        expect(formsResourceService.getFormMetaDataByUuid).not.toHaveBeenCalled();
        expect(localStorageService.getObject).toHaveBeenCalled();

      }));


});
