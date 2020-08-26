import { IptBaseReportComponent } from './ipt-report-base.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IptReportService } from 'src/app/etl-api/ipt-report.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ReportFilterComponent } from 'src/app/reporting-utilities/report-filter/report-filter.component';
import { IptTabularReportComponent } from './ipt-report-tabular.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

const mockParams = {
  locationUuids: 'uuid1',
  endDate: '2020-06-30',
};
class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe').and.returnValue(of(mockParams)),
  },
};

describe('IptBaseReportComponent', () => {
  let component: IptBaseReportComponent;
  let fixture: ComponentFixture<IptBaseReportComponent>;
  let iptReportService: IptReportService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        IptBaseReportComponent,
        ReportFilterComponent,
        IptTabularReportComponent,
      ],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ locationUuids: '', endDate: new Date() }) },
        },
        { provide: [IptReportService] },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(IptBaseReportComponent);
    component = fixture.componentInstance;

    iptReportService = TestBed.get(IptReportService);
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should have a defined component', (done) => {
    pending();
  });

  it('should render component properties correctly', () => {
    pending();
  });

  it('should display the patient list correctly', () => {
    pending();
  });

  it('should display error message when response an error occurs while loading the data', () => {
    pending();
  });
});
