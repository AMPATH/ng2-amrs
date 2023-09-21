import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdReportDashboardViewComponent } from './ncd-report-dashboard-view.component';

describe('NcdReportDashboardViewComponent', () => {
  let component: NcdReportDashboardViewComponent;
  let fixture: ComponentFixture<NcdReportDashboardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NcdReportDashboardViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdReportDashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
