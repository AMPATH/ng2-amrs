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
import { ClinicSideNavComponent } from './clinic-side-nav.component';
import { NavigationService } from '../../navigation.service';
import { UserService } from '../../../openmrs-api/user.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { AppSettingsService } from '../../../app-settings';
import { SessionStorageService } from '../../../utils/session-storage.service';
import { LocalStorageService } from '../../../utils/local-storage.service';

describe('ClinicSideNavComponent:', () => {
    let fixture: ComponentFixture<ClinicSideNavComponent>;
    let comp: ClinicSideNavComponent;
    let el;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ClinicSideNavComponent
            ],
            providers: [DynamicRoutesService,
                        NavigationService,
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
                       AppSettingsService,
                       SessionStorageService,
                       LocalStorageService
                    ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ClinicSideNavComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should be injected', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should changed the displayed new routes for a patient when they change',
    (done) => {
        let dynamicRoutesService: DynamicRoutesService = TestBed.get(DynamicRoutesService);
        let newRoutes: Array<RouteModel> = [new RouteModel(), new RouteModel()];
        dynamicRoutesService.setClinicDashBoardRoutes(newRoutes);
        fixture.detectChanges();
        expect(fixture.componentInstance.routes).toBe(newRoutes);
        expect(fixture.componentInstance.selectedRoute).toBe(newRoutes[0]);
        done();
    });
});
