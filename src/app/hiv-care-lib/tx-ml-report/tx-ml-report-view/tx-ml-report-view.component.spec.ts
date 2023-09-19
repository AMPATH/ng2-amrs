import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxMlReportViewComponent } from './tx-ml-report-view.component';

describe('TxMlReportViewComponent', () => {
  let component: TxMlReportViewComponent;
  let fixture: ComponentFixture<TxMlReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxMlReportViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxMlReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
