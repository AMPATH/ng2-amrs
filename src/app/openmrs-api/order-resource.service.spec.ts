
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { OrderResourceService } from './order-resource.service';
// Load the implementations that should be tested

describe('Service : OrderResourceService Unit Tests', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        LocalStorageService,
        OrderResourceService
      ],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([OrderResourceService],
      (orderResourceService: OrderResourceService) => {
        expect(orderResourceService).toBeTruthy();
      }));
  it('should return a list of orders when the correct PatientUuid is provided', (done) => {

    let orderResourceService: OrderResourceService = TestBed.get(OrderResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = '3a8cd157-38d4-4a50-9121-ab15c7459382';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).
      toBe('http://example.url.com/ws/rest/v1/order?patient=' + patientUuid +
        '&v=custom:(display,uuid,orderNumber,accessionNumber,orderReason,' +
        'orderReasonNonCoded,urgency,action,commentToFulfiller,dateActivated,' +
        'instructions,orderer:default,encounter:full,patient:default,concept:ref)');
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

    orderResourceService.getOrdersByPatientUuid(patientUuid)
      .subscribe((response) => {
        done();
      });
  });
  it('should return an order when a matching order number is provided', (done) => {

    let orderResourceService: OrderResourceService = TestBed.get(OrderResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let orderId = 'ORD-8934';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toBe(
        'http://example.url.com/ws/rest/v1/order/' + orderId + '?' +
        'v=custom:(display,uuid,orderNumber,accessionNumber,orderReason,' +
        'orderReasonNonCoded,urgency,action,commentToFulfiller,dateActivated,' +
        'instructions,orderer:default,encounter:full,patient:default,concept:ref)');
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

   orderResourceService.searchOrdersById(orderId)
      .subscribe((response) => {
        done();
      });

  });
  it('should return an order when a orderUuid  is provided', (done) => {

    let orderResourceService: OrderResourceService = TestBed.get(OrderResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let orderUUid = 'uuid';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toBe(
        'http://example.url.com/ws/rest/v1/order/' + orderUUid + '?' +
        'v=custom:(display,uuid,orderNumber,accessionNumber,orderReason,' +
        'orderReasonNonCoded,urgency,action,commentToFulfiller,dateActivated,' +
        'instructions,orderer:default,encounter:full,patient:default,concept:ref)'
      );
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

    orderResourceService.getOrderByUuid(orderUUid)
      .subscribe((response) => {
        done();
      });

  });
});
