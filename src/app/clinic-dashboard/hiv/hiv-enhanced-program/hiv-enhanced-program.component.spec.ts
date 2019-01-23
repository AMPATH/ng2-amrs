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
import { Routes, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment, Params, Data, Route } from '@angular/router';
import { of, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { Type } from '@angular/core';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}

describe('HivEnhancedComponent Tests', () => {
    let component: HivEnhancedComponent;
    let fixture: ComponentFixture<HivEnhancedComponent>;

    beforeEach(async () => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, FormsModule, AgGridModule,
                RouterTestingModule],
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
        expect(component.title).toBe('HIV Viremia Program Reports');
    });
});
