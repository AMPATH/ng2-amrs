import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from '@angular/http';
import { FormsResourceService } from './forms-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';

// Load the implementations that should be tested

describe('FormResourceService Unit Tests', () => {
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
        FormsResourceService,
        LocalStorageService
      ],
    });
  }));

  it('should have getForms defined',
    inject([FormsResourceService],
      (formsResourceService: FormsResourceService) => {
        expect(formsResourceService.getForms()).toBeTruthy();
      }));

  it('should make API call with correct URL',
    inject([FormsResourceService, MockBackend], fakeAsync((formsResourceService: FormsResourceService, backend: MockBackend) => {
      backend.connections.subscribe((connection: MockConnection) => {

          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toContain('/ws/rest/v1/form?v=custom:(uuid,name,encounterType:' +
            '(uuid,name),version,published,retired,retiredReason,resources:(uuid,name,dataType,valueReference))&q=POC');
        });
        expect(formsResourceService.getForms());
      })));

  it('It should return an array of form object when getForms is invoked',
    inject([MockBackend, FormsResourceService],
      (backend: MockBackend, formsResourceService: FormsResourceService) => {
        // stubbing
        backend.connections.subscribe((connection: MockConnection) => {
          let options = new ResponseOptions({
            body: JSON.stringify({
              results: [
                {name: 'form1'},
                {name: 'form2'}
              ]
            })
          });
          connection.mockRespond(new Response(options));
        });

        formsResourceService.getForms()
          .subscribe((response) => {
            expect(response).toContain({name: 'form1'});
            expect(response).toBeDefined();
            expect(response.length).toBeGreaterThan(1);

          });
      }));

});
