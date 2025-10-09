import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAppointmentSummaryPatientListComponent } from './pre-appointment-summary-patient-list.component';

describe('PreAppointmentSummaryPatientListComponent', () => {
  let component: PreAppointmentSummaryPatientListComponent;
  let fixture: ComponentFixture<PreAppointmentSummaryPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreAppointmentSummaryPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      PreAppointmentSummaryPatientListComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
