import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DataEntryStatisticsService } from './data-entry-statistics-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { LocalStorageService } from '../utils/local-storage.service';

const mockDataEntryTypes = [{
    id: 'view1',
    subType: 'by-date-by-encounter-type'
}, {
    id: 'view2',
    subType: 'by-month-by-encounter-type'
}, {
    id: 'view3',
    subType: 'by-provider-by-encounter-type'
}, {
    id: 'view4',
    subType: 'by-creator-by-encounter-type'
}];

const mockDataEntryResult = [{
    'date': '2017-11-26T21:00:00.000Z',
    'encounter_type': 'ADULTINITIAL',
    'encounter_type_id': '1',
    'encounter_type_uuid': '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f',
    'encounters_count': '21'
}];

const mockDataEntryPayload = {
    'subType': 'by-date-by-encounter-type',
    'startDate': '2017-11-01',
    'endDate': '2017-11-27',
    'locationUuids': '',
    'encounterTypeUuids': '',
    'formUuids': '',
    'providerUuid': '',
    'creatorUuid': '',
    'groupBy': 'encounter-type'

};

describe('Service :  Data Entry Statictics Service', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CacheModule],
            providers: [
                DataEntryStatisticsService,
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                CacheService,
                LocalStorageService,
                DataCacheService,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                    (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });
    });

    it('should be defined',
        inject([DataEntryStatisticsService], (d: DataEntryStatisticsService) => {
            expect(d).toBeTruthy();
        })
    );

    it('should call the correct data entry stats url',
        inject([DataEntryStatisticsService, MockBackend],
            (d: DataEntryStatisticsService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('data-entry-statistics');
                });
            })
    );
});
