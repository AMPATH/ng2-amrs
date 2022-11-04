import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelecareComponent } from './telecare.component';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { PatientProgramService } from 'src/app/patient-dashboard/programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from 'src/app/patient-dashboard/programs/program.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

describe('TelecareComponent', () => {
  let component: TelecareComponent;
  let fixture: ComponentFixture<TelecareComponent>;
  let obsResourceService: ObsResourceService;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ObsResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientService,
        RoutesProviderService,
        ProgramService,
        PatientProgramService,
        ProgramResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        EncounterResourceService,
        RoutesProviderService,
        TelecareComponent,
        {
          provide: PatientResourceService
        },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ],
      declarations: [TelecareComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecareComponent);
    obsResourceService = TestBed.get(ObsResourceService);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    const rowHtmlElements =
      fixture.debugElement.nativeElement.querySelectorAll('tbody tr');
    expect(rowHtmlElements.length).toBe(1);
    expect(rowHtmlElements[0].innerHTML).toContain('Add consent');
    expect(component).toBeTruthy();
  });
  it('should display values when call consent form is filled', () => {
    const clientConsentObs = {
      results: [
        {
          concept: {
            uuid: '9d9ccb6b-73ae-48dd-83f9-12c782ce6685',
            display: 'PATIENT CONSENT PROVIDED'
          },
          obsDatetime: '2020-05-20T15:04:35.000+0300',
          value: {
            display: 'NO'
          },
          encounter: {
            encounterDatetime: '2020-05-20T15:04:35.000+0300',
            encounterType: {
              uuid: '5a58f6f5-f5a6-47eb-a644-626abd83f83b'
            }
          }
        },
        {
          concept: {
            uuid: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
            display: 'FREETEXT GENERAL'
          },
          obsDatetime: '2020-05-20T15:04:35.000+0300',
          value: 'busy\n',
          encounter: {
            encounterDatetime: '2020-05-20T15:04:35.000+0300',
            encounterType: {
              uuid: '5a58f6f5-f5a6-47eb-a644-626abd83f83b'
            }
          }
        }
      ]
    };
    spyOn(obsResourceService, 'getObsPatientObsByConcepts').and.returnValue(
      Observable.of(clientConsentObs)
    );
    component.getClientConsent();
    fixture.detectChanges();
    const noConsentWarning =
      fixture.debugElement.nativeElement.querySelectorAll('.text-danger');
    const tdHtmlElements =
      fixture.debugElement.nativeElement.querySelectorAll('td');
    expect(tdHtmlElements.length).toEqual(5);
    expect(noConsentWarning).toBeDefined();
  });
  it('redirect to patient info when patient uuid is present', () => {
    component.patientUuid = 'd75a7c5a-8cea-419f-9e63-ecf8f1942c6b';
    component.fillConsentForm();
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });
  it('fails to redirect to patient info when patient uuid is present', () => {
    component.fillConsentForm();
    expect(router.navigate).toHaveBeenCalledTimes(0);
  });
});
