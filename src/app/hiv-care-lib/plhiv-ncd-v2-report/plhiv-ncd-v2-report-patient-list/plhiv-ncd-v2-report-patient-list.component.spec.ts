import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlhivNcdV2ReportPatientListComponent } from './plhiv-ncd-v2-report-patient-list.component';

describe('PlhivNcdV2ReportPatientListComponent', () => {
  let component: PlhivNcdV2ReportPatientListComponent;
  let fixture: ComponentFixture<PlhivNcdV2ReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlhivNcdV2ReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlhivNcdV2ReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
