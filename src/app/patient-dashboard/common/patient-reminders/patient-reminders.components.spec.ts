import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PatientRemindersComponent } from './patient-reminders.component';
import { PatientReminderService } from './patient-reminders.service';
import { PatientService } from '../../services/patient.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
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
import { UserDefaultPropertiesService } from '../../../user-default-properties';
import { Patient } from '../../../models/patient.model';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';

class MockPropertyService {
  getCurrentUserDefaultLocation() {
    return 'test location';
  }

  getLocations() {
    return (new BehaviorSubject(null)).asObservable();
  }

  getUserProperty() {
    return {};
  }
}

class MockProgramManagerService {
  editProgramEnrollments(theChange: string, patient: Patient, programs: any[], newLoc?) {
    return (new BehaviorSubject(null)).asObservable();
  }

  enrollPatient() {
    return (new BehaviorSubject(null)).asObservable();
  }
}

const patientProgramResourceService =
  jasmine.createSpyObj('PatientProgramResourceService', ['getAllProgramVisitConfigs']);

describe('Component: PatientReminders', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientReminderService,
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
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: UserDefaultPropertiesService,
          useClass: MockPropertyService
        },
        {
          provide: ProgramManagerService,
          useClass: MockProgramManagerService
        },
        {
          provide : PatientProgramResourceService,
          useValue : patientProgramResourceService
        },
        AppSettingsService,
        ToastrService,
        Overlay,
        OverlayContainer
      ],
      imports: [ToastrModule.forRoot(), HttpClientTestingModule]

    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    const component: PatientRemindersComponent = TestBed.get(PatientRemindersComponent);
    expect(component).toBeTruthy();
    done();

  });

  it('should have all the required functions defined and callable', (done) => {
    const component: PatientRemindersComponent = TestBed.get(PatientRemindersComponent);
    const reminders = [];
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
  timeOut = 5000;
  closeButton = false;
  positionClass = 'toast-top-right';
  extendedTimeOut = 1000;

  constructor() {
  }

}

