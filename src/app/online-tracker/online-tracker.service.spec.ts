/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import {  BaseRequestOptions, Http, HttpModule, Response,
  ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { SessionService } from '../openmrs-api/session.service';
import { OnlineTrackerService } from './online-tracker.service';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';

describe('Service: OnlineTracker', () => {
  let onlineTrackerService: OnlineTrackerService;
  let sessionServiceSpy: jasmine.SpyObj<SessionService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('SessionService', ['getSession']);
    TestBed.configureTestingModule({
      providers: [
        OnlineTrackerService,
        {
          provide: SessionService,
          useValue: spy
        },
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        LocalStorageService
      ]
    });
    onlineTrackerService = TestBed.get(OnlineTrackerService);
    sessionServiceSpy = TestBed.get(SessionService);
  });

  it('should create an instance', () => {
    expect(onlineTrackerService).toBeTruthy();
  });

  it('should get session when update online status is called', () => {
    onlineTrackerService.updateOnlineStatus();
    expect(sessionServiceSpy.getSession).toHaveBeenCalled();
  });
});
