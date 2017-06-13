import { TestBed, async, inject } from '@angular/core/testing';
import {
    Http, BaseRequestOptions, RequestMethod,
    ConnectionBackend, Response, ResponseOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { FileUploadResourceService } from './file-upload-resource.service';

describe('FileUploadResourceService', () => {
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                ConnectionBackend,
                {
                    provide: Http, useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                FileUploadResourceService
            ]
        });
    });

    it('should upload file when upload is called', inject(
        [MockBackend, FileUploadResourceService],
        (backend: MockBackend, s: FileUploadResourceService) => {
            const urls = [];

            backend.connections.subscribe((connection: MockConnection) => {
                const req = connection.request;
                urls.push(req.url);
                if (req.method === RequestMethod.Get && req.url === '/enter/the/url') {
                    connection.mockRespond((new Response(
                        new ResponseOptions({
                            body: [
                                {
                                    image: 'uploaded-image'
                                }]
                        }
                        ))));
                }
            });

            s.upload({}).subscribe((response) => {
                expect(response.image).toBe('uploaded-image');
            });
        })
    );
});
