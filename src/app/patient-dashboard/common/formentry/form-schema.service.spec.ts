import { TestBed, inject } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { FormSchemaService } from './form-schema.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { FormSchemaCompiler } from 'ngx-openmrs-formentry';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: FormSchemaService', () => {
  let formSchemaService: FormSchemaService;
  let formsResourceService: FormsResourceService;
  let localStorageService: LocalStorageService;

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
    formSchemaService = TestBed.get(FormSchemaService);
    formsResourceService = TestBed.get(FormsResourceService);
    localStorageService = TestBed.get(LocalStorageService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of FormSchemaService', () => {
    expect(formSchemaService).toBeTruthy();
  });

  it('should have all required methods defined and exposed as a public member ' +
    'for the first time', () => {
      expect(formSchemaService.getFormSchemaByUuid).toBeTruthy();
    });

  it('should hit the server to fetch Form Metadata when getFormSchemaByUuid is called for the ' +
    'the first time(**Not cached)', () => {
      const uuid = 'form-uuid';

      spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callThrough();
      formSchemaService.getFormSchemaByUuid(uuid);
      expect(formsResourceService.getFormMetaDataByUuid).toHaveBeenCalled();
    });

  it('should hit the server to fetch Form Clobdata when getFormSchemaByUuid is called for the ' +
    'the first time(**Not cached)',
    () => {
      const uuid = 'form-uuid';
      spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callFake(function (params) {
        const subject = new BehaviorSubject<any>({});
        subject.next(formMetaData);
        return subject;
      });
      spyOn(formsResourceService, 'getFormClobDataByUuid').and.callThrough();
      formSchemaService.getFormSchemaByUuid(uuid);

    });

  it('should hit the server several times in order to fetch all referenced form components ' +
    'when getFormSchemaByUuid is called for the first time(**Not cached)',
    () => {
      const uuid = 'form-uuid';
      spyOn(formsResourceService, 'getFormMetaDataByUuid').and.callThrough();

      spyOn(formsResourceService, 'getFormClobDataByUuid').and.callThrough();
      formSchemaService.getFormSchemaByUuid(uuid);

      formsResourceService.getFormMetaDataByUuid(uuid);
      formsResourceService.getFormClobDataByUuid(uuid);

      expect(formsResourceService.getFormClobDataByUuid)
        .toHaveBeenCalled();
      expect(formsResourceService.getFormMetaDataByUuid)
        .toHaveBeenCalled();
    });


  it('should not hit the server to fetch Form Clobdata and Form metadata when compiled ' +
    'schema is already cached (**Cached)',
    () => {
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

    });

});
