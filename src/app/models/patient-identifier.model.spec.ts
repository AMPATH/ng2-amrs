
/* tslint:disable:no-unused-variable */

// import { TestBed, async, inject, describe, it, expect } from '@angular/core/testing';

import { PatientIdentifier } from './patient-identifier.model';



describe('Model: PatientIdentifiers', () => {

  let existingPatientIdentifier: any = {
    uuid: 'uuid',
    display: 'the patient',
    identifier: 'the identifier',
    identifierType: {
      uuid: ' patient identifiers  uuid'
    }

  };

  it('should wrap openmrs patient identifiers for display correctly', () => {
    let wrappedPatient: PatientIdentifier = new PatientIdentifier(existingPatientIdentifier);
    expect(wrappedPatient.uuid).toEqual(existingPatientIdentifier.uuid);
    expect(wrappedPatient.display).toEqual(existingPatientIdentifier.display);
    expect(wrappedPatient.identifier).toEqual(existingPatientIdentifier.identifier);
    expect(wrappedPatient.identifierType.uuid)
      .toEqual(existingPatientIdentifier.identifierType.uuid);

  });
});


