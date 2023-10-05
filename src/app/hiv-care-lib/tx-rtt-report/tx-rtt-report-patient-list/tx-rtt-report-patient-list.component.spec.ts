import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxRttReportPatientListComponent } from './tx-rtt-report-patient-list.component';

describe('TxRttReportPatientListComponent', () => {
  let component: TxRttReportPatientListComponent;
  let fixture: ComponentFixture<TxRttReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxRttReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxRttReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
