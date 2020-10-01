/* tslint:disable:no-unused-variable */

// import { TestBed, async, inject, describe, it, expect } from '@angular/core/testing';

import { Provider } from './provider.model';

describe('Model: Provider', () => {
  const existingProvider: any = {
    uuid: 'uuid',
    display: 'the provider',
    identifier: 'identifier',
    person: {
      uuid: 'uuid'
    }
  };

  it('should wrap openmrs provider for display correctly', () => {
    const wrappedProvider: Provider = new Provider(existingProvider);
    expect(wrappedProvider.uuid).toEqual(existingProvider.uuid);
    expect(wrappedProvider.display).toEqual(existingProvider.display);
    expect(wrappedProvider.identifier).toEqual(existingProvider.identifier);
    expect(wrappedProvider.person.uuid).toEqual(existingProvider.person.uuid);
  });
});
