import { TestBed, async, inject } from '@angular/core/testing';
import { FeedBackService } from './feedback.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserDefaultPropertiesService }
    from '../user-default-properties/user-default-properties.service';
import * as _ from 'lodash';
import { UserService } from '../openmrs-api/user.service';
class UserServiceStub {
    person = {
        display: 'test persion'
    };
    getLoggedInUser() {
        return {
            person: this.person
        };
    }
}
describe('FeedBackService', () => {
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FeedBackService,
                UserService,
                AppSettingsService,
                UserDefaultPropertiesService,
                LocalStorageService,
                { provide: UserService, useClass: UserServiceStub },
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

    afterAll(() => {
        TestBed.resetTestingModule();
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
                backend.connections.take(1).subscribe((connection: MockConnection) => {
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

                feedbackService.postFeedback(samplePayload).take(1).subscribe(response => {
                    expect(response).toEqual([{ status: 'okay' }]);
                });
            }));
});
