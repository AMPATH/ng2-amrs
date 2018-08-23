/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouteModel } from '../../../shared/dynamic-route/route.model';
import { DynamicRoutesService } from '../../../shared/dynamic-route/dynamic-routes.service';
import {  } from 'jasmine';
import { PatientSideNavComponent } from './patient-side-nav.component';
import { NavigationService } from '../../navigation.service';
import { UserService } from '../../../openmrs-api/user.service';
import { SessionStorageService } from '../../../utils/session-storage.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('PatientSideNavComponent:', () => {
    let fixture: ComponentFixture<PatientSideNavComponent>;
    let comp: PatientSideNavComponent;
    let formRouteLabelEl;
    let navigationServiceStub: Partial<NavigationService>;
    navigationServiceStub = {
        checkFormsTabViewingRight: () => true,
        expandSideBar: () => false,
        collapseSideBar: () => true,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                PatientSideNavComponent
            ],
            providers: [
                        DynamicRoutesService,
                        {
                            provide: NavigationService,
                            useValue: navigationServiceStub
                        },
                        UserService,
                        MockBackend,
                        BaseRequestOptions,
                        {
                          provide: Http,
                          useFactory: (
                              backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                          return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                       },
                       AppSettingsService
                    ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PatientSideNavComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should be injected', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();

        // other examples
        // expect(el.nativeElement.textContent).toContain('Test Title');
        // fixture.whenStable().then(() => {
        //     fixture.detectChanges();
        //     expect((fixture.debugElement.classes as any).className).toBe(true);
        // });
    });

    it('should changed the displayed new routes for a patient when they change',
        (done) => {
            let dynamicRoutesService: DynamicRoutesService = TestBed.get(DynamicRoutesService);
            let newRoutes: Array<RouteModel> = [new RouteModel(), new RouteModel()];
            dynamicRoutesService.setPatientDashBoardRoutes(newRoutes);
            fixture.detectChanges();
            expect(fixture.componentInstance.routes).toBe(newRoutes);
            expect(fixture.componentInstance.selectedRoute).toBe(newRoutes[0]);
            done();
        });

    it('should display the child routes for the selected programs when' +
        ' a program route is selected', (done) => {
            let dynamicRoutesService: DynamicRoutesService = TestBed.get(DynamicRoutesService);
            let programRoute = new RouteModel();
            programRoute.renderingInfo = {};
            programRoute.initials = 'P';
            programRoute.label = 'program';
            programRoute.url = 'url';

            programRoute.childRoutes = [
                {
                    childRoutes: [],
                    initials: 'T',
                    label: 'Test',
                    renderingInfo: { icon: 'fa fa-circle' },
                    url: 'some/url/'
                },
                {
                    childRoutes: [],
                    initials: 'G',
                    label: ' G Test',
                    renderingInfo: { icon: 'fa fa-circle' },
                    url: 'some/url/'
                }
            ];

            let newRoutes: Array<RouteModel> = [programRoute, new RouteModel()];
            dynamicRoutesService.setPatientDashBoardRoutes(newRoutes);
            fixture.detectChanges();
            fixture.componentInstance.viewChildRoutes(programRoute);
            fixture.detectChanges();

            expect(fixture.componentInstance.viewingChildRoutes).toBe(true);
            expect(fixture.componentInstance.selectedRoute).toBe(programRoute);
            done();
        });

        it('should display Forms Tab depending on the roles', (done) => {
            let dynamicRoutesService: DynamicRoutesService = TestBed.get(DynamicRoutesService);
            let programRoute = new RouteModel();
            programRoute.renderingInfo = {};
            programRoute.initials = 'G';
            programRoute.label = 'General Info';
            programRoute.url = 'url';

            programRoute.childRoutes = [
                {
                    childRoutes: [],
                    initials: 'F',
                    label: 'Forms',
                    renderingInfo: { icon: 'fa fa-circle' },
                    url: 'some/url/'
                }
            ];

            const newRoutes: Array<RouteModel> = [programRoute, new RouteModel()];
            dynamicRoutesService.setPatientDashBoardRoutes(newRoutes);
            fixture.detectChanges();
            comp.viewChildRoutes(programRoute);
            fixture.detectChanges();

            formRouteLabelEl = fixture.debugElement.query(By.css('.child-route-label'));
            expect(comp.viewingChildRoutes).toBe(true);
            expect(comp.selectedRoute).toBe(programRoute);
            expect(comp.canViewFormsTab).toBe(true, 'Can View Forms Tab If Authorized');
            expect(formRouteLabelEl.nativeElement.textContent).toMatch('Forms');

            const navigationService = TestBed.get(NavigationService);
            navigationService.checkFormsTabViewingRight = () => false;
            comp.setFormsTabViewingRight();
            fixture.detectChanges();
            expect(comp.canViewFormsTab).toBe(false, 'Can\'t View Forms Tab If not Authorized');
            formRouteLabelEl = fixture.debugElement.query(By.css('.child-route-label'));
            expect(formRouteLabelEl).toBeNull();
            done();
        });
});
