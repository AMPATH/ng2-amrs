import { MOTDNotificationService } from './motd.notification.service';
import { async, inject, TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service : Motd Notification Service Unit Tests', () => {
    let service, httpMock;
    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                MOTDNotificationService,
                AppSettingsService,
                LocalStorageService
            ]

        });
        service = TestBed.get(MOTDNotificationService);
        httpMock = TestBed.get(HttpTestingController);

    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    const motdNotificationsResponse = {
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


    it('Should construct MOTDNotification Service', async(() => {
        expect(service).toBeDefined();
    }));

    describe('Get All MOTD Notification', () => {

        it('should hit right endpoint for getMotdNotification and get right response', async(() => {

            service.getMotdNotification().subscribe(res => {
                expect(res).toEqual(motdNotificationsResponse);
            });

            const req = httpMock.expectOne(service.geturl() + 'motdNotifications');
            expect(req.request.method).toBe('GET');
            expect(req.request.urlWithParams)
                .toContain('/etl/motdNotifications');
            req.flush(motdNotificationsResponse);

        }));

    });
});
