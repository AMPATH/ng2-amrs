import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { PersonResourceService } from './person-resource.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

// Load the implementations that should be tested

describe('Service: PersonResourceService Unit Tests', () => {
  let service: PersonResourceService;

  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        LocalStorageService,
        PersonResourceService
      ]
    });

    service = TestBed.get(PersonResourceService);
    httpMock = TestBed.get(HttpTestingController);
  }));
  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  const personuid = 'uuid';
  const personPayload = {
    age: 21,
    names: [
      {
        // adding new person name
        middleName: 'Tests',
        familyName2: 'Tester'
      },
      {
        // Editing existing person name
        uuid: '0cfcb36e-a92f-4b71-b37e-2eedd24abe31',
        middleName: 'Test',
        familyName2: 'Ampath Tester'
      }
    ],
    attributes: [
      // when creating new or updating, Api handles updates automatically
      {
        attributeType: 'attribute-type-uuid',
        value: 'Test Race'
      }
    ],
    addresses: [
      {
        // creating new person address
        address3: 'Third Address',
        address4: 'Fourth Address'
      },
      {
        // editing an existing person address
        address5: 'Fifth Address',
        address6: 'Sixth Address',
        uuid: 'person-address-uuid' // provide uuid if updating
      }
    ]
  };

  it('should be injected with all dependencies', () => {
    expect(service).toBeDefined();
  });

  it('should return a person when the correct uuid is provided without v', (done) => {
    service.getPersonByUuid(personuid).subscribe((response) => {
      done();
    });

    const req = httpMock.expectOne(
      service.getUrl() + '/' + personuid + '?v=full'
    );
    expect(req.request.urlWithParams).toContain('person/' + personuid);
    expect(req.request.urlWithParams).toContain('v=');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));
  });
  it('should return a person when the correct uuid is provided with v', (done) => {
    service.getPersonByUuid(personuid, false, '9').subscribe((response) => {
      done();
    });

    const req = httpMock.expectOne(service.getUrl() + '/' + personuid + '?v=9');
    expect(req.request.urlWithParams).toContain('person/' + personuid);
    expect(req.request.urlWithParams).toContain('v=');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));
  });

  it('should return null when params are not specified', async(() => {
    const result = service.saveUpdatePerson(null, null);

    expect(result).toBeNull();
  }));

  it('should call the right endpoint when updating a person', (done) => {
    service.saveUpdatePerson(personuid, personPayload).subscribe((response) => {
      done();
    });

    const req = httpMock.expectOne(service.getUrl() + '/' + personuid);
    expect(req.request.url).toContain('person/' + personuid);
    expect(req.request.method).toBe('POST');
    req.flush(JSON.stringify({}));
  });
});
