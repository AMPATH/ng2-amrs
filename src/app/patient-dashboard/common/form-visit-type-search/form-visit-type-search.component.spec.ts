/* tslint:disable:no-unused-expression*/
/*import { TestBed, fakeAsync } from '@angular/core/testing';
import { PatientProgramResourceService } from 'src/app/etl-api/patient-program-resource.service';
import { FormVisitTypeSearchComponent } from './form-visit-type-search.component';
import { FormsModule } from '@angular/forms';
import { FormsResourceService } from 'src/app/openmrs-api/forms-resource.service';
import { FormOrderMetaDataService } from '../forms/form-order-metadata.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { of } from 'rxjs';
import { FormListService } from '../forms/form-list.service';

class FakeFormsResourceService {

}

class FakeFormListService {
    public getFormList() {
        return of({ status: 'okay', res: 'form lists' });
    }
}

class FakePatientProgramResourceService {
    public getAllProgramVisitConfigs(ttl?: number) {
        return of({ status: 'okay', res: 'program visit configs' });
    }
}

describe('FormVisitTypeSearchComponent test', () => {
    let component: FormVisitTypeSearchComponent;
    let patientProgramResourceServiceStub: PatientProgramResourceService;
    let formListServiceStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule],
            declarations: [FormVisitTypeSearchComponent],
            providers: [
                { provide: FormListService, useClass: FakeFormListService },
                { provide: PatientProgramResourceService, useClass: FakePatientProgramResourceService },
                { provide: FormsResourceService, useClass: FakeFormsResourceService },
                FormVisitTypeSearchComponent, FormOrderMetaDataService,
                LocalStorageService, AppSettingsService]
        });
        component = TestBed.get(FormVisitTypeSearchComponent);
        patientProgramResourceServiceStub = TestBed.get(PatientProgramResourceService);
        formListServiceStub = TestBed.get(FormListService);
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should have the following properties', () => {
        expect(component.programVisitConfig).toBeUndefined();
        expect(component.mainFilterType).toBeDefined();
        expect(component.visitTypeList.length).toEqual[0];
        expect(component.formList.length).toEqual[0];
        expect(component.encounterTypeList.length).toEqual[0];
        expect(component.secondFilters.length).toEqual[0];
        expect(component.selectedFilterArray.length).toEqual[0];
        expect(component.visitTypeResult.length).toEqual[0];
        expect(component.formTypeResult.length).toEqual[0];
        expect(component.allFormsList).toBeUndefined();
        expect(component.showVisitResults).toBe(false);
        expect(component.showFormResults).toEqual(false);
        expect(component.secondaryFilter).toBeUndefined();
    });

    it('should have all the required functions defined and callable', () => {
        spyOn(component, 'getProgramsVisitConfig').and.callFake(() => { });
        component.getProgramsVisitConfig();
        expect(component.getProgramsVisitConfig).toHaveBeenCalled();

        spyOn(component, 'selectMainFilter').and.callFake(() => { });
        component.selectMainFilter('');
        expect(component.selectMainFilter).toHaveBeenCalled();

        spyOn(component, 'selectSecondaryFilter').and.callFake(() => { });
        component.selectSecondaryFilter('all');
        expect(component.selectSecondaryFilter).toHaveBeenCalled();

        spyOn(component, 'getallFormsList').and.callFake(() => { });
        component.getallFormsList();
        expect(component.getallFormsList).toHaveBeenCalled();

        spyOn(component, 'sortFormsList').and.callFake(() => { });
        component.sortFormsList('all');
        expect(component.sortFormsList).toHaveBeenCalled();

        spyOn(component, 'orderFilterByAlphabetAsc').and.callFake(() => { });
        component.orderFilterByAlphabetAsc('sort');
        expect(component.orderFilterByAlphabetAsc).toHaveBeenCalled();

        spyOn(component, 'removeFilterItem').and.callFake(() => { });
        component.removeFilterItem('');
        expect(component.removeFilterItem).toHaveBeenCalled();

        spyOn(component, 'clearSelectedFilter').and.callFake(() => { });
        component.clearSelectedFilter();
        expect(component.clearSelectedFilter).toHaveBeenCalled();
        expect(component.selectedFilterArray.length).toEqual(0);
    });

    it('should subscribe PatientProgramResourceService getAllProgramVisitConfigs method', () => {
        spyOn(patientProgramResourceServiceStub, 'getAllProgramVisitConfigs')
            .and.returnValue(of({ staus: 'okay', res: 'program visits configs' }));
        component.getProgramsVisitConfig();
        expect(patientProgramResourceServiceStub.getAllProgramVisitConfigs).toHaveBeenCalled();
    });

    it('should subscribe to FormListService getFormList() to get forms', () => {
        spyOn(formListServiceStub, 'getFormList').and.returnValue(of({ status: 'okay', res: 'form lists' }));
        component.getallFormsList();
        expect(formListServiceStub.getFormList).toHaveBeenCalled();
    });
});*/
