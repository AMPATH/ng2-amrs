import { TestBed, async } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { ConceptResourceService } from './concept-resource.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// Load the implementations that should be tested

describe('Service : ConceptResourceService Unit Tests', () => {
  let conceptResourceService: ConceptResourceService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        LocalStorageService,
        ConceptResourceService
      ],
    });

    conceptResourceService = TestBed.get(ConceptResourceService);
    httpMock = TestBed.get(HttpTestingController);

  }));
  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies', () => {
    expect(conceptResourceService).toBeTruthy();
  });

  it('should return a concept when the correct uuid is provided with v', () => {

    const conceptUuid = 'a8945ba0-1350-11df-a1f1-0026b9348838';

    conceptResourceService.getConceptByUuid(conceptUuid, false, '9').subscribe(
      (res) => {
        expect(res).toEqual('concept');
      }
    );

    const request = httpMock.expectOne(conceptResourceService.getUrl() + '/' + conceptUuid + '?v=9');
    expect(request.request.url).toContain('concept/' + conceptUuid);
    expect(request.request.urlWithParams).toContain('v=9');
    expect(request.request.method).toBe('GET');
    request.flush('concept');
  });

  it('should return a concept when the correct uuid is provided without v', () => {

    const conceptUuid = 'a8945ba0-1350-11df-a1f1-0026b9348838';

    conceptResourceService.getConceptByUuid(conceptUuid).subscribe(
      (res) => {
        expect(res).toEqual('concept');
      }
    );

    const request = httpMock.expectOne(conceptResourceService.getUrl() + '/' + conceptUuid +
    '?v=custom:(uuid,name,conceptClass,answers,setMembers)');
    expect(request.request.url).toContain('concept/' + conceptUuid);
    expect(request.request.urlWithParams).toContain('v=custom');
    expect(request.request.method).toBe('GET');
    request.flush('concept');
  });

  it('should return a list of concepts a matching search string  provided without v', (done) => {

    const searchText = 'test';
    const res = [
      {
        uuid: 'uuid',
        conceptClass: {
          uuid: 'uuid',
          description: 'acquired',
          display: 'test'
        },
        name: {
          conceptNameType: 'conceptNameType',
          display: 'BRUCELLA TEST'
        }
      }
    ];
    conceptResourceService.searchConcept(searchText)
      .subscribe((data) => {
        expect(res.length).toBeGreaterThan(0);
        done();
      });

    const req = httpMock.expectOne(conceptResourceService.getUrl() + '?q=test&v=custom:(uuid,name,conceptClass,answers,setMembers)');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('q=test&v=custom');
    expect(req.request.urlWithParams).toContain('q=' + searchText);
    req.flush(res);

  });
  it('should return a list of concepts a matching search string  provided with v', (done) => {

    const searchText = 'test';
    const res = [
      {
        uuid: 'uuid',
        conceptClass: {
          uuid: 'uuid',
          description: 'acquired',
          display: 'test'
        },
        name: {
          conceptNameType: 'conceptNameType',
          display: 'BRUCELLA TEST'
        }
      }
    ];
    conceptResourceService.searchConcept(searchText, false, '9')
      .subscribe((data) => {
        expect(res.length).toBeGreaterThan(0);
        done();
      });

    const req = httpMock.expectOne(conceptResourceService.getUrl() + '?q=test&v=9');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('q=test&v=9');
    expect(req.request.urlWithParams).toContain('q=' + searchText);
    req.flush(res);

  });

});
