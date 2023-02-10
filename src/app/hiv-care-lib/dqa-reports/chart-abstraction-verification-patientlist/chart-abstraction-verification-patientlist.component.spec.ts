import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationChartAbstractionPatientlistComponent } from './chart-abstraction-verification-patientlist.component';

describe('VerificationChartAbstractionPatientlistComponent', () => {
  let component: VerificationChartAbstractionPatientlistComponent;
  let fixture: ComponentFixture<VerificationChartAbstractionPatientlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationChartAbstractionPatientlistComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      VerificationChartAbstractionPatientlistComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
