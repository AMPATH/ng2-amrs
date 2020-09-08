import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { SessionService } from './session.service';
import { LocalStorageService } from '../utils/local-storage.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

// Load the implementations that should be tested

describe('SessionService Unit Tests', () => {
  let sessionService: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [AppSettingsService, SessionService, LocalStorageService]
    });

    sessionService = TestBed.get(SessionService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(sessionService).toBeDefined();
  });

  it('it should return a server url', () => {
    expect(sessionService.getUrl()).toBeTruthy();
  });

  it('It should return a session', () => {
    const res = {
      authenticated: true,
      user: {}
    };

    const credentials: Object = {
      username: 'test',
      password: 'test'
    };

    sessionService.getSession(credentials).subscribe((response) => {
      expect(res.authenticated).toBe(true);
      expect(res.user).toBeTruthy();
    });

    const req = httpMock.expectOne(sessionService.getUrl());
    expect(req.request.method).toBe('GET');
    req.flush(res);
  });

  it('should delete a session', () => {
    const res = {
      authenticated: false,
      user: {}
    };
    sessionService.deleteSession().subscribe((response) => {
      expect(res.authenticated).toBe(false);
      expect(res.user).toBeTruthy();
    });

    const req = httpMock.expectOne(sessionService.getUrl());
    expect(req.request.method).toBe('DELETE');
    req.flush(res);
  });
});
