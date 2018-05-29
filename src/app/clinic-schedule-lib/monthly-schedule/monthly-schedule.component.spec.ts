
/* tslint:disable:no-unused-variable */

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { MonthlyScheduleBaseComponent } from './monthly-schedule.component';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MonthlyScheduleResourceService } from '../../etl-api/monthly-scheduled-resource.service';
import { BusyModule } from 'angular2-busy';
import { CalendarModule, CalendarDateFormatter } from 'angular-calendar';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { ClinicDashboardCacheService }
from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { AppSettingsService } from '../../app-settings';
import { LocalStorageService } from '../../utils/local-storage.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule,
  MdSlideToggleModule, MdDatepickerModule, MdNativeDateModule, MdDatepickerToggle
} from '@angular/material';
import {
  ProgramVisitEncounterSearchComponent
} from './../../program-visit-encounter-search/program-visit-encounter-search.component';
import { PatientProgramResourceService } from './../../etl-api/patient-program-resource.service';
import { AngularMultiSelectModule }
from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DepartmentProgramsConfigService }
from './../../etl-api/department-programs-config.service';
import { SelectDepartmentService
} from './../../program-visit-encounter-search/program-visit-encounter-search.service';
class DataStub {

  public getMonthlySchedule(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }

}
class ClinicDashboardCacheServiceStub {
  public getCurrentClinic() {
    return Observable.of('');
  }
}
let results = {
  'results': [
    {
      'date': '2017-02-01',
      'count': {
        'attended': 84,
        'scheduled': 102,
        'not_attended': 37,
        'has_not_returned': 23
      }
    },
    {
      'date': '2017-02-02',
      'count': {
        'attended': 93,
        'scheduled': 119,
        'not_attended': 33,
        'has_not_returned': 32
      }
    },
    {
      'date': '2017-02-03',
      'count': {
        'attended': 30,
        'scheduled': 27,
        'not_attended': 10,
        'has_not_returned': 11
      }
    },
    {
      'date': '2017-02-06',
      'count': {
        'attended': 61,
        'scheduled': 74,
        'not_attended': 22,
        'has_not_returned': 24
      }
    },
    {
      'date': '2017-02-07',
      'count': {
        'attended': 72,
        'scheduled': 89,
        'not_attended': 19,
        'has_not_returned': 29
      }
    },
    {
      'date': '2017-02-08',
      'count': {
        'attended': 96,
        'scheduled': 98,
        'not_attended': 19,
        'has_not_returned': 23
      }
    },
    {
      'date': '2017-02-09',
      'count': {
        'attended': 82,
        'scheduled': 86,
        'not_attended': 11,
        'has_not_returned': 30
      }
    },
    {
      'date': '2017-02-10',
      'count': {
        'attended': 29,
        'scheduled': 13,
        'not_attended': 3,
        'has_not_returned': 4
      }
    },
    {
      'date': '2017-02-13',
      'count': {
        'attended': 35,
        'scheduled': 81,
        'not_attended': 12,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-14',
      'count': {
        'scheduled': 117,
        'not_attended': 12,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-15',
      'count': {
        'scheduled': 109,
        'not_attended': 16,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-16',
      'count': {
        'scheduled': 126,
        'not_attended': 18,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-17',
      'count': {
        'scheduled': 24,
        'not_attended': 5,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-20',
      'count': {
        'scheduled': 65,
        'not_attended': 5,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-21',
      'count': {
        'scheduled': 110,
        'not_attended': 12,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-22',
      'count': {
        'scheduled': 102,
        'not_attended': 4,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-23',
      'count': {
        'scheduled': 107,
        'not_attended': 4,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-24',
      'count': {
        'scheduled': 17,
        'not_attended': 1,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-27',
      'count': {
        'scheduled': 73,
        'not_attended': 6,
        'has_not_returned': 0
      }
    },
    {
      'date': '2017-02-28',
      'count': {
        'scheduled': 111,
        'not_attended': 9,
        'has_not_returned': 0
      }
    }
  ]
};
class MockRouter {
 public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
 public params = Observable.of([{ 'id': 1 }]);
 public snapshot = {
    queryParams: { date: '' }
  };
}

describe('MonthlyScheduleComponent', () => {
  let fixture: ComponentFixture<MonthlyScheduleBaseComponent>;
  let comp: MonthlyScheduleBaseComponent;
  let dataStub: MonthlyScheduleResourceService;
  let patientProgramResourceService: PatientProgramResourceService;
  let departmentProgConfigService: DepartmentProgramsConfigService;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [BusyModule, CalendarModule.forRoot(),
       BrowserAnimationsModule, CacheModule, AngularMultiSelectModule ,
       FormsModule, MdTabsModule,
       MdProgressSpinnerModule,
       MdProgressBarModule,
       MdDatepickerModule,
       MdNativeDateModule,
       MdSlideToggleModule,
       NgxMyDatePickerModule,
       DateTimePickerModule
      ],
      declarations: [MonthlyScheduleBaseComponent, ProgramVisitEncounterSearchComponent],
      providers: [
        MonthlyScheduleResourceService,
        ClinicDashboardCacheService,
        PatientProgramResourceService,
        AppSettingsService,
        DepartmentProgramsConfigService,
        LocalStorageService,
        DataCacheService,
        SelectDepartmentService,
        CacheService,
        {
          provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        MockBackend,
        BaseRequestOptions
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MonthlyScheduleBaseComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(MonthlyScheduleResourceService);
        departmentProgConfigService = fixture.debugElement.injector.
        get( DepartmentProgramsConfigService);
      });
  }));

  it('should hit the success callback when getMonthlySchedule returns success', fakeAsync(() => {
    const spy = spyOn(dataStub, 'getMonthlySchedule').and.returnValue(
      Observable.of(results)
    );
    comp.getAppointments();
    fixture.detectChanges();
    // expect(comp.success).toEqual(true);
    expect(spy.calls.any()).toEqual(true);
  }));

  it('should hit the error callback when getMonthlySchedule returns an error', fakeAsync(() => {
    const spy = spyOn(dataStub, 'getMonthlySchedule').and.returnValue(
      Observable.throw({ error: '' })
    );
    comp.getAppointments();
    fixture.detectChanges();
    // expect(comp.error).toEqual(true);
    expect(spy.calls.any()).toEqual(true);
  }));

  it('should format events when processEvents is called', () => {
    let events = comp.processEvents(results.results);
    comp.dayClicked({ date: new Date(), events: [] });
    comp.dayClicked({ date: undefined, events: [] });
    fixture.detectChanges();
    expect(events[0].title).toEqual(84);
  });

});
