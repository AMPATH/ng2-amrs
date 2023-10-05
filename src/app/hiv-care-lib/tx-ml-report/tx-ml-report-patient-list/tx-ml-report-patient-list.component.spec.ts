import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxMlReportPatientListComponent } from './tx-ml-report-patient-list.component';

describe('TxMlReportPatientListComponent', () => {
  let component: TxMlReportPatientListComponent;
  let fixture: ComponentFixture<TxMlReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxMlReportPatientListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxMlReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
