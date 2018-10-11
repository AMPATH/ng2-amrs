
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { ConceptResourceService } from './concept-resource.service';
// Load the implementations that should be tested

describe('Service : ConceptResourceService Unit Tests', () => {

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
        LocalStorageService,
        ConceptResourceService
      ],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([ConceptResourceService],
      (conceptResourceService: ConceptResourceService) => {
        expect(conceptResourceService).toBeTruthy();
      }));

  it('should return a concept when the correct uuid is provided', (done) => {

    let conceptResourceService: ConceptResourceService = TestBed.get(ConceptResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let conceptUuid = 'a8945ba0-1350-11df-a1f1-0026b9348838';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('concept/' + conceptUuid);
      expect(connection.request.url).toContain('v=');
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

    conceptResourceService.getConceptByUuid(conceptUuid)
      .subscribe((response) => {
        done();
      });
  });
  it('should return a list of concepts a matching search string  provided', (done) => {

    let conceptResourceService: ConceptResourceService = TestBed.get(ConceptResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let searchText = 'test';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('q=' + searchText);
      expect(connection.request.url).toContain('v=');

      let options = new ResponseOptions({
        body: JSON.stringify({
          results: [
            {
              uuid: 'uuid',
              conceptClass: {
                uuid: 'uuid',
                description: 'acquired',
                display: 'test'
              },
              name: {
                conceptNameType: 'conceptNameType',
                display: 'BRUCELLA TEST'
              }
            }
          ]
        })
      });
      connection.mockRespond(new Response(options));
    });

    conceptResourceService.searchConcept(searchText)
      .subscribe((data) => {
        expect(data.length).toBeGreaterThan(0);
        done();
      });

  });

});
