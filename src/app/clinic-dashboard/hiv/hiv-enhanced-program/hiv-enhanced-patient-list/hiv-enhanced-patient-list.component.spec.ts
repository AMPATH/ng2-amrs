import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HivEnhancedPatientListComponent } from './hiv-enhanced-patient-list.component';
import { PatientListComponent } from 'src/app/shared/data-lists/patient-list/patient-list.component';
import { GenericListComponent } from 'src/app/shared/data-lists/generic-list/generic-list.component';
import { AgGridModule, BaseComponentFactory } from 'ag-grid-angular/main';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('hiv-enhanced-patient-list component Tests', () => {
    let comp: HivEnhancedPatientListComponent;
    let fixture: ComponentFixture<HivEnhancedPatientListComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AgGridModule, RouterTestingModule, HttpClientTestingModule],
            providers: [BaseComponentFactory],
            declarations: [HivEnhancedPatientListComponent, PatientListComponent, GenericListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HivEnhancedPatientListComponent);
        comp = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(comp).toBeDefined();
    });

    it('should have required properties', () => {
        expect(comp.endDate).toBeUndefined();
        expect(comp.startDate).toBeUndefined();
        expect(comp.extraColumns).toBeUndefined();
        expect(comp.patientData).toBeUndefined();
        expect(comp.isLoadingPatientList).toBe(false);
    });

    it('should have all the required functions defined and callable', (done) => {
        spyOn(comp, 'ngOnInit').and.callThrough();
        comp.ngOnInit();
        expect(comp.ngOnInit).toHaveBeenCalled();
        done();
    });
});
