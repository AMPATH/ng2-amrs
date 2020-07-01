import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientGainsAndLosesPatientListComponent } from './patient-gains-and-loses-patient-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/clinic-dashboard/clinic-dashboard.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClinicDashboardComponent } from 'src/app/clinic-dashboard/clinic-dashboard.component';

describe('PatientGainsAndLosesPatientListComponent', () => {
  let component: PatientGainsAndLosesPatientListComponent;
  let fixture: ComponentFixture<PatientGainsAndLosesPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatientGainsAndLosesPatientListComponent,
        ClinicDashboardComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AppSettingsService, LocalStorageService],
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientGainsAndLosesPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
