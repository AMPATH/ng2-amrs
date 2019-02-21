import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ErrorLogResourceService } from './error-log-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

// Load the implementations that should be tested
describe('ErrorLogResourceService Unit Tests', () => {
  let s, httpMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        ErrorLogResourceService,
        LocalStorageService
      ],
    });
    s = TestBed.get(ErrorLogResourceService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should have service defined',
    inject([ErrorLogResourceService],
      (errorLogResourceService: ErrorLogResourceService) => {
        expect(errorLogResourceService).toBeDefined();
      }));

  it('should have postFormError defined',
    inject([ErrorLogResourceService],
      (errorLogResourceService: ErrorLogResourceService) => {
        expect(errorLogResourceService.postFormError({})).toBeTruthy();
      }));

  it('should Post Error with correct ReguestMethod and correct API call', () => {
    expect(s.postFormError({ error: 'error' }));
    const req = httpMock.expectNone('');
  });
});
