import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdReportPatientListComponent } from './ncd-report-patient-list.component';

describe('NcdReportPatientListComponent', () => {
  let component: NcdReportPatientListComponent;
  let fixture: ComponentFixture<NcdReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NcdReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
