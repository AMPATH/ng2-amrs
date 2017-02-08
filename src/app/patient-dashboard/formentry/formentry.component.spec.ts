import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
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
import { FakeUserFactory } from '../formentry/mock/user-factory.service.mock';
import { DraftedFormsService } from './drafted-forms.service';
import {
    FakeDefaultUserPropertiesFactory
} from '../formentry/mock/default-user-properties-factory.service.mock';

import {
    FormFactory, EncounterAdapter, OrderValueAdapter, Form,
    ObsValueAdapter, PersonAttribuAdapter, FormSchemaCompiler
} from 'ng2-openmrs-formentry';
import { FakeFormSchemaCompiler } from '../formentry/mock/form-schema-compiler.service.mock';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { FormCreationDataResolverService } from './form-creation-data-resolver.service';
import { PatientPreviousEncounterService } from '../patient-previous-encounter.service';
import { PatientService } from '../patient.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
    ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import { UserService } from '../../openmrs-api/user.service';
import { UserDefaultPropertiesService } from
    '../../user-default-properties/user-default-properties.service';
import { SessionStorageService } from '../../utils/session-storage.service';
import { FormSubmissionService } from './form-submission.service';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';
import { Patient } from '../../models/patient.model';
import { FormDataSourceService } from './form-data-source.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ConceptResourceService } from '../../openmrs-api/concept-resource.service';
import { DataSources } from 'ng2-openmrs-formentry/src/app/form-entry/data-sources/data-sources';
import { ErrorLogResourceService } from '../../etl-api/error-log-resource.service';
import { ConfirmationService } from 'primeng/primeng';

