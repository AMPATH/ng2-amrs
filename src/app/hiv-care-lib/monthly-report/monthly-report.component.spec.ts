import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportComponent } from './monthly-report.component';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/clinic-dashboard/clinic-dashboard.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClinicDashboardComponent } from 'src/app/clinic-dashboard/clinic-dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MonthlyReportComponent', () => {
  let component: MonthlyReportComponent;
  let fixture: ComponentFixture<MonthlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyReportComponent, ClinicDashboardComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a dashboard component', () => {
    component.dashboards = [
      { 'title': 'Monthly Report', 'description': 'PrEP Monthly Report', 'url': 'prep-report', 'icon': 'fa' }
    ];
    fixture.detectChanges();
    const appElement = fixture.nativeElement.querySelector('.card-item');
    expect(appElement.innerHTML).toContain('PrEP Monthly Report');
    expect(appElement.innerHTML).toContain('Monthly Report');
  });
});
