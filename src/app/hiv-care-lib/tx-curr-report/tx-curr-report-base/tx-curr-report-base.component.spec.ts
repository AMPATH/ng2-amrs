import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxCurrReportBaseComponent } from './tx-curr-report-base.component';

describe('TxCurrReportBaseComponent', () => {
  let component: TxCurrReportBaseComponent;
  let fixture: ComponentFixture<TxCurrReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxCurrReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxCurrReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
