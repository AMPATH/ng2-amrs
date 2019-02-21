import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataEntryStatisticsService } from './data-entry-statistics-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}
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
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CacheModule, HttpClientTestingModule],
            providers: [
                DataEntryStatisticsService,
                AppSettingsService,
                CacheService,
                LocalStorageService,
                DataCacheService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined',
        inject([DataEntryStatisticsService], (d: DataEntryStatisticsService) => {
            expect(d).toBeTruthy();
        })
    );
});
