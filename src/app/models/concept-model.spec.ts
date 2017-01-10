/* tslint:disable:no-unused-variable */

// import { TestBed, async, inject, describe, it, expect } from '@angular/core/testing';

import { Concept } from './concept-model';

describe('Model: Concept', () => {

  let existingConcept: any = {
    uuid: 'uuid',
    display: 'concept',
    conceptName: {
      name: 'name'
    }
    conceptClass: {
      name: 'name'
    }
  };

  it('should wrap openmrs Concept for display correctly', () => {
    let wrappedConcept: Concept = new Concept(existingConcept);
    expect(wrappedConcept.uuid).toEqual(existingConcept.uuid);
    expect(wrappedConcept.display).toEqual(existingConcept.display);
    expect(wrappedConcept.conceptName.name).toEqual(existingConcept.conceptName.name);
    expect(wrappedConcept.conceptClass.name).toEqual(existingConcept.conceptClass.name);

  });

  it('should generate an existing concept payload correctly', () => {
    let wrappedConcept: Concept = new Concept(existingConcept);
    let newPayload: any = wrappedConcept.toUpdatePayload();
    expect(newPayload.uuid).toEqual(undefined);
    expect(newPayload.display).toEqual(undefined);
    expect(wrappedConcept.conceptName.name).toEqual(existingConcept.conceptName.name);
    expect(wrappedConcept.conceptClass.name).toEqual(existingConcept.conceptClass.name);

  });

});