describe('Component: FormentryComponent', () => {
    let router = {
        navigate: jasmine.createSpy('navigate')
    };

    let schema: any = {
        uuid: 'form-uuid',
        display: 'form',
        encounterType: {
            uuid: 'type-uuid',
            display: 'sample',
        }
    };

    let previousEncounter: any = {
        encounterType: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
        form: '81f92a8a-ff5c-415d-a34c-b5bdca2406be',
        obs: [],
        order: [],
        patient: '5ead308a-1359-11df-a1f1-0026b9348838',
        provider: '34',
        visit: '85a7746e-4d8d-4722-b3eb-ce79195266de',
    };

    let renderableForm = {
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
        searchNodeByQuestionId: function (param) {
            return [];
        }

    } as Form;

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
                PersonResourceService,
                EncounterAdapter,
                OrderValueAdapter,
                PatientService,
                PatientResourceService,
                FormCreationDataResolverService,
                PatientPreviousEncounterService,
                ProgramEnrollmentResourceService,
                ObsValueAdapter,
                PersonAttribuAdapter,
                FormDataSourceService,
                ProviderResourceService,
                LocationResourceService,
                ConceptResourceService,
                DataSources,
                DraftedFormsService,
                FormSubmissionService,
                ErrorLogResourceService,
                ConfirmationService,
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
                        queryParams: Observable.of({ encounter: 'encounter-uuid' }),
                        params: Observable.of({ formUuid: 'form-uuid' }),
                        data: Observable.of({
                            compiledSchemaWithEncounter: {
                                encounter: {},
                                schema: schema
                            }
                        }),
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
        inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory, encounterAdapter: EncounterAdapter) => {

                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                spyOn(formFactory, 'createForm').and.callFake(function (form) {
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
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                spyOn(formFactory, 'createForm').and.callFake(function (form, historicalEncounter) {
                    expect(form).toBeDefined();
                    expect(historicalEncounter).toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({ encounter: '' });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
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
                expect(formFactory.createForm).not
                    .toHaveBeenCalledWith(schema);

            })
    );

    it('should NOT populate form with historical values/ encounters when ' +
        'editting an existing form. Case: editting exsting form',
        inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
            ActivatedRoute, DataSources],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory, encounterAdapter: EncounterAdapter,
                activatedRoute: ActivatedRoute, dataSources: DataSources) => {
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                spyOn(formFactory, 'createForm').and.callFake(function (form, dataSource) {
                    expect(form).toBeDefined();
                    expect(dataSource.rawPrevEnc).not.toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({ encounter: 'encounte-uuid' });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
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
                    .toHaveBeenCalled();

            })
    );

    it('should tie encounter/form to a visit if visit-uuid exists: Case: creating new form',
        inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
            ActivatedRoute],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory, encounterAdapter: EncounterAdapter,
                activatedRoute: ActivatedRoute) => {
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                spyOn(formFactory, 'createForm').and.callFake(function (form, historicalEncounter) {
                    expect(form).toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({
                    encounter: '',
                    visitUuid: 'visit-uuid'
                });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
                    compiledSchemaWithEncounter: {
                        encounter: previousEncounter,
                        schema: schema
                    }
                });
                formentryComponent.ngOnInit();
                // check if it calls createForm
                expect(formFactory.createForm).toHaveBeenCalled();
                // check if form has visit uuid
                expect(formentryComponent.form.valueProcessingInfo.visitUuid).toBe('visit-uuid');


            })
    );

    it('should NOT tie encounter/form to a visit even if the visit-uuid is defined' +
        ' when editting form: Case Editting existing form',
        inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
            ActivatedRoute],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory, encounterAdapter: EncounterAdapter,
                activatedRoute: ActivatedRoute) => {
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                spyOn(formFactory, 'createForm').and.callFake(function (form, historicalEncounter) {
                    expect(form).toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({
                    visitUuid: 'visit-uuid',
                    encounter: 'encounetr-uuid'
                });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
                    compiledSchemaWithEncounter: {
                        encounter: previousEncounter,
                        schema: schema
                    }
                });
                formentryComponent.ngOnInit();
                // check if it calls createForm
                expect(formFactory.createForm).toHaveBeenCalled();
                // form should not have visit uuid
                expect(formentryComponent.form.valueProcessingInfo.visitUuid).toBeNull;


            })
    );

    it('should populate form with default values. Case: creting new form',
        inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
            ActivatedRoute, UserService, UserDefaultPropertiesService],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory, encounterAdapter: EncounterAdapter,
                activatedRoute: ActivatedRoute, userService: UserService,
                userDefaultPropertiesService: UserDefaultPropertiesService) => {
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                // spy userDefaultPropertiesService
                spyOn(userDefaultPropertiesService, 'getCurrentUserDefaultLocationObject')
                    .and.callFake(function (param) {
                        return {
                            uuid: 'location-uuid',
                            display: 'location'
                        };
                    });

                // spy userService
                spyOn(userService, 'getLoggedInUser')
                    .and.callFake(function (param) {
                        return {
                            personUuid: 'person-uuid',
                            display: 'person name'
                        };
                    });


                spyOn(formFactory, 'createForm').and.callFake(function (form, historicalEncounter) {
                    expect(form).toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({
                    encounter: '' // --> this means we are creating new form
                });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
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
                expect(userService.getLoggedInUser).toHaveBeenCalled();


            })
    );

    it('should NOT populate form with default values when editting form',
        inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
            ActivatedRoute, UserService, UserDefaultPropertiesService],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory, encounterAdapter: EncounterAdapter,
                activatedRoute: ActivatedRoute, userService: UserService,
                userDefaultPropertiesService: UserDefaultPropertiesService) => {
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                // spy userDefaultPropertiesService
                spyOn(userDefaultPropertiesService, 'getCurrentUserDefaultLocationObject')
                    .and.callFake(function (param) {
                        return {
                            uuid: 'location-uuid',
                            display: 'location'
                        };
                    });

                // spy userService
                spyOn(userService, 'getLoggedInUser')
                    .and.callFake(function (param) {
                        return {
                            personUuid: 'person-uuid',
                            display: 'person name'
                        };
                    });


                spyOn(formFactory, 'createForm').and.callFake(function (form, historicalEncounter) {
                    expect(form).toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({
                    encounter: 'encounter-uuid' // --> this means we are editting existing form
                });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
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
                    .not.toHaveBeenCalled();
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
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                spyOn(formFactory, 'createForm').and.callFake(function (form, historicalEncounter) {
                    expect(form).toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({
                    encounter: 'encounetr-uuid',
                    visitUuid: 'visit-uuid'
                });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
                    compiledSchemaWithEncounter: {
                        encounter: previousEncounter,
                        schema: schema
                    }
                });
                formentryComponent.ngOnInit();
                // check if it calls createForm
                expect(formFactory.createForm).toHaveBeenCalled();
                // check valueProcessingInfo
                expect(formentryComponent.form.valueProcessingInfo.encounterUuid).not.toBeNull;
                expect(formentryComponent.form.valueProcessingInfo.personUuid).not.toBeNull;
                expect(formentryComponent.form.valueProcessingInfo.formUuid).not.toBeNull;
                expect(formentryComponent.form.valueProcessingInfo.encounterTypeUuid).not.toBeNull;


            })
    );
    it('should populate form with encounter, obs, orders when editting form',
        inject([FormSchemaService, FormentryComponent, FormFactory, EncounterAdapter,
            ActivatedRoute, DataSources],
            (formSchemaService: FormSchemaService, formentryComponent: FormentryComponent,
                formFactory: FormFactory, encounterAdapter: EncounterAdapter,
                activatedRoute: ActivatedRoute, dataSources: DataSources) => {
                spyOn(encounterAdapter, 'populateForm').and.callFake(function (form) {
                    return form;
                });

                spyOn(formFactory, 'createForm').and.callFake(function (form, dataSource) {
                    expect(form).toBeDefined();
                    expect(dataSource.rawPrevEnc).not.toBeDefined();
                    return renderableForm;
                });
                // providing required dependancies like historical encounter
                activatedRoute.queryParams = Observable.of({ encounter: 'encounter-uuid' });
                activatedRoute.params = Observable.of({ formUuid: 'form-uuid' });
                activatedRoute.data = Observable.of({
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
                expect(formFactory.createForm)
                    .toHaveBeenCalled();
                // check if form was populated with selected encounter
                expect(encounterAdapter.populateForm).toHaveBeenCalled();

            })
    );
});


class EncounterResourceServiceMock {
    constructor() {
    }

    public getEncounterByUuid(formSchema: Object): any {
        let subject = Observable.of({
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
