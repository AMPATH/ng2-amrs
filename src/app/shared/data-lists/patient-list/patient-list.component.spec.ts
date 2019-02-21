/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PatientListComponent } from './patient-list.component';

describe('Component: GenericList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useClass: class { navigate = jasmine.createSpy('navigate'); }
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const router: Router = TestBed.get(Router);
    const component = new PatientListComponent(router);
    expect(component).toBeTruthy();
  });

  it('should have required variables', () => {
    const router: Router = TestBed.get(Router);
    const component = new PatientListComponent(router);
    expect(component.extraColumns).toBeUndefined();
    expect(component.data).toBeTruthy();
  });
});
