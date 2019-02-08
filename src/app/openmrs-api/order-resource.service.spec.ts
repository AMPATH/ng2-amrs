
import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { OrderResourceService } from './order-resource.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// Load the implementations that should be tested

describe('Service : OrderResourceService Unit Tests', () => {

  let orderResourceService: OrderResourceService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        LocalStorageService,
        OrderResourceService
      ],
    });

    orderResourceService = TestBed.get(OrderResourceService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies', () => {
    expect(orderResourceService).toBeDefined();
  });

  it('should return a list of orders when the correct PatientUuid is provided without v  ', () => {

    const patientUuid = '3a8cd157-38d4-4a50-9121-ab15c7459382';

    orderResourceService.getOrdersByPatientUuid(patientUuid).subscribe();

    const req = httpMock.expectOne(orderResourceService.getUrl() + '?patient=' + patientUuid +
    '&v=full');

    expect(req.request.method).toBe('GET');

    req.flush(JSON.stringify({}));
  });
  it('should return a list of orders when the correct PatientUuid is provided with v', () => {

    const patientUuid = '3a8cd157-38d4-4a50-9121-ab15c7459382';

    orderResourceService.getOrdersByPatientUuid(patientUuid, false, '9').subscribe();

    const req = httpMock.expectOne(orderResourceService.getUrl() + '?patient=' + patientUuid +
      '&v=9');

    expect(req.request.method).toBe('GET');

    req.flush(JSON.stringify({}));
  });
  it('should return an order when a matching order number is provided without v', (done) => {

    const orderId = 'ORD-8934';

    orderResourceService.searchOrdersById(orderId)
      .subscribe((response) => {
        done();
      });

      const req = httpMock.expectOne(orderResourceService.getUrl() + '/' + orderId +
      '?v=custom:(display,uuid,orderNumber,orderType,accessionNumber,' +
      'orderReason,orderReasonNonCoded,urgency,careSetting,action,' +
      'commentToFulfiller,dateActivated,dateStopped,instructions,orderer:default,' +
      'encounter:full,patient:default,concept:ref)');
      expect(req.request.method).toBe('GET');
      req.flush(JSON.stringify({}));
  });
  it('should return an order when a matching order number is provided with v', (done) => {

    const orderId = 'ORD-8934';

    orderResourceService.searchOrdersById(orderId, false, '9')
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(orderResourceService.getUrl() + '/' + orderId +
      '?v=9');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));
  });
  it('should return an order when a orderUuid  is provided without v', (done) => {

    const orderUUid = 'uuid';

    orderResourceService.getOrderByUuid(orderUUid)
      .subscribe((response) => {
        done();
      });

      const req = httpMock.expectOne(orderResourceService.getUrl() + '/' + orderUUid + '?v=full');
      expect(req.request.method).toBe('GET');
      req.flush(JSON.stringify({}));

  });
  it('should return an order when a orderUuid  is provided with v', (done) => {

    const orderUUid = 'uuid';

    orderResourceService.getOrderByUuid(orderUUid, false, '9')
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(orderResourceService.getUrl() + '/' + orderUUid + '?' +
      'v=9');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));

  });
});
