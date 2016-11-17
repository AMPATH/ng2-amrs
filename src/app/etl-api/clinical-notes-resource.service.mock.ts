import { Injectable } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { ResponseOptions, Response } from '@angular/http';

@Injectable()
export class MockClinicalNotesResourceService {

  constructor() { }

  getClinicalNotes(patientUuid: string, startIndex: number, limit: number) {

    let mockResponse = new Response(new ResponseOptions({
      body: {
        notes: [],
        status: ''
      }
    }));
    let mockBackend = new MockBackend();

    mockBackend.connections.subscribe(c => c.mockRespond(mockResponse));

    return mockBackend.connections;

  }
}


