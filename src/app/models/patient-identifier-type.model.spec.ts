/* tslint:disable:no-unused-variable */

// import { TestBed, async, inject, describe, it, expect } from '@angular/core/testing';

import {PatientIdentifierType} from './patient-identifier-type.model';


describe('Model: PatientIdentifierType', () => {

  const existingPatientIdentifierType: any = {
    uuid: 'uuid',
    display: 'the identifier',
    name: 'name'
  };

  it('should wrap openmrs person for display correctly', () => {
    const wrappedPatientIdentifierType: PatientIdentifierType =
      new PatientIdentifierType(existingPatientIdentifierType);
    expect(wrappedPatientIdentifierType.uuid).toEqual(existingPatientIdentifierType.uuid);
    expect(wrappedPatientIdentifierType.display).toEqual(existingPatientIdentifierType.display);
    expect(wrappedPatientIdentifierType.name).toEqual(existingPatientIdentifierType.name);
  });
});




