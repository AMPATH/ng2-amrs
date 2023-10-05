/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PreAppointmentExtendedListComponent } from './pre-appointment-extended-list.component';

describe('Component: PreAppointmentExtendedList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const router: Router = TestBed.get(Router);
    const component = new PreAppointmentExtendedListComponent(router);
    expect(component).toBeTruthy();
  });

  it('should have required variables', () => {
    const router: Router = TestBed.get(Router);
    const component = new PreAppointmentExtendedListComponent(router);
    expect(component.extraColumns).toBeUndefined();
    expect(component.data).toBeTruthy();
  });
});
