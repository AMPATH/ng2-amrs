import { Injectable } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { ResponseOptions, Response } from '@angular/http';

@Injectable()
export class MockVitalsResourceService {

  constructor() { }

  public getVitals(patientUuid: string, startIndex: string, limit: string) {

    const mockResponse = new Response(new ResponseOptions({
      body: {
        startIndex: '0',
        limit: '10',
        result: []
      }
    }));
    const mockBackend = new MockBackend();

    mockBackend.connections.take(1).subscribe((c) => c.mockRespond(mockResponse));

    return mockBackend.connections;

  }
}
