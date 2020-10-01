import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { PatientRelationshipTypeResourceService } from './patient-relationship-type-resource.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('Service: Pratient Relationship ResourceService', () => {
  let service: PatientRelationshipTypeResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientRelationshipTypeResourceService,
        AppSettingsService,
        LocalStorageService
      ],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(PatientRelationshipTypeResourceService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  const relationshipTypesResponse = {
    results: [
      {
        uuid: '7878d348-1359-11df-a1f1-0026b9348838',
        display: 'Parent/Child',
        description: 'Auto generated by OpenMRS',
        aIsToB: 'Parent',
        bIsToA: 'Child',
        retired: false,
        resourceVersion: '1.8'
      },
      {
        uuid: '7878d898-1359-11df-a1f1-0026b9348838',
        display: 'Doctor/Patient',
        description: 'Relationship from a primary care provider to the patient',
        aIsToB: 'Doctor',
        bIsToA: 'Patient',
        retired: false,
        resourceVersion: '1.8'
      }
    ]
  };

  it('should call the right endpoint when getting person relationship types', (done) => {
    service.getPatientRelationshipTypes().subscribe((response) => {
      done();
    });

    const req = httpMock.expectOne(service.getUrl() + '?v=full');
    expect(req.request.urlWithParams).toEqual(service.getUrl() + '?v=full');
    expect(req.request.urlWithParams).toContain('v=');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify(relationshipTypesResponse));
  });
});
