/* tslint:disable:no-unused-variable */

// import { TestBed, async, inject, describe, it, expect } from '@angular/core/testing';

import {Encounter} from './encounter.model';


describe('Model: Encounter', () => {

  const existingEncounter: any = {
    uuid: 'uuid',
    display: 'the encounter',
    encounterDatetime: '2016-01-01 0:00z',
    patient: {
      uuid: 'patient uuid'
    },
    encounterType: {
      uuid: 'encounter type uuid'
    },
    location: {
      uuid: 'location uuid'
    },
    form: {
      uuid: 'form uuid'
    },
    provider: {
      uuid: 'provider uuid'
    },
    visit: {
      uuid: 'uuid'
    }
  };

  it('should wrap openmrs encounter for display correctly', () => {
    const wrappedEnconter: Encounter = new Encounter(existingEncounter);
    expect(wrappedEnconter.uuid).toEqual(existingEncounter.uuid);
    expect(wrappedEnconter.display).toEqual(existingEncounter.display);
    expect(wrappedEnconter.encounterDatetime).toEqual(new Date(existingEncounter.encounterDatetime));
    expect(wrappedEnconter.patient.uuid).toEqual(existingEncounter.patient.uuid);
    expect(wrappedEnconter.location.uuid).toEqual(existingEncounter.location.uuid);
    expect(wrappedEnconter.form.uuid).toEqual(existingEncounter.form.uuid);
    expect(wrappedEnconter.provider.uuid).toEqual(existingEncounter.provider.uuid);
    expect(wrappedEnconter.visit.uuid).toEqual(existingEncounter.visit.uuid);
  });

  it('should generate a new encounters new payload correctly', () => {
    const wrappedEnconter: Encounter = new Encounter(existingEncounter);
    const newPayload: any = wrappedEnconter.toNewPayload();
    expect(newPayload.uuid).toEqual(existingEncounter.uuid);
    expect(newPayload.display).toEqual(undefined);
    expect(newPayload.encounterDatetime).toEqual('2016-01-01T00:00:00.000Z'); // TODO: check dates
    expect(newPayload.patient).toEqual(existingEncounter.patient.uuid);
    expect(newPayload.location).toEqual(existingEncounter.location.uuid);
    expect(newPayload.form).toEqual(existingEncounter.form.uuid);
    expect(newPayload.provider).toEqual(existingEncounter.provider.uuid);
    expect(newPayload.visit).toEqual(existingEncounter.visit.uuid);

  });

  it('should generate an existing encounters payload correctly', () => {
    const wrappedEnconter: Encounter = new Encounter(existingEncounter);
    const newPayload: any = wrappedEnconter.toUpdatePayload();
    expect(newPayload.uuid).toEqual(undefined);
    expect(newPayload.display).toEqual(undefined);
    expect(newPayload.encounterDatetime).toEqual('2016-01-01T00:00:00.000Z'); // TODO: check dates
    expect(newPayload.patient).toEqual(existingEncounter.patient.uuid);
    expect(newPayload.location).toEqual(existingEncounter.location.uuid);
    expect(newPayload.form).toEqual(existingEncounter.form.uuid);
    expect(newPayload.provider).toEqual(existingEncounter.provider.uuid);
    expect(newPayload.visit).toEqual(existingEncounter.visit.uuid);

  });
});

