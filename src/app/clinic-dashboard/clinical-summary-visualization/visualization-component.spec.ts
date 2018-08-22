/*
import { TestBed, async, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';

import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/'; from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { SelectModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/dist/components/select';
import { NgBusyModule } from 'ng-busy';

import {
  DashboardFiltersComponent
} from '../dashboard-filters/dashboard-filters.component';
import {
  DateRangeComponent
} from '../dashboard-filters/date-range/date-range.component';
import { GenderSelectComponent
} from '../dashboard-filters/gender-selector/gender-selector.component';
import { IndicatorSelectComponent
} from '../dashboard-filters/indicator-selector/indicator-selector.component';
import { RangeSliderComponent
} from '../dashboard-filters/range-slider/range-slider.component';
import {
  VisualizationComponent
} from '../clinical-summary-visualization/visualization-component';
import { ArtOverviewComponent } from './art-overview/art-overview.component';
import { Observable } from 'rxjs';
import { ChartModule } from 'angular2-highcharts';
import { AgGridModule } from 'ag-grid-angular';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, URLSearchParams } from '@angular/http';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../etl-api/clinical-summary-visualization-resource.service';
import {
  TabViewModule, FieldsetModule, ButtonModule, GrowlModule, PanelModule, AccordionModule
} from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { ClinicalSummaryVisualizationService
} from '../../hiv-care-lib/services/clinical-summary-visualization.service';
import { PatientStatusOverviewComponent
} from './patient-status-overview/patient-status-overview.component';
import { PatientStatusIndicatorDefComponent
} from './patient-status-overview/indicator-definition.component';
import { ArtOverviewIndicatorDefComponent } from './art-overview/indicator-definitions.component';
import { MaterialModule } from '@angular/material';

export class FakeClinicDashboardCacheService {
  public getCurrentClinic() {
    return of('');
  }

  public getByKey() {
    return '';
  }

  public add() {

  }
}

export class FakeClinicalSummaryVisualizationService {

  get generateTabularViewColumns(): Array<any> {
    return [{}];
  }

  public generateTableData(data): Array<any> {
    return [{}];
  }

  get translateColumns() {
    return {};
  }

  get flipTranlateColumns() {
    return {};
  }

  public getMonthDateRange(year: number, month: number): any {

    let startDate = moment([year, month]);
    let endDate = moment(startDate).endOf('month');
    return {
      startDate: startDate,
      endDate: endDate
    };
  }

}

export class FakeClinicalSummaryVisualizationResourceService {

  public getUrl(reportName): string {
    return 'url';
  }

  public getPatientListUrl(reportName): string {
    return 'patient-list';
  }

  public getUrlRequestParams(params): URLSearchParams {
    let urlParams: URLSearchParams = new URLSearchParams();
    return urlParams;
  }

  public getHivComparativeOverviewReport(params) {

    return of({});

  }

  public getReportOverviewPatientList(reportName: string, params: any) {
    return of({});
  }

  public getHivComparativeOverviewPatientList(params) {
    return of({});
  }

  public getArtOverviewReport(params) {
    return of({});
  }

  public getArtOverviewReportPatientList(params) {
    return of({});
  }

  public getPatientCareStatusReport(params) {
    return of({});
  }

  public getPatientCareStatusReportList(params) {
    return of({});
  }

}

describe('Component: VisualizationComponent', () => {
  let currentTestComponent: VisualizationComponent;
  let currentTestFixture;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardFiltersComponent,
        DateRangeComponent,
        ArtOverviewComponent,
        PatientStatusOverviewComponent,
        IndicatorSelectComponent,
        PatientStatusIndicatorDefComponent,
        ArtOverviewIndicatorDefComponent,
        RangeSliderComponent,
        GenderSelectComponent,
        VisualizationComponent
      ],
      imports: [
        FieldsetModule,
        ButtonModule,
        DateTimePickerModule,
        FormsModule,
        NgamrsSharedModule,
        CommonModule,
        AgGridModule,
        NgBusyModule,
        GrowlModule,
        PanelModule,
        TabViewModule,
        AccordionModule,
        DataListsModule,
        ChartModule.forRoot(require('highcharts')),
        MaterialModule,
        SelectModule
      ]
    }).overrideComponent(VisualizationComponent, {
      set: {
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          {
            provide: ClinicDashboardCacheService,
            useClass: FakeClinicDashboardCacheService
          },
          {
            provide: ClinicalSummaryVisualizationService,
            useClass: FakeClinicalSummaryVisualizationService
          },
          {
            provide: ClinicalSummaryVisualizationResourceService,
            useClass: FakeClinicalSummaryVisualizationResourceService
          },
          {
            provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          },
            deps: [MockBackend, BaseRequestOptions]
          },
          {provide: Router, useValue: mockRouter},
          {
            provide: ActivatedRoute,
            useValue: {parent: {params: of({id: 'testId'})}}
          },
          MockBackend,
          BaseRequestOptions
        ]
      }
    }).compileComponents().then(() => {
      currentTestFixture = TestBed.createComponent(VisualizationComponent);
      currentTestComponent = currentTestFixture.componentInstance;
    });

  }));

  it('should have a defined component', () => {
    expect(currentTestComponent).toBeDefined();
  });

  it('should update parent model when date changes', (done) => {
    let dateFixture = TestBed.createComponent(DateRangeComponent);
    let dateComponent = dateFixture.componentInstance;
    let dashboardFiltersFixture = TestBed.createComponent(DashboardFiltersComponent);
    let dashboardFiltersComponent = dashboardFiltersFixture.componentInstance;

    dateComponent.updateStartDate(moment([2016, 2, 23]).format());
    dateComponent.updateEndDate(moment([2017, 2, 23]).format());
    dateComponent.onDateChange.subscribe((v) => {
      setTimeout(() => {
        dashboardFiltersComponent.onDateChanged(v);
      }, 100);
    });
    dashboardFiltersComponent.options = {
      indicator_select: false,
      date_range: true,
      range_slider: false,
      gender_select: false
    };

    dashboardFiltersComponent.filterModelChange.subscribe((vv) => {
      setTimeout(() => {
        expect(moment(currentTestComponent.filterModel.startDate)
          .format('DD/MM/YYYY')).toBe('23/03/2016');
        expect(moment(currentTestComponent.filterModel.endDate)
          .format('DD/MM/YYYY')).toBe('23/03/2017');
        dashboardFiltersComponent.onDateChanged(vv);
        spyOn(currentTestComponent, 'renderCharts').and.callFake(() => {});
        currentTestComponent.renderCharts();
        expect(currentTestComponent.renderCharts).toHaveBeenCalled();
      }, 100);
    });

    done();
  });

});

*/
