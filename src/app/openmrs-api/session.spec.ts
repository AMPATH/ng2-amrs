import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import {
  Http, Response, Headers,
  BaseRequestOptions, ResponseOptions
} from '@angular/http';
import { SessionService } from './session.service';
import { LocalStorageService } from '../utils/local-storage.service';

// Load the implementations that should be tested

// describe('SessionService Unit Tests', () => {

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [],
//       declarations: [],
//       providers: [
//         MockBackend,
//         BaseRequestOptions,
//         {
//           provide: Http,
//           useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
//             return new Http(backendInstance, defaultOptions);
//           },
//           deps: [MockBackend, BaseRequestOptions]
//         },
//         AppSettingsService,
//         SessionService,
//         LocalStorageService
//       ],
//     });
//   }));

//   afterEach(() => {
//     TestBed.resetTestingModule();
//   });

//   it('it should return a server url', inject([SessionService],
//     (sessionService: SessionService) => {
//       expect(sessionService.getUrl()).toBeTruthy();
//     }));

//   it('It should return a session', inject([MockBackend, SessionService],
//     (backend: MockBackend, sessionService: SessionService) => {

//       backend.connections.subscribe((connection: MockConnection) => {
//         let options = new ResponseOptions({
//           body: JSON.stringify({
//             authenticated: true,
//             user: {}
//           })
//         });
//         connection.mockRespond(new Response(options));
//       });

//       let credentials: Object = {
//         username: 'test',
//         password: 'test'
//       };

//       sessionService.getSession(credentials)
//         .subscribe((response) => {
//           expect(response.json().authenticated).toEqual(true);
//           expect(response.json().user).toBeTruthy();
//         });
//     }));

// });
