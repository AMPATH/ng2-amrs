import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelecareComponent } from './telecare.component';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';

describe('TelecareComponent', () => {
  let component: TelecareComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        PatientService,
        ObsResourceService,
        AppSettingsService
      ],
      declarations: [ TelecareComponent ]
    });
    component = TestBed.get(TelecareComponent);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
