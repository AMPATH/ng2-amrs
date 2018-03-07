import { Observable } from 'rxjs';
import { TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ProgramsComponent } from './programs.component';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../models/patient.model';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { ProgramService } from './program.service';
import { AppSettingsService } from '../../app-settings';
import { LocalStorageService } from '../../utils/local-storage.service';
import { BusyModule, BusyConfig } from 'angular2-busy';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import {
  ProgramEnrollmentResourceService
}
  from '../../openmrs-api/program-enrollment-resource.service';

import {
  ProgramResourceService
}
  from '../../openmrs-api/program-resource.service';

import {
  FakeProgramEnrollmentResourceService
}
  from '../../openmrs-api/program-enrollment-resource.service.mock';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
class LocationStub {

  public getLocations(payload): Observable<any> {
    return Observable.of({status: 'okay'});
  }
}
import { HivProgramSnapshotComponent
} from '../hiv/program-snapshot/hiv-program-snapshot.component';
import { PatientProgramService } from './patient-programs.service';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { ZeroVlPipe } from './../../shared/pipes/zero-vl-pipe';
describe('Component: ProgramsComponent', () => {
  let patientService: PatientService, locationResourceService: LocationResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component,
    programService: ProgramService, fixture, componentInstance;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        ProgramService,
        PatientResourceService,
        ProgramResourceService,
        PatientProgramService,
        RoutesProviderService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        LocalStorageService,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: LocationResourceService,
          useClass: LocationStub
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
          return new FakeAppFeatureAnalytics();
        }, deps: []
        },
        {
          provide: ProgramEnrollmentResourceService, useFactory: () => {
          return new FakeProgramEnrollmentResourceService(null, null);
        }, deps: []

        }],
      declarations: [ProgramsComponent, HivProgramSnapshotComponent, ZeroVlPipe],
      imports: [BusyModule, FormsModule,
        DialogModule,
        CalendarModule, BrowserAnimationsModule]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProgramsComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    patientService = TestBed.get(PatientService);
    programService = TestBed.get(ProgramService);
    locationResourceService = TestBed.get(LocationResourceService);
    let programComponent = new ProgramsComponent(fakeAppFeatureAnalytics,
      patientService, programService, locationResourceService);
    expect(programComponent).toBeTruthy();
  });

  it('should have required properties', (done) => {

    expect(component.enrolledProgrames.length).toBe(0);
    expect(component.patients).toBeDefined;
    expect(component.loadingPatientPrograms).toBeDefined();
    expect(component.loadProgramsPatientIsEnrolledIn).toBeDefined();
    expect(component.subscribeToEnrollmentChangeEvent).toBeDefined();
    expect(component.subscribeToPatientChangeEvent).toBeDefined();
    expect(component.openNewEnrollmentDialog).toBeDefined();
    expect(component.enrollToProgram).toBeDefined();
    expect(component.updateEnrollment).toBeDefined();
    expect(component.errors.length).toBe(0);
    expect(component.programsBusy).toEqual(false);
    expect(component.errorMessage).toBeDefined();
    expect(component.hasError).toEqual(false);
    expect(component.dateEnrolled).toEqual(undefined);
    expect(component.dateCompleted).toEqual(undefined);
    expect(component.displayDialog).toEqual(false);

    done();

  });

  it('should fetch patient program enrollment when patient changes', (done) => {
    patientService = TestBed.get(PatientService);
    let spy = spyOn(component, 'loadProgramsPatientIsEnrolledIn').and.callThrough();
    // console.log('spy', spy);
    // console.log('component', component);
    patientService.currentlyLoadedPatient.next(new Patient({person: {uuid: 'new-uuid'}}));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('new-uuid');
    done();
  });

});


