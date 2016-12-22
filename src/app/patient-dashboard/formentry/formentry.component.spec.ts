import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { SpyLocation } from '@angular/common/testing';
import { FormentryComponent } from './formentry.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { FormSchemaService } from '../formentry/form-schema.service';
import { FormentryHelperService } from './formentry-helper.service';
import { FormsResourceService } from '../../openmrs-api/forms-resource.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { FakeFormFactory } from '../formentry/mock/form-factory.service.mock';
import {
    FormFactory, EncounterAdapter, OrderValueAdapter,
    ObsValueAdapter, PersonAttribuAdapter
} from 'ng2-openmrs-formentry';
import { FakeFormSchemaCompiler } from '../formentry/mock/form-schema-compiler.service.mock';
import { FormSchemaCompiler }
    from 'ng2-openmrs-formentry/src/app/form-entry/services/form-schema-compiler.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { FormCreationDataResolverService } from './form-creation-data-resolver.service';
import { PatientPreviousEncounterService } from '../patient-previous-encounter.service';
import { PatientService } from '../patient.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';

describe('Component: FormentryComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockBackend,
                BaseRequestOptions,
                FormentryComponent,
                FormSchemaService,
                FormentryHelperService,
                FormsResourceService,
                AppSettingsService,
                LocalStorageService,
                EncounterResourceService,
                EncounterAdapter,
                OrderValueAdapter,
                PatientService,
                PatientResourceService,
                FormCreationDataResolverService,
                PatientPreviousEncounterService,
                ProgramEnrollmentResourceService,
                ObsValueAdapter,
                PersonAttribuAdapter,
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
                        queryParams: Observable.of({}),
                        params: Observable.of({ formUuid: 'form-uuid' }),
                        data: Observable.of({ compiledSchemaWithEncounter: {
                          encounter: {},
                          schema: {}
                        }}),
                        snapshot: { params: { formUuid: 'form-uuid' } }
                    }
                },
                {
                    provide: Http,
                    useFactory: (
                        backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backendInstance, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
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
        let formentryComponent: FormentryComponent = TestBed.get(FormentryComponent);
        expect(formentryComponent).toBeTruthy();
    });

    it('should fetch and compile formschema when the component initializes with a valid form-uuid',
        inject([FormSchemaService, FormCreationDataResolverService,
            PatientPreviousEncounterService],
            (formSchemaService: FormSchemaService, resolver: FormCreationDataResolverService,
             prevEncService: PatientPreviousEncounterService) => {

                let uuid: string = 'form-uuid';
                spyOn(resolver, 'resolve').and.callFake(function (params) {

                  return new Promise();
                });
                spyOn(formSchemaService, 'getFormSchemaByUuid').and.callFake(function (params) {
                    let subject = new BehaviorSubject<any>({});
                    subject.next({
                        uuid: uuid,
                        display: 'form'
                    });
                    return subject;
                });
                resolver.resolve(ActivatedRouteSnapshot);
                expect(resolver.resolve).toHaveBeenCalled();
                // check if it compiles
                formSchemaService.getFormSchemaByUuid(uuid);
                expect(formSchemaService.getFormSchemaByUuid).toHaveBeenCalled();

            })
    );

    it('should generate renderable form from compiled schema when the component ' +
        'initializes with a valid form-uuid',
        inject([FormSchemaService, FormentryComponent, FormFactory],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory) => {

                let uuid: string = 'form-uuid';
                spyOn(formSchemaService, 'getFormSchemaByUuid').and.callFake(function (params) {
                    let subject = new BehaviorSubject<any>({});
                    subject.next({
                        uuid: uuid,
                        display: 'form'
                    });
                    return subject;
                });
                spyOn(formFactory, 'createForm').and.callThrough();
                formentryComponent.ngOnInit();
                // check if it creates  and reder form
                expect(formFactory.createForm).toHaveBeenCalled();

            })
    );
});


