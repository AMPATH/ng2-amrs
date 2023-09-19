import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxNewReportPatientListComponent } from './tx-new-report-patient-list.component';

describe('TxNewReportPatientListComponent', () => {
  let component: TxNewReportPatientListComponent;
  let fixture: ComponentFixture<TxNewReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxNewReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxNewReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
