import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvcSnapshotComponent } from './ovc-snapshot.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ZeroVlPipe } from 'src/app/shared/pipes/zero-vl-pipe';
import { HivSummaryResourceService } from 'src/app/etl-api/hiv-summary-resource.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { HivSummaryService } from '../../hiv/hiv-summary/hiv-summary.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('OvcSnapshotComponent', () => {
  let component: OvcSnapshotComponent;
  let fixture: ComponentFixture<OvcSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule
      ],
      providers: [
        ZeroVlPipe,
        PatientService,
        PatientResourceService,
        PatientProgramService,
        RoutesProviderService,
        ProgramService,
        ProgramResourceService,
        AppSettingsService,
        LocalStorageService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        HivSummaryService,
        HivSummaryResourceService,
      ],
      declarations: [ OvcSnapshotComponent, ZeroVlPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvcSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
