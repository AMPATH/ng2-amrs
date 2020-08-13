import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AgGridModule, BaseComponentFactory } from 'ag-grid-angular/main';
import { FormsModule } from '@angular/forms';
import { HivDifferentiatedCareComponent } from './hiv-differentiated-care-program.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HivDifferentiatedCareResourceService } from '../../../etl-api/hiv-differentiated-care-resource.service';
import { HivDifferentiatedCarePatientListComponent
} from './hiv-differentiated-care-program-patient-list/hiv-differentiated-care-patient-list.component';
import { PatientListComponent } from 'src/app/shared/data-lists/patient-list/patient-list.component';
import { GenericListComponent } from 'src/app/shared/data-lists/generic-list/generic-list.component';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}

xdescribe('HivDifferentiatedCareComponent Tests', () => {
    let component: HivDifferentiatedCareComponent;
    let fixture: ComponentFixture<HivDifferentiatedCareComponent>;

    beforeEach(async () => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, FormsModule, AgGridModule,
                RouterTestingModule],
            declarations: [HivDifferentiatedCareComponent,
                PatientListComponent, HivDifferentiatedCarePatientListComponent,
                GenericListComponent
            ],
            providers: [HivDifferentiatedCareResourceService, LocalStorageService, CacheService,
                DataCacheService, AppSettingsService, BaseComponentFactory,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HivDifferentiatedCareComponent);
        component = fixture.componentInstance;

    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should have required properties', () => {
        expect(component.isLoadingPatientList).toBe(false);
        expect(component.patientData).toBeUndefined();
        expect(component.indicators).toBeUndefined();
        expect(component.title).toBeDefined();
        expect(component.locationUuid).toBeDefined();
        expect(component.title).toBe('HIV Differentiated Care Program Reports');
    });
});
