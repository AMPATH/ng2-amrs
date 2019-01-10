/*import { of } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
// import { FakeAppSettingsService } from '../etl-api/moh-731-patientlist-resource.service.spec';
import { LocalStorageService } from '../utils/local-storage.service';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MOTDNotificationComponent } from './motd-notification.component';
import { MOTDNotificationService } from '../etl-api/motd.notification.service';
import { CookieService } from 'ngx-cookie';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Moment from 'moment';
import { CookieModule } from 'ngx-cookie';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  params = of([{ 'id': 1 }]);
}

const today = Moment().format('YYYY-MM-DD');

const motdNotifications = [
  {
    'message_id': 1,
    'message': 'Power will be cut off from 9am - 5pm',
    'title': 'Power Outage',
    'startDate': '2017-07-06T21:00:00.000Z',
    'expireTime': today + 'T21:00:00.000Z',
    'dateCreated': today + 'T08:38:38.000Z',
    'alert_type': 1,
    'alert_interval': 1
  },
  {
    'message_id': 2,
    'message': 'Release Meeting ate dev office 2',
    'title': 'Release Meeting',
    'startDate': '2017-07-09T21:00:00.000Z',
    'expireTime': today + 'T21:00:00.000Z',
    'dateCreated': '0000-00-00 00:00:00',
    'alert_type': 2,
    'alert_interval': 2
  },
  {
    'message_id': 3,
    'message': 'Release Meeting ate dev office 2',
    'title': 'Release Meeting',
    'startDate': '2017-07-09T21:00:00.000Z',
    'expireTime': today + 'T21:00:00.000Z',
    'dateCreated': '0000-00-00 00:00:00',
    'alert_type': 2,
    'alert_interval': 3
  },
  {
    'message_id': 4,
    'message': 'Release Meeting ate dev office 2',
    'title': 'Release Meeting',
    'startDate': '2017-07-09T21:00:00.000Z',
    'expireTime': today + 'T21:00:00.000Z',
    'dateCreated': '0000-00-00 00:00:00',
    'alert_type': 2,
    'alert_interval': 2
  }
];


/*describe('Component : MOTD Notification', () => {

  let comp: MOTDNotificationComponent;
  let fixture: ComponentFixture<MOTDNotificationComponent>;
  let nativeElement: any;
  // tslint:disable-next-line:prefer-const
  let httpMock: HttpTestingController;

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        CookieModule.forRoot(),
        HttpClientTestingModule,
      ],
      declarations: [MOTDNotificationComponent],
      providers: [
        CookieService,
        MOTDNotificationService,
        FakeAppSettingsService,
        LocalStorageService,
        AppSettingsService,
        MockRouter,
        MockActivatedRoute,
        HttpClientTestingModule,
        { provide: Router, useClass: MockRouter }, {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
      ]
    })
      .compileComponents();  // compile template and css
  }));



  beforeEach(() => {

    fixture = TestBed.createComponent(MOTDNotificationComponent);
    comp = fixture.componentInstance;
    nativeElement = fixture.nativeElement;


    // Service from the root injector
    const cookieService = fixture.debugElement.injector.get(CookieService);
    const motdService = fixture.debugElement.injector.get(MOTDNotificationService);
    const route = fixture.debugElement.injector.get(MockRouter);
    const activatedRoute = fixture.debugElement.injector.get(MockActivatedRoute);

  });

  afterAll(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('Should be create an instance of the component', async(() => {
    expect(comp).toBeDefined();
  }));

  it('Should call the get notification method ', async(() => {
    const spy = spyOn(comp, 'getMotdNotifications');
    fixture.detectChanges();
    expect(comp.getMotdNotifications).toHaveBeenCalled();
  }));
  it('Should dismiss notifications ', async(() => {
    const spy = spyOn(comp, 'dissmissNotification');
    fixture.detectChanges();
    expect(comp.displayNotifications.length).toEqual(0);
  }));

});
*/
