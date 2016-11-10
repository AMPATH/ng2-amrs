/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { PatientDashboardComponent } from './patient-dashboard.component';
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute { 'params': Observable.from([{ 'id': 1 }]); }

describe('Component: PatientDashboard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useClass: MockRouter }, {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        }, DynamicRoutesService
      ]
    });
  });
  it('should create an instance', () => {
    let router: Router = TestBed.get(Router);
    let route: ActivatedRoute = TestBed.get(ActivatedRoute);
    let component = new PatientDashboardComponent(router, route);
    expect(component).toBeTruthy();
  });
});
