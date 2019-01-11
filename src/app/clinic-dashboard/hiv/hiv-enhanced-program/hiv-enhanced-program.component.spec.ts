import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AgGridModule, BaseComponentFactory } from 'ag-grid-angular/main';
import { FormsModule } from '@angular/forms';
import { HivEnhancedComponent } from './hiv-enhanced-program.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HivEnhancedReportService } from 'src/app/etl-api/hiv-enhanced-program-report.service';
import { HivEnhancedFiltersComponent } from './hiv-enhanced-program-filters/hiv-enhanced-program-filters.component';
import { HivEnhancedPatientListComponent } from './hiv-enhanced-patient-list/hiv-enhanced-patient-list.component';
import { PatientListComponent } from 'src/app/shared/data-lists/patient-list/patient-list.component';
import { GenericListComponent } from 'src/app/shared/data-lists/generic-list/generic-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { Routes, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HivEnhancedComponent Tests', () => {
    let component: HivEnhancedComponent;
    let fixture: ComponentFixture<HivEnhancedComponent>;

    class MockCacheStorageService {
        constructor(a, b) { }

        public ready() {
            return true;
        }
    }

    class MockParams {
        params: any;
        constructor(params) {
            this.params = params;
        }

        get(key) {
            return this.params[key];
        }
    }

    const routes: Routes = [
        { path: 'weather/:city', component: HivEnhancedComponent }
    ];

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, FormsModule, AgGridModule,
                RouterTestingModule.withRoutes(routes)],
            declarations: [HivEnhancedComponent, HivEnhancedFiltersComponent,
                PatientListComponent, HivEnhancedPatientListComponent,
                GenericListComponent
            ],
            providers: [HivEnhancedReportService, LocalStorageService, CacheService,
                DataCacheService, AppSettingsService, BaseComponentFactory,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
                {
                    provide: ActivatedRoute, useValue: {
                        parent: of(new MockParams({ city: 'location' }))
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HivEnhancedComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should have required properties', () => {
        expect(component.isLoadingPatientList).toBe(false);
        expect(component.patientData).toBeUndefined();
        expect(component.sectionTittle).toBeUndefined();
        expect(component.indicators).toBeUndefined();
        expect(component.title).toBeDefined();
        expect(component.locationUuid).toBeDefined();
        expect(component.activeTab).toBeDefined();
        expect(component.title).toBe('HIV Enhanced Adherence Reports');
    });

    xit('should have all the required functions defined and callable', (done) => {
        spyOn(component, 'generateReport').and.callThrough();
        component.generateReport('');
        expect(component.generateReport).toHaveBeenCalled();

        spyOn(component, 'loadReportParamsFromUrl').and.callThrough();
        component.loadReportParamsFromUrl();
        expect(component.loadReportParamsFromUrl).toHaveBeenCalled();

        spyOn(component, 'storeReportParamsInUrl').and.callThrough();
        component.storeReportParamsInUrl();
        expect(component.storeReportParamsInUrl).toHaveBeenCalled();

        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        done();
    });
});
