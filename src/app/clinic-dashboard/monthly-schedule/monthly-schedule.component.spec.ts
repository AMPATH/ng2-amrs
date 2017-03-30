/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { MonthlyScheduleComponent } from './monthly-schedule.component';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MonthlyScheduleResourceService } from '../../etl-api/monthly-scheduled-resource.service';
import { BusyModule } from 'angular2-busy';
import { CalendarModule, CalendarDateFormatter } from 'angular-calendar';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache/ionic-cache';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
  navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  params = Observable.of([{ 'id': 1 }]);
}

describe('MonthlyScheduleComponent', () => {
  let fixture: ComponentFixture<MonthlyScheduleComponent>;
  let comp: MonthlyScheduleComponent;
  let dataStub: MonthlyScheduleResourceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BusyModule, CalendarModule.forRoot()],
      declarations: [MonthlyScheduleComponent],
      providers: [
        MonthlyScheduleResourceService,
        ClinicDashboardCacheService,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
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
        fixture = TestBed.createComponent(MonthlyScheduleComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(MonthlyScheduleResourceService);
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
