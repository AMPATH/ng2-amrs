/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ClinicFlowComponent } from './clinic-flow.component';
import { ClinicFlowCacheService } from '../clinic-flow/clinic-flow-cache.service';

import { NgBusyModule, BusyConfig } from 'ng-busy';
import {
  Router,
  ActivatedRoute,
  Params,
  RouterModule,
  ChildrenOutletContexts
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  AccordionModule,
  DataTableModule,
  SharedModule,
  TabViewModule,
  GrowlModule,
  PanelModule,
  ConfirmDialogModule,
  ConfirmationService,
  DialogModule,
  InputTextModule,
  MessagesModule,
  InputTextareaModule,
  DropdownModule,
  ButtonModule,
  CalendarModule,
  ChartModule
} from 'primeng/primeng';
import { CacheService } from 'ionic-cache';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MatTabsModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import * as Moment from 'moment';
import { FakeClinicDashboardCacheService } from 'src/app/clinic-dashboard/dashboard-filters/dashboard-filters.component.spec';
import { ClinicFlowResource } from 'src/app/etl-api/clinic-flow-resource-interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClinicDashboardCacheService } from 'src/app/clinic-dashboard/services/clinic-dashboard-cache.service';
import { MockHivClinicFlowResourceService } from 'src/app/etl-api/hiv-clinic-flow-resource.service.mock';
import { DataListsModule } from 'src/app/shared/data-lists/data-lists.module';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { NgamrsSharedModule } from 'src/app/shared/ngamrs-shared.module';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { AppFeatureAnalytics } from 'src/app/shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from 'src/app/shared/app-analytics/app-feature-analytcis.mock';
import { HivClinicFlowResourceService } from 'src/app/etl-api/hiv-clinic-flow-resource.service';
import { ClinicFlowSummaryComponent } from './clinic-flow-summary.component';
import { ClinicFlowVisitsComponent } from './clinic-flow-visits.component';
import { ClinicFlowLocationStatsComponent } from './clinic-flow-location-stats.component';
import { ClinicFlowProviderStatsComponent } from './clinic-flow-provider-stats.component';
import { ClinicFlowHourlyStatsVizComponent } from './clinic-flow-hourly-stats-viz.component';
import { ChartComponent } from 'angular2-highcharts';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

class MockActivatedRoute {
  public params = Observable.of([{ id: 1 }]);
}

describe('Component: ClinicFlowComponent', () => {
  let component,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    clinicFlowCacheService: ClinicFlowCacheService,
    clinicFlowResource: ClinicFlowResource,
    fixture;

  let router: Router;
  // tslint:disable-next-line:prefer-const
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        ClinicDashboardCacheService,
        AppSettingsService,
        CacheService,
        DataCacheService,
        ClinicFlowCacheService,
        ChildrenOutletContexts,
        MockHivClinicFlowResourceService,
        {
          provide: 'ClinicFlowResource',
          useExisting: HivClinicFlowResourceService
        },
        {
          provide: HivClinicFlowResourceService,
          useClass: MockHivClinicFlowResourceService
        },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },

        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        {
          provide: AppFeatureAnalytics,
          useFactory: () => {
            return new FakeAppFeatureAnalytics();
          },
          deps: []
        }
      ],
      declarations: [
        ClinicFlowComponent,
        ClinicFlowSummaryComponent,
        ClinicFlowVisitsComponent,
        ClinicFlowLocationStatsComponent,
        ClinicFlowProviderStatsComponent,
        ClinicFlowHourlyStatsVizComponent,
        ChartComponent
      ],
      imports: [
        NgBusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        NgamrsSharedModule,
        NgxMyDatePickerModule.forRoot(),
        MatTabsModule,
        CommonModule,
        RouterModule,
        HttpClientTestingModule,
        ChartModule,
        Angulartics2Module,
        RouterModule
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ClinicFlowComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    clinicFlowCacheService = TestBed.get(ClinicFlowCacheService);
    clinicFlowResource = TestBed.get(HivClinicFlowResourceService);
    clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
    router = TestBed.get(Router);
    router = TestBed.get(Router);

    component = new ClinicFlowComponent(
      clinicFlowCacheService,
      activatedRoute,
      clinicFlowResource
    );
    expect(component).toBeTruthy();
  });

  it('should have required properties', (done) => {
    expect(component.ngOnInit).toBeDefined();
    done();
  });

  it('should set active tab when ngOnInit is  ' + ' is invoked', (done) => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    done();
  });
});
