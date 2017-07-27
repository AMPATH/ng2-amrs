/*

/!* tslint:disable:no-unused-variable *!/

import { TestBed, async } from '@angular/core/testing';
import { ClinicFlowComponent } from './clinic-flow.component';
import { ClinicDashboardCacheService }
  from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import { ClinicFlowCacheService } from '../clinic-flow/clinic-flow-cache.service';

import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { BusyModule, BusyConfig } from 'angular2-busy';
import {
  Router, ActivatedRoute, Params,
  RouterModule, RouterOutletMap
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DataListsModule } from '../data-lists/data-lists.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MdTabsModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';
import { MockHivClinicFlowResourceService } from '../etl-api/hiv-clinic-flow-resource.service.mock';
import * as Moment from 'moment';
import {
  HivClinicFlowResourceService
} from
  '../etl-api/hiv-clinic-flow-resource.service';
import { Observable } from 'rxjs/Rx';

describe('Component: ClinicFlowComponent', () => {
  let fakeAppFeatureAnalytics: AppFeatureAnalytics, component,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    clinicFlowCacheService: ClinicFlowCacheService,
    clinicFlowResource: ClinicFlowResource, router: Router, fixture, componentInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        ClinicDashboardCacheService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        LocalStorageService,
        CacheService,
        DataCacheService,
        ClinicFlowCacheService,
        RouterOutletMap,
        {
          provide: 'ClinicFlowResource',
          useExisting: HivClinicFlowResourceService
        },
        {
          provide: HivClinicFlowResourceService,
          useClass: MockHivClinicFlowResourceService
        },

        {
          provide: Router,
          useClass: class { navigate = jasmine.createSpy('navigate'); }
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
            defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }

      ],
      declarations: [ClinicFlowComponent],
      imports: [BusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        NgamrsSharedModule,
        NgxMyDatePickerModule,
        NgxMyDatePickerModule,
        MdTabsModule,
        CommonModule, Angulartics2Module,
        RouterModule,
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
      clinicFlowCacheService, router, clinicFlowResource
    );
    expect(component).toBeTruthy();
  });

  it('should have required properties', (done) => {
    expect(component.tabLinks.length).toBe(4);
    expect(component.activeLinkIndex).toBeDefined;
    expect(component.ngOnInit).toBeDefined();
    expect(component.setActiveTab).toBeDefined();
    done();

  });

  it('should set active tab when ngOnInit is  '
    + ' is invoked',
    (done) => {
      spyOn(component, 'ngOnInit').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();

      spyOn(component, 'setActiveTab').and.callThrough();
      component.setActiveTab();
      expect(component.setActiveTab).toHaveBeenCalled();
      done();
    });


});
*/
