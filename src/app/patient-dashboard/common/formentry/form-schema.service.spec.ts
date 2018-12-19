import { TestBed, inject } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { FormSchemaService } from './form-schema.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { FormSchemaCompiler } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: FormSchemaService', () => {

  // mock data for formMetaData
  const formMetaData: any = {
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
  const formClobData: any = {
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
  const compiledSchema: any = {
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
        AppSettingsService,
        AppSettingsService
      ],
      imports: [
        HttpClientTestingModule
      ]

    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of FormSchemaService', () => {
    const service: FormSchemaService = TestBed.get(FormSchemaService);
    expect(service).toBeTruthy();
  });

  it('should have all required methods defined and exposed as a public member ' +
    'for the first time', () => {
    const service: FormSchemaService = TestBed.get(FormSchemaService);
    expect(service.getFormSchemaByUuid).toBeTruthy();
  });

  it('should hit the server to fetch Form Metadata when getFormSchemaByUuid is called for the ' +
    'the first time(**Not cached)', inject([FormsResourceService, FormSchemaService],
    (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService) => {
      const uuid = 'form-uuid';
      spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
        const subject = new BehaviorSubject<any>({});
        subject.next(formMetaData);
        return subject;
      });
      formSchemaService.getFormSchemaByUuid(uuid);
    }));

  it('should hit the server to fetch Form Clobdata when getFormSchemaByUuid is called for the ' +
    'the first time(**Not cached)', inject([FormsResourceService, FormSchemaService],
    (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService) => {
      const uuid = 'form-uuid';
      spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
        const subject = new BehaviorSubject<any>({});
        subject.next(formMetaData);
        return subject;
      });
      spyOn(formsResourceService, 'getFormClobDataByUuid').and.callThrough();
      formSchemaService.getFormSchemaByUuid(uuid);

    }));

  it('should hit the server several times in order to fetch all referenced form components ' +
    'when getFormSchemaByUuid is called for the first time(**Not cached)',
    inject([FormsResourceService, FormSchemaService],
      (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService) => {
        const uuid = 'form-uuid';
        let numberOfMetaDataCalls = 0;
        let numberOfClobDataCalls = 0;
        spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
          const subject = new BehaviorSubject<any>({});
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
          const subject = new BehaviorSubject<any>({});
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
        /*expect(formsResourceService.getFormClobDataByUuid)
          .toHaveBeenCalledTimes(formClobData.referencedForms.length + 1);
        expect(formsResourceService.getFormMetaDataByUuid)
          .toHaveBeenCalledTimes(formClobData.referencedForms.length + 2);
        expect(numberOfClobDataCalls).toBe(formClobData.referencedForms.length);
        expect(numberOfMetaDataCalls).toBe(formClobData.referencedForms.length);*/

      }));


  it('should not hit the server to fetch Form Clobdata and Form metadata when compiled ' +
    'schema is already cached (**Cached)',
    inject([FormsResourceService, FormSchemaService,
        LocalStorageService],
      (formsResourceService: FormsResourceService, formSchemaService: FormSchemaService,
       localStorageService: LocalStorageService) => {
        const uuid = 'form-uuid';
        spyOn(localStorageService, 'getObject').and.callFake(function (params) {
          return compiledSchema; // return cached & compiled schema
        });
        spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
          const subject = new BehaviorSubject<any>({});
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
