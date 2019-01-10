import {Location} from './location.model';

describe('Model: Location', () => {

  const existingLocation: any = {
    uuid: 'uuid',
    display: 'the location',

  };

  it('should wrap openmrs Location for display correctly', () => {
    const wrappedLocation: Location = new Location(existingLocation);
    expect(wrappedLocation.uuid).toEqual(existingLocation.uuid);
    expect(wrappedLocation.display).toEqual(existingLocation.display);

  });
});


