import { TestBed, async } from '@angular/core/testing';
import { PatientRemindersComponent } from './patient-reminders.component';
import { PatientReminderService } from './patient-reminders.service';
import { PatientService } from '../../services/patient.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs';
import {
    ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';
import { AppSettingsService } from '../../../app-settings';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrConfig, ToastrService, Overlay, OverlayContainer, ToastrModule } from 'ngx-toastr';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';

describe('Component: PatientReminders', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockBackend,
                PatientReminderService,
                BaseRequestOptions,
                PatientService,
                PatientProgramService,
                RoutesProviderService,
                ProgramService,
                ProgramResourceService,
                ProgramWorkFlowResourceService,
                ProgramWorkFlowStateResourceService,
                PatientResourceService,
                LocalStorageService,
                PatientReminderResourceService,
                ProgramEnrollmentResourceService,
                EncounterResourceService,
                PatientRemindersComponent,
                {
                    provide: Http,
                    useFactory: (backendInstance: MockBackend,
                        defaultOptions: BaseRequestOptions) => {
                        return new Http(backendInstance, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                {
                    provide: AppFeatureAnalytics,
                    useClass: FakeAppFeatureAnalytics
                },
                AppSettingsService,
                ToastrService,
                Overlay,
                OverlayContainer
            ],
            imports: [ToastrModule.forRoot()]

        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should instantiate the component', (done) => {
        let component: PatientRemindersComponent = TestBed.get(PatientRemindersComponent);
        expect(component).toBeTruthy();
        done();

    });

    it('should have all the required functions defined and callable', (done) => {
        let component: PatientRemindersComponent = TestBed.get(PatientRemindersComponent);
        let reminders = [];
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        spyOn(component, 'getPatient').and.callThrough();
        component.getPatient();
        expect(component.getPatient).toHaveBeenCalled();
        spyOn(component, 'constructReminders').and.callThrough();
        component.constructReminders(reminders);
        expect(component.constructReminders).toHaveBeenCalled();

        done();

    });

});


class ToastrConfigMock {
    timeOut: number = 5000;
    closeButton: boolean = false;
    positionClass: string = 'toast-top-right';
    extendedTimeOut: number = 1000;
    constructor() {
    }

}

