import { Injectable } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import { Mock } from 'protractor/built/driverProviders';

@Injectable()
export class MockVitalsResourceService {

  constructor() { }

  getVitals(patientUuid: string, startIndex: string, limit: string) {

    let mockResponse = new Response(new ResponseOptions({
      body: {
        startIndex: '0',
        limit: '10',
        result: []
      }
    }));
    let mockBackend = new MockBackend();

    mockBackend.connections.subscribe(c => c.mockRespond(mockResponse));

    return mockBackend.connections;

  }
}


