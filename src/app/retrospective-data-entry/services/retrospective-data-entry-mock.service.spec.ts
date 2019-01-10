import { TestBed, async } from '@angular/core/testing';
import {FakeRetrospectiveDataEntryService } from './retrospective-data-entry-mock.service';
import { UserDefaultPropertiesService} from '../../user-default-properties/user-default-properties.service';
import { UserService } from '../../openmrs-api/user.service';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from '../../utils/session-storage.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
describe('Service: FakeRetrospectiveDataEntry', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
            FakeRetrospectiveDataEntryService ,
            UserDefaultPropertiesService,
            UserService,
            SessionStorageService,
            AppSettingsService,
            LocalStorageService,
            {
                provide: HttpClient,
            }
        ]
      });
    });
    afterEach(() => {
      TestBed.resetTestingModule();
    });
    it('should create an instance', () => {
      const service: FakeRetrospectiveDataEntryService = TestBed.get(FakeRetrospectiveDataEntryService);
      expect(service).toBeTruthy();
    });
  });
