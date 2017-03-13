import { TestBed, async, inject } from '@angular/core/testing';
import { FeedBackService } from './feedback.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import * as _ from 'lodash';
describe('FeedBackService', () => {
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FeedBackService,
                AppSettingsService,
                LocalStorageService,
                {
                    provide: Http, useFactory: (backend, options) => {
                        return new Http(backend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                MockBackend,
                BaseRequestOptions
            ]
        });
    });


    it('should be defined',
        inject([FeedBackService], (s: FeedBackService) => {
            expect(s).toBeDefined();
        })
    );
    it('should call the right url when postFeedback is called',
        inject([FeedBackService, AppSettingsService,
            MockBackend, Http], (feedbackService, appSettingsService, backend, http) => {
                let samplePayload = { phone: '070000000', message: 'message' };
                backend.connections.subscribe((connection: MockConnection) => {
                    let url = appSettingsService.getEtlServer() +
                        '/user-feedback';
                    expect(connection.request.url).toEqual(url);
                    let payload = JSON.parse(connection.request.getBody());
                    expect(payload).toEqual(samplePayload);
                    let mockResponse = new Response(new ResponseOptions({
                        body: [{ status: 'okay' }]
                    }));
                    connection.mockRespond(mockResponse);
                });

                feedbackService.postFeedback(samplePayload).subscribe(response => {
                    expect(response).toEqual([{ status: 'okay' }]);
                });
            }));
});
