import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxMlReportBaseComponent } from './tx-ml-report-base.component';

describe('TxMlReportBaseComponent', () => {
  let component: TxMlReportBaseComponent;
  let fixture: ComponentFixture<TxMlReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxMlReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxMlReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
