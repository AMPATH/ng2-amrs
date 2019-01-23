import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DepartmentProgramsConfigService } from './department-programs-config.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

const mockResponse = {
  'uud1': {
    'name': 'HIV',
    'programs': [
      {
        'uuid': '781d85b0-1359-11df-a1f1-0026b9348838',
        'name': 'STANDARD HIV TREATMENT'
      },
      {
        'uuid': 'c4246ff0-b081-460c-bcc5-b0678012659e',
        'name': 'VIREMIA PROGRAM'

      },
      {
        'uuid': '781d8768-1359-11df-a1f1-0026b9348838',
        'name': 'OVC PROGRAM'
      }


    ]
  },
  'uud2': {
    'name': 'ONCOLOGY',
    'programs': [
      {
        'uuid': '142939b0-28a9-4649-baf9-a9d012bf3b3d',
        'name': 'BREAST CANCER SCREENING PROGRAM'
      },
      {
        'uuid': 'cad71628-692c-4d8f-8dac-b2e20bece27f',
        'name': 'CERVICAL CANCER SCREENING PROGRAM'
      },
      {
        'uuid': '725b5193-3452-43fc-aca3-6a80432d9bfa',
        'name': 'GENERAL ONCOLOGY PROGRAM'
      }
    ]
  },
  'uud3': {
    'name': 'CDM',
    'programs': [
      {
        'uuid': 'b731ba72-cf99-4176-9fcd-37cd186400c7',
        'name': 'HTN AND DM CARE AT THE SECONDARY CARE LEVEL'
      },
      {
        'uuid': 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
        'name': 'HTN AND DM CARE AT THE TERTIARY CARE LEVEL PROGRAM'
      },
      {
        'uuid': '876a154d-310d-4caf-8b58-be9dbcc7e753',
        'name': 'HTN AND DM CARE AT THE PRIMARY CARE LEVEL'
      }


    ]
  },
  'uud4': {
    'name': 'BSG',
    'programs': [
      {
        'uuid': '781d8a88-1359-11df-a1f1-0026b9348838',
        'name': 'BSG PROGRAM'
      }

    ]
  },
  'uud5': {
    'name': 'DERMATOLOGY',
    'programs': [
      {
        'uuid': 'b3575274-1850-429b-bb8f-2ff83faedbaf',
        'name': 'DERMATOLOGY'
      }

    ]
  }
};

class MockCacheStorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }
}

describe('Service :  Department Programs Configuration Service', () => {
  let s, httpMock;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacheModule, HttpClientTestingModule],
      providers: [
        DepartmentProgramsConfigService,
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
    httpMock = TestBed.get(HttpTestingController);
    s = TestBed.get(DepartmentProgramsConfigService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });


  it('should be defined',
    inject([DepartmentProgramsConfigService], (d: DepartmentProgramsConfigService) => {
      expect(d).toBeTruthy();
    })
  );


  it('Should return a list of department programs ', () => {
    s.getDartmentProgramsConfig().subscribe((result) => {
      expect(result).toBeDefined();
      expect(result).toEqual(mockResponse);
    });
  });
});

