/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataListsModule } from '../../../shared/data-lists/data-lists.module';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import {
    DefaulterListResourceService
} from '../../../etl-api/defaulter-list-resource.service';

import { DefaulterListComponent } from './defaulter-list.component';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { NgBusyModule } from 'ng-busy';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import {
    DialogModule, CalendarModule
} from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import 'rxjs/add/observable/of';

class MockActivatedRoute {
    public params = Observable.of([{ 'id': 1 }]);
    public snapshot = {
        queryParams: { filter: '' }
    };
}
class MockCacheStorageService {
    constructor(a, b) {

    }

    public ready() {
        return true;
    }
}

describe('Component: DefaulterListComponent', () => {
    let component, defaulterResource: DefaulterListResourceService, route, router,
        clinicDashBoardCacheService: ClinicDashboardCacheService,
        fixture, activatedRoute;

    const testData = [
        {
            patient_uuid: 'patient-uuid',
            person_id: 102322,
            encounter_id: 636033226,
            location_id: 1,
            location_uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
            days_since_rtc: 30,
            encounter_datetime: '2016-09-19T21:00:00.000Z',
            rtc_date: '2017-12-16T21:00:00.000Z',
            arv_start_date: '2009-09-15T21:00:00.000Z',
            encounter_type_name: 'ADULTNONCLINICALMEDICATION',
            person_name: 'Peter kenya Munya',
            phone_number: null,
            identifiers: '24371MT-9, 009421138-0, 15204-21078',
            filed_id: '38-11-42-09-0',
            gender: 'M',
            birthdate: '1965-12-31T21:00:00.000Z',
            birthdate_estimated: 0,
            dead: 0,
            death_date: null,
            cause_of_death: null,
            creator: 50842,
            date_created: '2009-09-19T05:28:30.000Z',
            changed_by: 131180,
            date_changed: '2010-02-15T06:40:49.000Z',
            voided: 0,
            voided_by: null,
            date_voided: null,
            void_reason: null,
            uuid: 'a4ce27ae-f1e5-4893-9248-50332de6281e',
            deathdate_estimated: 0,
            birthtime: null,
            age: 51
        }
    ];
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageService,
                DefaulterListResourceService,
                ClinicDashboardCacheService,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }, deps: []
                },
                {
                    provide: ActivatedRoute,
                    useClass: MockActivatedRoute
                },
                {
                    provide: Router,
                    useClass: class { public navigate = jasmine.createSpy('navigate'); }
                },
                {
                    provide: AppFeatureAnalytics, useFactory: () => {
                        return new FakeAppFeatureAnalytics();
                    }, deps: []
                }

            ],
            declarations: [DefaulterListComponent],
            imports: [NgBusyModule,
                FormsModule,
                HttpClientTestingModule,
                DialogModule,
                CalendarModule,
                DataListsModule,
                NgamrsSharedModule]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(DefaulterListComponent);
            component = fixture.componentInstance;
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
        defaulterResource = TestBed.get(DefaulterListResourceService);
        route = TestBed.get(ActivatedRoute);
        router = TestBed.get(Router);
        const appointmentsComponent = new DefaulterListComponent(clinicDashBoardCacheService,
            defaulterResource, route, router);
        expect(appointmentsComponent).toBeTruthy();
    });

    it('should have required properties', (done) => {
        expect(component.minDefaultPeriod).toEqual(undefined);
        expect(component.maxDefaultPeriod).toEqual(undefined);
        expect(component.defaulterList.length).toBe(0);
        expect(component.ngOnInit).toBeDefined();
        expect(component.getQueryParams).toBeDefined();
        expect(component.getDefaulterList).toBeDefined();
        expect(component.errors.length).toBe(0);
        expect(component.selectedClinic).toEqual(undefined);
        expect(component.dataLoaded).toEqual(false);
        expect(component.loadingDefaulterList).toEqual(false);
        expect(component.extraColumns).toBeDefined();
        expect(component.getDefaulterList).toBeDefined();
        expect(component.cacheDefaulterListParam).toBeDefined();
        expect(component.formatDefaulterListData).toBeDefined();
        expect(component.subscribeToLocationChangeEvent).toBeDefined();

        done();

    });

    it('should add extraColumns when extraColumns method is called', (done) => {
        spyOn(component, 'extraColumns').and.callThrough();
        const columns = component.extraColumns();
        expect(component.extraColumns).toHaveBeenCalled();
        expect(columns.length).toEqual(4);
        expect(columns[0].field).toEqual('rtc_date');
        expect(columns[1].field).toEqual('last_appointment');
        expect(columns[2].field).toEqual('filed_id');

        done();
    });

    it('should format list data  when formatDefaulterListData method is called', (done) => {
        spyOn(component, 'formatDefaulterListData').and.callThrough();

        const formatted = component.formatDefaulterListData(testData);
        expect(component.formatDefaulterListData).toHaveBeenCalled();
        expect(formatted.length).toEqual(1);
        expect(formatted[0].rtc_date).toEqual('16-12-2017 (30 days ago)');
        expect(formatted[0].last_appointment).toEqual('19-09-2016 ADULTNONCLINICALMEDICATION');
        expect(formatted[0].filed_id).toEqual(testData[0].filed_id);
        expect(formatted[0].identifiers).toEqual(testData[0].identifiers);
        expect(formatted[0].gender).toEqual(testData[0].gender);
        expect(formatted[0].age).toEqual(testData[0].age);
        expect(formatted[0].person_name).toEqual(testData[0].person_name);
        expect(formatted[0].encounter_type_name).toEqual(testData[0].encounter_type_name);
        expect(formatted[0].encounter_datetime).toEqual('19-09-2016');
        expect(formatted[0].uuid).toEqual(testData[0].patient_uuid);

        done();
    });

    it('should cache defaulter list parameters when  cacheDefaulterListParam '
        + 'method is called', (done) => {
            spyOn(component, 'cacheDefaulterListParam').and.callThrough();
            component.cacheDefaulterListParam({
                maxDefaultPeriod: 100,
                defaulterPeriod: 20,
                startIndex: undefined,
                locationUuids: 'location-uuid',
                limit: undefined
            });
            expect(component.cacheDefaulterListParam).toHaveBeenCalled();
            done();
        });

    it('should load defaulter list with cached parameters when  loadDefaulterListFromCachedParams '
        + 'method is called', (done) => {
            spyOn(component, 'loadDefaulterListFromCachedParams').and.callThrough();
            component.loadDefaulterListFromCachedParams({
                maxDefaultPeriod: 100,
                defaulterPeriod: 20,
                startIndex: undefined,
                locationUuids: 'location-uuid',
                limit: undefined
            });
            expect(component.loadDefaulterListFromCachedParams).toHaveBeenCalled();
            done();
        });

    it('should get date without time part when  getDatePart '
        + 'method is called', (done) => {
            spyOn(component, 'getDatePart').and.callThrough();
            const newDate = component.getDatePart('2017-12-16T21:00:00.000Z');
            expect(component.getDatePart).toHaveBeenCalled();
            expect(newDate).toEqual('2017-12-16');
            done();
        });

    it('should return null when  getDatePart '
        + 'method is called with null values', (done) => {
            spyOn(component, 'getDatePart').and.callThrough();
            const newDate = component.getDatePart(null);
            expect(component.getDatePart).toHaveBeenCalled();
            expect(newDate).toEqual(null);
            done();
        });

    it('should get cached defaulter list parameters when  getCachedDefaulterListParam '
        + 'method is called', (done) => {
            spyOn(component, 'getCachedDefaulterListParam').and.callThrough();
            const params = component.getCachedDefaulterListParam('defaulterListParam');
            expect(component.getCachedDefaulterListParam).toHaveBeenCalled();
            done();
        });

    it('should load defaulter list when loadDefaulterList method is called', (done) => {
        spyOn(component, 'loadDefaulterList').and.callThrough();
        component.selectedClinic = 'clinic-uuid';
        const columns = component.loadDefaulterList();
        expect(component.loadDefaulterList).toHaveBeenCalled();
        expect(component.loadDefaulterList).toHaveBeenCalled();
        done();
    });

    it('should fetch defaulter list when getDefaulterList is called', (done) => {
        clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
        activatedRoute = TestBed.get(ActivatedRoute);
        router = TestBed.get(Router);
        const components = new DefaulterListComponent(clinicDashBoardCacheService,
            defaulterResource, activatedRoute, router);
        spyOn(component, 'getDefaulterList').and.callThrough();
        component.getDefaulterList({
            maxDefaultPeriod: 30,
            defaulterPeriod: 120,
            startIndex: undefined,
            locationUuids: 'uuid',
            limit: undefined
        });

        component.cacheDefaulterListParam({
            maxDefaultPeriod: 100,
            defaulterPeriod: 20,
            startIndex: undefined,
            locationUuids: 'location-uuid',
            limit: undefined
        });

        expect(component.getDefaulterList).toHaveBeenCalled();
        spyOn(components, 'ngOnInit');
        components.ngOnInit();
        expect(components.ngOnInit).toHaveBeenCalled();

        done();
    });

});
