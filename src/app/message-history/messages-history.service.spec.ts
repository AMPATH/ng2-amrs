
import { MessagesHistoryService } from './messages-history.service';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, XHRBackend } from '@angular/http';
import { MockBackend,  MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from './../utils/local-storage.service';
describe('MessagesHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: Http,
        useFactory: (backend, options) => {
          return new Http(backend, options);
        },
        deps: [MockBackend, BaseRequestOptions]
      }, MockBackend,
    BaseRequestOptions,
  MessagesHistoryService,
  AppSettingsService,
  LocalStorageService
]
    });
  });

  it('should be created', inject([MessagesHistoryService, AppSettingsService, MockBackend, Http],
    (service, appSettingsService, backend, http) => {
        backend.connections.subscribe((connection: MockConnection) => {
            let url = appSettingsService.getEtlServer() +
                '/poc-user-feedback/1000/1501770200.477992';
            expect(connection.request.url).toEqual(url);

    // expect(service).toBeTruthy();
        });
    }));
    });
