import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/of';
import { FormsModule } from '@angular/forms';

import { DefaulterListComponent } from './defaulter-list.component';

import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { DefaulterListResourceService } from '../../../etl-api/defaulter-list-resource.service';

// mock the child componnents so that we don't import them and their dependancies

@Component({
  selector: 'patient-list',
  template: `<p></p>`
})
export class MockPatientListComponent {
  @Input() data: any;
  @Input() extraColumns: any;
}

@Component({
  selector: 'app-defaulter-list-filter',
  template: `<p></p>`
})
export class MockDefaulterListFilterComponent {
  @Input() public currentLocation: string;
  @Output() public resetFilter: EventEmitter<Boolean> = new EventEmitter<
    Boolean
  >();
}

const mockClinic = 'uuid';
const mockDefaulterListResult = [
  {
    person_id: 1,
    filed_id: '07-80-57-53-3',
    days_since_rtc: 5,
    program: 'HIV DIFFERENTIATED CARE PROGRAM',
    rtc_date: '2021-10-14',
    patient_uuid: 'uuid1',
    uuid: 'uuid1',
    gender: 'M',
    birthdate: '1976-12-31',
    age: 44,
    person_name: 'Test Patient 1',
    identifiers: '123-456',
    phone_number: '0711234567',
    latest_rtc_date: '2021-10-14',
    latest_vl: 353,
    latest_vl_date: '2019-10-17',
    last_appointment: '2021-08-19 ADULTRETURN',
    cur_meds: 'LAMIVUDINE, TENOFOVIR, DOLUTEGRAVIR',
    previous_vl: 613,
    previous_vl_date: '2016-08-11',
    nearest_center: 'Test Location'
  },
  {
    person_id: 2,
    filed_id: null,
    days_since_rtc: 8,
    program: 'STANDARD HIV TREATMENT',
    rtc_date: '2021-10-11',
    patient_uuid: 'uuid2',
    uuid: 'uuid2',
    gender: 'F',
    birthdate: '2004-04-08',
    age: 17,
    person_name: 'Test Patient 2',
    identifiers: '456-789',
    phone_number: '0722987654',
    latest_rtc_date: '2021-10-11',
    latest_vl: 43,
    latest_vl_date: '2021-03-03',
    last_appointment: '2021-07-19 YOUTHRETURN',
    cur_meds: 'LAMIVUDINE, TENOFOVIR, DOLUTEGRAVIR',
    previous_vl: 178,
    previous_vl_date: '2020-04-20',
    nearest_center: 'Test Location 2'
  }
];
const mockParams = {
  maxDefaultPeriod: 0,
  minDefaultPeriod: 100,
  locationUuids: 'luuid'
};
interface MockReportParamsType {
  maxDefaultPeriod: number;
  minDefaultPeriod: number;
  locationUuids: string;
}
class MockClinicDashboardCacheService {
  getCurrentClinic(): Observable<any> {
    return Observable.of(mockClinic);
  }
}

export class MockActivatedRoute {
  queryParams(): Observable<any> {
    return Observable.of({
      locationUuids: 'luuid',
      maxDefaultPeriod: 0,
      minDefaultPeriod: 10
    });
  }
}

describe('Defaulterlist Component', () => {
  let component: DefaulterListComponent;
  let fixture: ComponentFixture<DefaulterListComponent>;
  let route: ActivatedRoute;
  let clinicDashboardCacheService: ClinicDashboardCacheService;
  // let defaulterListResource: DefaulterListResourceService;
  let defaulterListResourceServiceSpy: jasmine.SpyObj<DefaulterListResourceService>;

  beforeEach(async(() => {
    const defaulterListResourcespy = jasmine.createSpyObj(
      'DefaulterListResourceService',
      ['getDefaulterList']
    );
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        {
          provide: ClinicDashboardCacheService,
          useClass: MockClinicDashboardCacheService
        },
        {
          provide: DefaulterListResourceService,
          useValue: defaulterListResourcespy
        },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        }
      ],
      declarations: [
        DefaulterListComponent,
        MockDefaulterListFilterComponent,
        MockPatientListComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DefaulterListComponent);
        component = fixture.componentInstance;
        clinicDashboardCacheService = fixture.debugElement.injector.get<
          ClinicDashboardCacheService
        >(ClinicDashboardCacheService);
        defaulterListResourceServiceSpy = fixture.debugElement.injector.get<
          DefaulterListResourceService
        >(DefaulterListResourceService) as jasmine.SpyObj<
          DefaulterListResourceService
        >;
        route = fixture.debugElement.injector.get(ActivatedRoute);
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the defaulter list component', () => {
    expect(component).toBeDefined();
  });
  it('should return the correct report params and in the correct format', () => {
    component.params = mockParams;
    component.locationUuids = 'luuid2';
    const reportParams: MockReportParamsType = component.getReportParams();
    expect(JSON.stringify(reportParams)).toBe(
      JSON.stringify({
        maxDefaultPeriod: 0,
        minDefaultPeriod: 100,
        locationUuids: 'luuid2'
      })
    );
  });
  it('getDefaulterMethod should call defaulter service and retur actual value', (done: DoneFn) => {
    defaulterListResourceServiceSpy.getDefaulterList.and.returnValue(
      Observable.of(mockDefaulterListResult)
    );
    component.params = mockParams;
    component.locationUuids = 'luuid2';
    component.getDefaulterList();
    expect(defaulterListResourceServiceSpy.getDefaulterList.calls.count()).toBe(
      1,
      'defaulterListResourceServiceSpy method was called once'
    );
    const params = component.getReportParams();
    defaulterListResourceServiceSpy
      .getDefaulterList(params)
      .subscribe((defaulters) => {
        expect(defaulters).toEqual(
          mockDefaulterListResult,
          'expected defaulters'
        );
        done();
      }, done.fail);
  });
  it('should clear patient data on filter reset', () => {
    component.resetFilter(true);
    expect(component.defaulterList.length).toBe(0);
  });
});
