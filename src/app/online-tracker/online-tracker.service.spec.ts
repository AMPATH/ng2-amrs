
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { SessionService } from '../openmrs-api/session.service';
import { OnlineTrackerService } from './online-tracker.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
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
        AppSettingsService,
        LocalStorageService
      ]
    });
    onlineTrackerService = TestBed.get(OnlineTrackerService);
    sessionServiceSpy = TestBed.get(SessionService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(onlineTrackerService).toBeTruthy();
  });

  it('should get session when update online status is called', () => {
    onlineTrackerService.updateOnlineStatus();
    expect(sessionServiceSpy.getSession).toHaveBeenCalled();
  });
});
