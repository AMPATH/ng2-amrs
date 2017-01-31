import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from '@angular/http';
import { ErrorLogResourceService } from './error-log-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';

// Load the implementations that should be tested
describe('ErrorLogResourceService Unit Tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        ErrorLogResourceService,
        LocalStorageService
      ],
    });
  }));

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

  it('should Post Error with correct ReguestMethod and correct API call',
    inject([ErrorLogResourceService, MockBackend],
      fakeAsync((errorLogResourceService: ErrorLogResourceService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {

          expect(connection.request.method).toBe(RequestMethod.Post);
          expect(connection.request.url).toContain('/forms/error');
        });
        expect(errorLogResourceService.postFormError({ error: 'error' }));
      })));


});
