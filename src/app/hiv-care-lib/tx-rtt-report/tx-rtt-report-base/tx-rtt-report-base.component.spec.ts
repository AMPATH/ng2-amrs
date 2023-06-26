import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxRttReportBaseComponent } from './tx-rtt-report-base.component';

describe('TxRttReportBaseComponent', () => {
  let component: TxRttReportBaseComponent;
  let fixture: ComponentFixture<TxRttReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxRttReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxRttReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
