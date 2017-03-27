/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DataListsModule } from '../../data-lists/data-lists.module';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
    DailyScheduleResourceService
} from
    '../../etl-api/daily-scheduled-resource.service';
import { DailyScheduleAppointmentsComponent } from './daily-schedule-appointments.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { BusyModule, BusyConfig } from 'angular2-busy';
import {
    AccordionModule, DataTableModule, SharedModule, TabViewModule,
    GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
    DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
    DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { Router } from '@angular/router';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
describe('Component: DailyScheduleAppointmentsComponent', () => {
    let fakeAppFeatureAnalytics: AppFeatureAnalytics, component,
        dailyScheduleResource: DailyScheduleResourceService,
        clinicDashBoardCacheService: ClinicDashboardCacheService,
        fixture, componentInstance;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageService,
                DailyScheduleResourceService,
                ClinicDashboardCacheService,
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                {
                    provide: Router,
                    useClass: class { navigate = jasmine.createSpy('navigate'); }
                },
                {
                    provide: Http,
                    useFactory: (backendInstance: MockBackend,
                        defaultOptions: BaseRequestOptions) => {
                        return new Http(backendInstance, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                {
                    provide: AppFeatureAnalytics, useFactory: () => {
                        return new FakeAppFeatureAnalytics();
                    }, deps: []
                }

            ],
            declarations: [DailyScheduleAppointmentsComponent],
            imports: [BusyModule,
                FormsModule,
                DialogModule,
                CalendarModule,
                DataListsModule,
                NgamrsSharedModule]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(DailyScheduleAppointmentsComponent);
            component = fixture.componentInstance;
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
        dailyScheduleResource = TestBed.get(DailyScheduleResourceService);
        let appointmentsComponent = new DailyScheduleAppointmentsComponent(
            clinicDashBoardCacheService,
            dailyScheduleResource);
        expect(appointmentsComponent).toBeTruthy();
    });

    it('should have required properties', (done) => {

        expect(component.dailyAppointmentsPatientList.length).toBe(0);
        expect(component.selectedDate).toBeDefined;
        expect(component.ngOnInit).toBeDefined();
        expect(component.getQueryParams).toBeDefined();
        expect(component.getDailyAppointments).toBeDefined();
        expect(component.errors.length).toBe(0);
        expect(component.selectedDate).toEqual(undefined);
        expect(component.selectedClinic).toEqual(undefined);
        expect(component.dataLoaded).toEqual(false);
        expect(component.loadingDailyAppointments).toEqual(false);

        done();

    });

    it('should fetch daily appointments when location changes', (done) => {
        clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
        spyOn(component, 'getDailyAppointments').and.callThrough();
        component.getDailyAppointments({
            startDate: '2017-02-01',
            startIndex: 0,
            locationUuids: 'uuid',
            limit: undefined
        });
        expect(component.getDailyAppointments).toHaveBeenCalled();
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();

        done();
    });

    it('should create params when getQueryParams is called', (done) => {
        spyOn(component, 'getQueryParams').and.callThrough();
        component.selectedDate = '12-12-2016';
        component.selectedClinic = 'location-uuid';
        let params = component.getQueryParams();
        expect(component.getQueryParams).toHaveBeenCalled();
        expect(params.locationUuids).toEqual('location-uuid');
        expect(params.startDate).toEqual('12-12-2016');
        expect(params.limit).toBeUndefined;
        expect(params.startIndex).toEqual(0);
        done();
    });

});


