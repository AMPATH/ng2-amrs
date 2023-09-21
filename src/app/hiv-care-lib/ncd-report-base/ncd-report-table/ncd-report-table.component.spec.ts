import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdReportTableComponent } from './ncd-report-table.component';

describe('NcdReportTableComponent', () => {
  let component: NcdReportTableComponent;
  let fixture: ComponentFixture<NcdReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NcdReportTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
