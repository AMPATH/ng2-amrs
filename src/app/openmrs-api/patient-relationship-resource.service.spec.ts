import { async, inject, TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { PatientRelationshipResourceService } from './patient-relationship-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: Pratient Relationship ResourceService', () => {

  let service: PatientRelationshipResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientRelationshipResourceService,
        AppSettingsService,
        LocalStorageService
      ],
      imports: [
        HttpClientTestingModule]
    });

    service = TestBed.get(PatientRelationshipResourceService);
    httpMock = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  const patientRelationshipResponse = {
    results: [
      {
        uuid: 'c7a62ab1-f034-4da3-bdce-87ce655521b8',
        display: 'Robai is the Caretaker of BRAVIN',
        personA: {
          uuid: 'b4ddd369-bec5-446e-b8f8-47fd5567b295',
          display: 'Robai Tests Robai'
        },
        relationshipType: {
          uuid: '7878de42-1359-11df-a1f1-0026b9348838',
          display: 'Caretaker/Patient'
        },
        personB: {
          uuid: '922fc86d-ad42-4c50-98a6-b1f310863c07',
          display: 'BRAVIN TESTIMONY ALUSA'
        },
        voided: false,
        startDate: '2016-07-22T00:00:00.000+0300',
        endDate: null,
        resourceVersion: '1.9'
      }]
  };

  const relationshipPayload = {
    personA: 'personAuuid',
    relationshipType: 'relationshipTypeUUid',
    personB: 'personBuuid',
    startDate: '2016-07-22T00:00:00.000+0300'
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return null when PatientUuid not specified'
    + 'when fetching patient relationships', async(() => {

      httpMock.expectNone({});

      const result = service.getPatientRelationships(null);
      expect(result).toBeNull();
    }));



  it('should call the right endpoint when getting person relationships', (done) => {

    const personUuid = 'uuid';

    service.getPatientRelationships(personUuid)
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '?v=full&person=uuid');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('?v=full');
    req.flush(JSON.stringify(patientRelationshipResponse));
  });

  it('should return null when relationshipPayload not specified', async(() => {

    httpMock.expectNone({});

    const result = service.saveRelationship(null);
    expect(result).toBeNull();
  }));

  it('should call the right endpoint when updating person relationships', (done) => {

    service.saveRelationship(relationshipPayload)
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl());
    expect(req.request.method).toBe('POST');
    expect(req.request.url).toBe(service.getUrl());
    req.flush(JSON.stringify(patientRelationshipResponse));
  });
  it('should return null when uuid and payload not specified', async(() => {

    httpMock.expectNone({});

    const result = service.updateRelationship(null, null);
    expect(result).toBeNull();
  }));

  it('should call the right endpoint when updating person relationships', (done) => {

    service.updateRelationship('uuid', relationshipPayload)
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '/' + 'uuid');
    expect(req.request.method).toBe('POST');
    expect(req.request.url).toContain('uuid');
    req.flush(JSON.stringify(patientRelationshipResponse));
  });


  it('should return null when PatientUuid not specified'
    + 'when deconsting person relationships', async(() => {
      httpMock.expectNone({});
      const result = service.deleteRelationship(null);
      expect(result).toBeNull();
    }));

  it('should call the right endpoint when deconsting person relationships', (done) => {
    const relationshipUuid = 'uuid';

    service.deleteRelationship(relationshipUuid)
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(service.getUrl() + '/' + relationshipUuid);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.url).toBe(service.getUrl() + '/' + relationshipUuid);
    req.flush(JSON.stringify(patientRelationshipResponse));
  });


});





