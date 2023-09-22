import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlhivNcdReportPatientListComponent } from './plhiv-ncd-report-patient-list.component';

describe('PlhivNcdReportPatientListComponent', () => {
  let component: PlhivNcdReportPatientListComponent;
  let fixture: ComponentFixture<PlhivNcdReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlhivNcdReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlhivNcdReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
