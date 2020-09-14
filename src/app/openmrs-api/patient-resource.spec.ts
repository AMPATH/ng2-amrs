import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientResourceService } from './patient-resource.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Load the implementations that should be tested

describe('PatientService Unit Tests', () => {

  let service: PatientResourceService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        LocalStorageService,
        PatientResourceService
      ],
    });

    service = TestBed.get(PatientResourceService);
    httpMock = TestBed.get(HttpTestingController);

  }));
  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies', () => {
    expect(service).toBeDefined();
  });

  it('should return null when no patient uuid is provided', () => {
    httpMock.expectNone({});
    const results = service.getPatientByUuid(null);
  });
  it('should return a patient when the correct uuid is provided without v', (done) => {

    const patientUuid = 'xxx-xxx-xxx-xxx';

    service.getPatientByUuid(patientUuid)
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '/' + patientUuid +
      '?v=custom:(uuid,display,' +
      'identifiers:(identifier,uuid,preferred,location:(uuid,name),' +
      'identifierType:(uuid,name,format,formatDescription,validator)),' +
      'person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,' +
      'causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),'
      + 'attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,longitude,' +
      'stateProvince,latitude,country,postalCode,countyDistrict,address3,address4,address5' +
      ',address6,address7)))');
    expect(req.request.urlWithParams).toContain('patient/' + patientUuid);
    expect(req.request.urlWithParams).toContain('v=');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));
  });
  it('should return a patient when the correct uuid is provided', (done) => {

    const patientUuid = 'xxx-xxx-xxx-xxx';

    service.getPatientByUuid(patientUuid, false, '9')
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '/' + patientUuid +
      '?v=9');
    expect(req.request.urlWithParams).toContain('patient/' + patientUuid);
    expect(req.request.urlWithParams).toContain('v=');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));
  });

  it('should return a list of patients when a matching search string is provided without v', (done) => {

    const searchText = 'test';

    const results = [
      {
        uuid: 'xxx-xxx-xxx-xxx',
        identifiers: {}
      }
    ];
    service.searchPatient(searchText)
      .subscribe((result) => {
        expect(results.length).toBeGreaterThan(0);
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '?q=' + searchText +
      '&v=custom:(uuid,display,' +
      'identifiers:(identifier,uuid,preferred,location:(uuid,name),' +
      'identifierType:(uuid,name,format,formatDescription,validator)),' +
      'person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,' +
      'causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),'
      + 'attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,longitude,' +
      'stateProvince,latitude,country,postalCode,countyDistrict,address3,address4,address5' +
      ',address6,address7)))');
    expect(req.request.urlWithParams).toContain('q=' + searchText);
    expect(req.request.urlWithParams).toContain('&v=');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify(results));

  });
  it('should return a list of patients when a matching search string is provided with v', (done) => {

    const searchText = 'test';

    const results = [
      {
        uuid: 'xxx-xxx-xxx-xxx',
        identifiers: {}
      }
    ];
    service.searchPatient(searchText, false, '9')
      .subscribe((data) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '?q=' + searchText +
      '&v=9');
    expect(req.request.urlWithParams).toContain('q=' + searchText);
    expect(req.request.urlWithParams).toContain('&v=');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify(results));

  });

  it('it should return null when saveUpdatePatientIdentifier called with no argumnets', () => {
    httpMock.expectNone({});
    const results = service.saveUpdatePatientIdentifier(null, null, null);
    expect(results).toBeNull();
  });

  it('should return a list of patients when a matching search string is provided with v', (done) => {

    const payload = {};
    const uuid = 'xxx-xxx-xxx-xxx';
    const identifier = 'xxx-xxx-xxx-xxx';

    service.saveUpdatePatientIdentifier(uuid, identifier, payload)
      .subscribe((data) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '/' + uuid + '/' + 'identifier' + '/' + identifier);
    expect(req.request.url).toContain(uuid);
    expect(req.request.url).toContain(identifier);
    expect(req.request.method).toBe('POST');
    req.flush(JSON.stringify(payload));

  });
  it('should throw an error when server returns an error response', () => {
    const searchText = 'test';

    service.searchPatient(searchText).subscribe();
    const req = httpMock.expectOne(service.getUrl() + '?q=' + searchText +
    '&v=custom:(uuid,display,' +
    'identifiers:(identifier,uuid,preferred,location:(uuid,name),' +
    'identifierType:(uuid,name,format,formatDescription,validator)),' +
    'person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,' +
    'causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),'
    + 'attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,longitude,' +
    'stateProvince,latitude,country,postalCode,countyDistrict,address3,address4,address5' +
    ',address6,address7)))');
    expect(req.request.urlWithParams).toContain('q=' + searchText);
    expect(req.request.urlWithParams).toContain('&v=');
    expect(req.request.method).toBe('GET');
  });

});
