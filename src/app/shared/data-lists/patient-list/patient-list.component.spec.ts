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
  it('should create an instance', () => {
    let router: Router = TestBed.get(Router);
    let component = new PatientListComponent(router);
    expect(component).toBeTruthy();
  });

  it('should have required variables', () => {
    let router: Router = TestBed.get(Router);
    let component = new PatientListComponent(router);
    expect(component.extraColumns).toBeUndefined();
    expect(component.data).toBeTruthy();
  });
});
