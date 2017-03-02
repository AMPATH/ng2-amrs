/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';

describe('Component: GenericList', () => {

  it('should create an instance', () => {
    let component = new PatientListComponent();
    expect(component).toBeTruthy();
  });

  it('should have required variables', () => {
    let component = new PatientListComponent();
      expect(component.extraColumns).toBeUndefined();
      expect(component.data).toBeTruthy();
    });
});
