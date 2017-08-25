import { MOTDNotificationService } from './motd.notification.service';
import { async, inject , TestBed } from '@angular/core/testing';
import {  BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';

describe('Service : Motd Notification Service Unit Tests', () => {

     beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [
                MOTDNotificationService,
                MockBackend,
                BaseRequestOptions,
                    {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                AppSettingsService,
                LocalStorageService
                ]

           });


      });

  let motdNotificationsResponse = {
    'results': [{
        'type': 'warning',
        'title': 'Power Outage',
        'message': 'Power will be cut off from 9am - 5pm',
        'id': '1',
        'startDate': '2017-07-07',
        'endDate': '2017-07-08',
        'recurring': true,
        'frequency': ''
    },
    {
        'type': 'info',
        'title': '',
        'message': 'Release Meeting',
        'id': '2',
        'startDate': '2017-07-07',
        'endDate': '2017-07-07',
        'recurring': true,
        'frequency': ''
    }
    ]
};


it('Should construct MOTDNotification Service', async(inject(
                 [MOTDNotificationService, MockBackend], (service, mockBackend) => {
                 expect(service).toBeDefined();
})));

describe('Get All MOTD Notification', () => {

    it('should hit right endpoint for getMotdNotification and get right response', async(inject(

           [MOTDNotificationService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                    .toContain('/etl/motdNotifications');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                });

                 service.getMotdNotification().subscribe(res => {
                         expect(res).toEqual(motdNotificationsResponse);
                });

     })));

});






});
