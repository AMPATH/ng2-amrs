import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxMmdReportBaseComponent } from './tx-mmd-report-base.component';

describe('TxMmdReportBaseComponent', () => {
  let component: TxMmdReportBaseComponent;
  let fixture: ComponentFixture<TxMmdReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxMmdReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxMmdReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
