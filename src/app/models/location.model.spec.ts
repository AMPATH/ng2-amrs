import { Location } from './location.model';

describe('Model: Location', () => {

  let existingLocation: any = {
    uuid: 'uuid',
    display: 'the location',

  };

  it('should wrap openmrs Location for display correctly', () => {
    let wrappedLocation: Location = new Location(existingLocation);
    expect(wrappedLocation.uuid).toEqual(existingLocation.uuid);
    expect(wrappedLocation.display).toEqual(existingLocation.display);

  });
});


