import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxNewReportBaseComponent } from './tx-new-report-base.component';

describe('TxNewReportBaseComponent', () => {
  let component: TxNewReportBaseComponent;
  let fixture: ComponentFixture<TxNewReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxNewReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxNewReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
