import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxMmdReportPatientListComponent } from './tx-mmd-report-patient-list.component';

describe('TxMmdReportPatientListComponent', () => {
  let component: TxMmdReportPatientListComponent;
  let fixture: ComponentFixture<TxMmdReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxMmdReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxMmdReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
