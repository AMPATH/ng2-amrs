import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { PatientGainsAndLosesComponent } from './patient-gains-and-loses.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/clinic-dashboard/clinic-dashboard.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClinicDashboardComponent } from 'src/app/clinic-dashboard/clinic-dashboard.component';
import { ClinicDashboardCacheService } from './../../clinic-dashboard/services/clinic-dashboard-cache.service';

describe('PatientGainsAndLosesComponent', () => {
  let component: PatientGainsAndLosesComponent;
  let fixture: ComponentFixture<PatientGainsAndLosesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientGainsAndLosesComponent, ClinicDashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        AppSettingsService,
        LocalStorageService,
        ClinicDashboardCacheService
      ],
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientGainsAndLosesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
