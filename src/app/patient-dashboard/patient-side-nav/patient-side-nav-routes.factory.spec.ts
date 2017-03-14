/*
 * Testing a Service
 * More info: https://angular.io/docs/ts/latest/guide/testing.html
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { PatientRoutesFactory } from './patient-side-nav-routes.factory';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';

import { RouteModel } from '../../shared/dynamic-route/route.model';
import { Patient } from '../../models/patient.model';

describe('Patient Routes Factory:', () => {
    let fakeRoutesProvider: RoutesProviderService = {
        analyticsDashboardConfig: {},
        clinicDashboardConfig: {},
        patientDashboardConfig: {
            'id': 'patientDashboard',
            'name': 'Patient Dashboard',
            'baseRoute': 'patient-dashboard',
            'programs': [
                {
                    'programName': 'General Info',
                    'programUuid': 'general-uuid',
                    'baseRoute': 'general',
                    'requiresPatientEnrollment': false,
                    'routes': [
                        {
                            'url': 'patient-info',
                            'label': 'Patient Info',
                            'icon': 'fa fa-clipboard'
                        },
                        {
                            'url': 'visit',
                            'label': 'Visit',
                            'icon': 'icon-i-outpatient'
                        }
                    ]
                },
                {
                    'programName': 'HIV',
                    'programUuid': '781d85b0-1359-11df-a1f1-0026b9348838',
                    'baseRoute': 'hiv',
                    'requiresPatientEnrollment': true,
                    'routes': [
                        {
                            'url': 'hiv-summary',
                            'label': 'HIV Summary',
                            'icon': 'fa fa-medkit'
                        },
                        {
                            'url': 'hiv-clinical-summary',
                            'label': 'HIV Clinical Summary',
                            'icon': 'fa fa-file-pdf-o'
                        }
                    ]
                },
                {
                    'programName': 'Oncology',
                    'programUuid': 'onc-uuid',
                    'baseRoute': 'oncology',
                    'requiresPatientEnrollment': true,
                    'routes': [
                        {
                            'url': 'oncology-summary',
                            'label': 'Oncology Summary',
                            'icon': 'icon-i-oncology'
                        }
                    ]
                }
            ]
        }
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientRoutesFactory,
                {
                    provide: RoutesProviderService, useFactory: () => {
                        return fakeRoutesProvider;
                    }, deps: []
                }
                // for additional providers, write as examples below
                // ServiceName,
                // { provider: ServiceName, useValue: fakeServiceName },
                // { provider: ServiceName, useClass: FakeServiceClass },
                // { provider: ServiceName, useFactory: fakeServiceFactory, deps: [] },
            ]
        });
    });

    // you can also wrap inject() with async() for asynchronous tasks
    // it('...', async(inject([...], (...) => {}));

    it('should inject patient routes service',
        inject([PatientRoutesFactory], (s: PatientRoutesFactory) => {
            expect(s).toBeTruthy();
        })
    );

    it('should create a the patient dashboard routes for a given patient',
        inject([PatientRoutesFactory], (s: PatientRoutesFactory) => {
            let loadedPatient: any = {
                uuid: 'patient-uuid',
                display: 'the patient',
                person: {
                    uuid: 'patient-uuid'
                },
                identifiers: {
                    uuid: ' patient identifiers  uuid'
                },
                enrolledPrograms: [
                    {
                        uuid: 'some uuid',
                        dateCompleted: null,
                        dateEnrolled: '2016-11-22T00:00:00.000+0300',
                        program: {
                            uuid: '781d85b0-1359-11df-a1f1-0026b9348838'
                        }
                    }
                ]
            };

            let patient = new Patient(loadedPatient);

            let createdRoutes = s.createPatientDashboardRoutes(patient);

            expect(createdRoutes.length).toBe(2);


            // examine first route
            let firstRoute = createdRoutes[0];

            let expectFirstRoute: RouteModel = {
                childRoutes: [
                    {
                        childRoutes: [],
                        url: 'patient-dashboard/' +
                        'patient-uuid/general/patient-info',
                        label: 'Patient Info',
                        initials: 'P',
                        renderingInfo: {
                            icon: 'fa fa-clipboard'
                        }
                    },
                    {
                        childRoutes: [],
                        url: 'patient-dashboard/' +
                        'patient-uuid/general/visit',
                        label: 'Visit',
                        initials: 'V',
                        renderingInfo: {
                            icon: 'icon-i-outpatient'
                        }
                    }
                ],
                label: 'General Info',
                initials: 'G',
                url: 'patient-dashboard/patient-uuid/general',
                renderingInfo: {
                    icon: 'fa fa-square-o'
                },
            };

            // console.log(JSON.stringify(expectFirstRoute));
            // console.log(JSON.stringify(firstRoute));
            expect(JSON.stringify(expectFirstRoute)).
                toEqual(JSON.stringify(firstRoute));

            // examine seccond route
            let second = createdRoutes[1];
            expect(second.url).toEqual('patient-dashboard/patient-uuid/hiv');
        }));
});
