import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxCurrReportPatientListComponent } from './tx-curr-report-patient-list.component';

describe('TxCurrReportPatientListComponent', () => {
  let component: TxCurrReportPatientListComponent;
  let fixture: ComponentFixture<TxCurrReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxCurrReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxCurrReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
