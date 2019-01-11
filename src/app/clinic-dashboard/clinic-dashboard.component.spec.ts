import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { Routes } from '@angular/router';
import { LocationResourceService } from '../openmrs-api/location-resource.service';

describe('clinic-dashboard component tests', () => {
    let comp: ClinicDashboardComponent, service;
    let fixture: ComponentFixture<ClinicDashboardComponent>;

    class MockCacheStorageService {
        constructor(a, b) { }

        public ready() {
            return true;
        }
    }

    const routes: Routes = [
        { path: 'user-default-properties', component: ClinicDashboardComponent }
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes), FormsModule, NgamrsSharedModule,
                HttpClientTestingModule

            ],
            declarations: [ClinicDashboardComponent],
            providers: [
                CacheService,
                ClinicDashboardCacheService, ClinicDashboardCacheService,
                LocalStorageService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ClinicDashboardComponent);
                comp = fixture.componentInstance;
                service = TestBed.get(LocationResourceService);
            });
    }));

    it('should be defined', () => {
        expect(comp).toBeTruthy();
    });

    it('should have required properties', () => {
        expect(comp.locationUuid).toBeUndefined();
        expect(comp.selectedLocation).toBeDefined();
        expect(comp.selectedDepartment).toBeUndefined();
        expect(comp.loaderStatus).toBe(false);
        expect(comp.selectingLocation).toBe(true);
        expect(comp.locations.length).toBe(0);
    });

    it('should have all the required functions defined and callable', (done) => {
        spyOn(comp, 'ngOnInit').and.callThrough();
        comp.ngOnInit();
        expect(comp.ngOnInit).toHaveBeenCalled();

        spyOn(comp, 'getUserDepartment').and.callThrough();
        comp.getUserDepartment();
        expect(comp.getUserDepartment).toHaveBeenCalled();

        spyOn(comp, 'locationChanged').and.callThrough();
        comp.locationChanged('');
        expect(comp.locationChanged).toHaveBeenCalled();

        spyOn(comp, 'getLocations').and.callThrough();
        comp.getLocations();
        expect(comp.getLocations).toHaveBeenCalled();

        spyOn(comp, 'resolveSelectedLocationByUuid').and.callThrough();
        comp.resolveSelectedLocationByUuid('');
        expect(comp.resolveSelectedLocationByUuid).toHaveBeenCalled();

        spyOn(service, 'getLocations').and.callThrough();
        service.getLocations();
        expect(service.getLocations).toHaveBeenCalled();

        done();
    });
});


