import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { ClinicalNotesResourceService } from './clinical-notes-resource.service';


describe('Clinical notes Resource Service Unit Tests', () => {

  let backend: MockBackend, patientUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        ClinicalNotesResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([ClinicalNotesResourceService], (notesResourceService: ClinicalNotesResourceService) => {
      expect(notesResourceService).toBeTruthy();
    }));

  it('should make API call with the correct url parameters', () => {

    backend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch('/patient/(*)/clinical-notes');
      expect(connection.request.url).toContain('startIndex=');
      expect(connection.request.url).toContain('limit=10');

    });


  });

  it('should return the correct parameters from the api',
    async(inject([ClinicalNotesResourceService, MockBackend],
      (notesResourceService: ClinicalNotesResourceService, mockBackend: MockBackend) => {

        let mockResponse = new Response(new ResponseOptions({
          body: {
            notes: [],
            status: ''
          }
        }));

        mockBackend.connections.subscribe(c => c.mockRespond(mockResponse));

        notesResourceService.getClinicalNotes(patientUuid, 0, 10).subscribe((data: any) => {

          expect(data).toBeTruthy();
          expect(data.status).toBeDefined();
          expect(data.notes).toBeDefined();
          expect(data.notes.length).toEqual(0);

        });

      })));

  it('should return the correct parameters from the api',
    async(inject([ClinicalNotesResourceService, MockBackend],
      (notesResourceService: ClinicalNotesResourceService, mockBackend: MockBackend) => {

        mockBackend.connections.subscribe(c =>
          c.mockError(new Error('An error occured while processing the request')));

        notesResourceService.getClinicalNotes(patientUuid, 0, 10).subscribe((data) => { },
          (error: Error) => {
            expect(error).toBeTruthy();
          });
      })));

});
