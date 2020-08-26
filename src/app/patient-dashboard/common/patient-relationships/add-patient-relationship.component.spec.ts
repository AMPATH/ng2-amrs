import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientService } from '../../services/patient.service';
import { PatientRelationshipService } from './patient-relationship.service';
import { PatientRelationshipTypeService } from './patient-relation-type.service';
import { AddPatientRelationshipComponent } from './add-patient-relationship.component';
import {
    ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import {
    ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap';

describe('Component: AddRelationship Unit Tests', () => {

    let patientRelationshipService: PatientRelationshipService,
        patientRelationshipTypeService: PatientRelationshipTypeService,
        fakeAppFeatureAnalytics: AppFeatureAnalytics, patientService: PatientService, component,
        bsModalService: BsModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FakeAppFeatureAnalytics,
                {
                    provide: AppFeatureAnalytics,
                    useClass: FakeAppFeatureAnalytics
                },
                {
                    provide: PatientRelationshipService,
                },
                {
                    provide: PatientRelationshipTypeService,
                },
                {
                    provide: PatientService
                },
                ProgramWorkFlowResourceService,
                ProgramWorkFlowStateResourceService,
                AppSettingsService,
                LocalStorageService,
                BsModalService
            ],
            imports: [ModalModule.forRoot()]
        });

        patientService = TestBed.get(PatientService);
        patientRelationshipService = TestBed.get(PatientRelationshipService);
        patientRelationshipTypeService = TestBed.get(PatientRelationshipTypeService);
        fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
        bsModalService = TestBed.get(BsModalService);
        component = new AddPatientRelationshipComponent(patientRelationshipService,
            patientRelationshipTypeService, patientService, fakeAppFeatureAnalytics, bsModalService);

    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should instantiate the component', (done) => {

        expect(component).toBeTruthy();
        done();

    });
    it('should have required properties', (done) => {
        expect(component.display).toBe(false);
        expect(component.isLoading).toBe(false);
        expect(component.showSuccessAlert).toBe(false);
        expect(component.showErrorAlert).toBe(false);
        expect(component.patientRelationshipTypes.length).toBe(0);
        expect(component.patientUuid).toBeUndefined();
        expect(component.successAlert).toBeUndefined();
        expect(component.errorAlert).toBeUndefined();
        expect(component.selectedRelationshipType).toBeUndefined();
        expect(component.errors.length).toBe(0);

        done();

    });

    it('should have all the required functions defined and callable', (done) => {
        spyOn(component, 'getPatient').and.callFake((err, data) => {
        });
        component.getPatient((err, data) => {
        });
        expect(component.getPatient).toHaveBeenCalled();
        spyOn(component, 'getRelationShipTypes').and.callFake((err, data) => {
        });
        component.getRelationShipTypes((err, data) => {
        });
        expect(component.getRelationShipTypes).toHaveBeenCalled();
        spyOn(component, 'saveRelationship').and.callFake((err, data) => {

        });
        component.saveRelationship((err, data) => {
        });
        expect(component.saveRelationship).toHaveBeenCalled();
        spyOn(component, 'showDialog').and.callFake((err, data) => {

        });
        component.showDialog((err, data) => {
        });
        expect(component.showDialog).toHaveBeenCalled();
        spyOn(component, 'getPatientRelationshipPayload').and.callFake((err, data) => {

        });
        component.getPatientRelationshipPayload((err, data) => {
        });
        expect(component.getPatientRelationshipPayload).toHaveBeenCalled();
        spyOn(component, 'cancelRelationship').and.callFake((err, data) => {

        });
        component.cancelRelationship((err, data) => {
        });
        expect(component.cancelRelationship).toHaveBeenCalled();
        spyOn(component, 'displaySuccessAlert').and.callFake((err, data) => {

        });
        component.displaySuccessAlert((err, data) => {
        });
        expect(component.displaySuccessAlert).toHaveBeenCalled();

        spyOn(component, 'displayErrorAlert').and.callFake((err, data) => {

        });
        component.displayErrorAlert((err, data) => {
        });
        expect(component.displayErrorAlert).toHaveBeenCalled();

        done();

        done();

    });
});
