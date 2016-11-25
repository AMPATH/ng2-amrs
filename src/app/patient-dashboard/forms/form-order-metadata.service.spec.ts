import { TestBed, async, inject } from '@angular/core/testing';
import {
    BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod, ResponseType
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { FormOrderMetaDataService } from './form-order-metadata.service';
import { LocalStorageService } from '../../utils/local-storage.service';
class MockError extends Response implements Error {
    name: any;
    message: any;
}
describe('Form Order Metadata Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                FormOrderMetaDataService,
                MockBackend,
                LocalStorageService,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            imports: [
                HttpModule
            ]
        });
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be defined',
        inject([FormOrderMetaDataService], (service: FormOrderMetaDataService) => {
            expect(service).toBeTruthy();
        })
    );
    describe('Favorite Helper functions', () => {
        it('should be favorite a form when setFavouriteForm is called',
            inject([FormOrderMetaDataService], (service: FormOrderMetaDataService) => {
                service.setFavouriteForm('form1');
                let favorites = JSON.parse(localStorage.getItem('formNames'));
                expect(favorites).toBeTruthy();
                expect(favorites[0].name).toBe('form1');
            })
        );
        it('should return a list of favorites when getFavouriteForm is called',
            inject([FormOrderMetaDataService], (service: FormOrderMetaDataService) => {
                localStorage.setItem('formNames',
                    JSON.stringify([{ name: 'form1' }, { name: 'form2' }]));
                let favorites = service.getFavouriteForm();
                expect(favorites).toBeTruthy();
                expect(favorites[0].name).toBe('form1');
            })
        );
        it('should return an empty list if no favorites are set when getFavouriteForm is called',
            inject([FormOrderMetaDataService], (service: FormOrderMetaDataService) => {
                let favorites = service.getFavouriteForm();
                expect(favorites).toBeTruthy();
                expect(favorites.length).toBe(0);
            })
        );

        it('should remove a favorite when removeFavouriteForm',
            inject([FormOrderMetaDataService], (service: FormOrderMetaDataService) => {
                localStorage.setItem('formNames',
                    JSON.stringify([{ name: 'form1' }, { name: 'form2' }]));
                service.removeFavouriteForm('form1');
                let favorites = service.getFavouriteForm();
                expect(favorites).toBeTruthy();
                expect(favorites.length).toBe(1);
            })
        );

    });

    describe('get form order metadata', () => {
        let forms = [
            {
                'name': 'Ampath POC Triage Encounter Form'
            },
            {
                'name': 'AMPATH POC Adult Return Visit Form'
            },
            {
                'name': 'AMPATH POC Resistance Clinic Encounter Form'
            },
            {
                'name': 'AMPATH POC Pediatric Return Visit Form'
            }];
        it('should call the right endpoint', async(inject(
            [FormOrderMetaDataService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toBe('./assets/schemas/form-order.json');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(forms) })));
                });

                const result = service.getDefaultFormOrder();
            })));
        it('should parse response of the forms metadata', async(inject(
            [FormOrderMetaDataService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(forms) })));
                });

                const result = service.getDefaultFormOrder();

                result.subscribe(res => {
                    expect(res).toBeDefined();
                });
            })));

        it('should parse errors', async(inject(
            [FormOrderMetaDataService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.getDefaultFormOrder();

                result.subscribe(res => {
                }, (err) => {
                    expect(err.status).toBe(404);
                });
            })));
    });
});

