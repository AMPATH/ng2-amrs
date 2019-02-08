import { async, TestBed, inject } from '@angular/core/testing';

import { OderSetResourceService } from './oder-set-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';

describe('OderSetResourceService', () => {
    let orderSetResourceService: OderSetResourceService;
    let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      providers: [OderSetResourceService,
        LocalStorageService,
        AppSettingsService]
    });
    orderSetResourceService = TestBed.get(OderSetResourceService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', inject([OderSetResourceService], (service: OderSetResourceService) => {
    expect(service).toBeTruthy();
  }));
  it('should be injected with all dependencies', () => {
    expect(orderSetResourceService).toBeDefined();
  });
  it('should return all orderSets', () => {
  });
});
