import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Moh731ReportPatientListComponent } from './moh731-report-patient-list.component';

describe('Moh731ReportPatientListComponent', () => {
  let component: Moh731ReportPatientListComponent;
  let fixture: ComponentFixture<Moh731ReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Moh731ReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Moh731ReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
