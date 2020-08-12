import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgGridModule, BaseComponentFactory } from 'ag-grid-angular/main';

import { HivDifferentiatedCarePatientListComponent } from './hiv-differentiated-care-patient-list.component';
import { PatientListComponent } from 'src/app/shared/data-lists/patient-list/patient-list.component';
import { GenericListComponent } from 'src/app/shared/data-lists/generic-list/generic-list.component';



xdescribe('HIV Differentiated Care Patient List Component Tests', () => {
    let comp: HivDifferentiatedCarePatientListComponent;
    let fixture: ComponentFixture<HivDifferentiatedCarePatientListComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AgGridModule, RouterTestingModule, HttpClientTestingModule],
            providers: [BaseComponentFactory],
            declarations: [HivDifferentiatedCarePatientListComponent, PatientListComponent, GenericListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HivDifferentiatedCarePatientListComponent);
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
