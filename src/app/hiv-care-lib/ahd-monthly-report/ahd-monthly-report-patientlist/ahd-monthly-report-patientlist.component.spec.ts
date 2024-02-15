import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhdMonthlyReportPatientlistComponent } from './ahd-monthly-report-patientlist.component';

describe('AhdMonthlyReportPatientlistComponent', () => {
  let component: AhdMonthlyReportPatientlistComponent;
  let fixture: ComponentFixture<AhdMonthlyReportPatientlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AhdMonthlyReportPatientlistComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhdMonthlyReportPatientlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
