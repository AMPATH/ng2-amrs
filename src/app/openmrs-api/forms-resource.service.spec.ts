import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { FormsResourceService } from './forms-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

// Load the implementations that should be tested

xdescribe('FormResourceService Unit Tests', () => {

  let formsResourceService: FormsResourceService;
  let httpMock: HttpTestingController;
  let appSettingsService: AppSettingsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        FormsResourceService,
        LocalStorageService
      ],
    });

    formsResourceService = TestBed.get(FormsResourceService);
    httpMock = TestBed.get(HttpTestingController);
    appSettingsService = TestBed.get(AppSettingsService);

  }));

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should have getForms defined', () => {
    expect(formsResourceService).toBeDefined();
  });

  it('should make API call with correct URL', () => {
    formsResourceService.getForms(true).subscribe();

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'form' + '?v=custom:(uuid,name,encounterType:' +
      '(uuid,name),version,published,retired,' +
      'resources:(uuid,name,dataType,valueReference))&q=POC');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('ws/rest/v1/form?v=custom:(uuid,name,encounterType:' +
        '(uuid,name),version,published,retired,' +
        'resources:(uuid,name,dataType,valueReference))&q=POC');
  });
  it('It should return an array of form object when getForms is invoked without v', () => {

    const res = [
      { name: 'form1' },
      { name: 'form2' }
    ];
    formsResourceService.getForms()
      .subscribe((response) => {
        expect(res).toContain({ name: 'form1' });
        expect(res).toBeDefined();
      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl()
    .trim() + 'form' + '?v=custom:(uuid,name,encounterType:(uuid,name),version,' +
      'published,retired,resources:(uuid,name,dataType,valueReference))&q=POC');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('?v=custom:(uuid,name,encounterType:(uuid,name)');
    req.flush(res);
  });

  it('should make API call with correct URL when getFormClobDataByUuid is invoked without v', fakeAsync(() => {
    const uuid = 'form-uuid';
    tick(50);
    formsResourceService.getFormClobDataByUuid(uuid).subscribe();

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'clobdata' + '/' + uuid + '?v=full');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('/ws/rest/v1/clobdata/form-uuid?v=full');
  }));

  it('should make API call with correct URL when getFormClobDataByUuid is invoked with v', fakeAsync(() => {
    const uuid = 'form-uuid';
    tick(50);
    formsResourceService.getFormClobDataByUuid(uuid, '9').subscribe();

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'clobdata' + '/' + uuid + '?v=9');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('/ws/rest/v1/clobdata/form-uuid?v=9');
  }));

  it('should return a form object when getFormClobDataByUuid is invoked without v', (done) => {

    const options = {
      uuid: 'xxx-xxx-xxx-xxx',
      display: 'form resource'
    };

    const uuid = 'form-uuid';

    formsResourceService.getFormClobDataByUuid(uuid)
      .subscribe((data) => {
        expect(data.uuid).toBeTruthy();
        done();
      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'clobdata' + '/' + uuid + '?v=full');
    expect(req.request.method).toBe('GET');
    req.flush(options);
  });

  it('should return a form object when getFormClobDataByUuid is invoked with v', (done) => {

    const options = {
      uuid: 'xxx-xxx-xxx-xxx',
      display: 'form resource'
    };

    const uuid = 'form-uuid';

    formsResourceService.getFormClobDataByUuid(uuid, '9')
      .subscribe((data) => {
        expect(data.uuid).toBeTruthy();
        done();
      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'clobdata' + '/' + uuid + '?v=9');
    expect(req.request.method).toBe('GET');
    req.flush(options);
  });

  it('should make API call with correct URL when getFormMetaDataByUuid is invoked without v', fakeAsync(() => {
    const uuid = 'form-uuid';
    tick(50);

    formsResourceService.getFormMetaDataByUuid(uuid).subscribe();

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'form/' + uuid + '?v=full');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('/ws/rest/v1/form/form-uuid?v=full');
  }));

  it('should make API call with correct URL when getFormMetaDataByUuid is invoked with v', fakeAsync(() => {
    const uuid = 'form-uuid';
    tick(50);

    formsResourceService.getFormMetaDataByUuid(uuid, '9').subscribe();

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'form/' + uuid + '?v=9');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('/ws/rest/v1/form/form-uuid?v=9');
  }));

  it('should return a form object when getFormMetaDataByUuid is invoked without v', (done) => {
    const uuid = 'form-uuid';
    const options = {
      uuid: 'xxx-xxx-xxx-xxx',
      display: 'form resource'
    };

    formsResourceService.getFormMetaDataByUuid(uuid)
      .subscribe((data) => {
        expect(data.uuid).toBeTruthy();
        done();
      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'form/' + uuid + '?v=full');
    expect(req.request.method).toBe('GET');
    req.flush(options);

  });

  it('should return a form object when getFormMetaDataByUuid is invoked with v', (done) => {
    const uuid = 'form-uuid';
    const options = {
      uuid: 'xxx-xxx-xxx-xxx',
      display: 'form resource'
    };

    formsResourceService.getFormMetaDataByUuid(uuid, '9')
      .subscribe((data) => {
        expect(data.uuid).toBeTruthy();
        done();
      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'form/' + uuid + '?v=9');
    expect(req.request.method).toBe('GET');
    req.flush(options);

  });

});
