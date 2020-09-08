import { PersonAttributeType } from './person-attribute-type.model';

describe('Model: personAttributeType', () => {
  const existingPersonAttributeType: any = {
    name: 'name'
  };

  it('It should wrap person Attribute type model for display correctly', (done) => {
    const wrappedPersonAttributeType: PersonAttributeType = new PersonAttributeType(
      existingPersonAttributeType
    );
    expect(wrappedPersonAttributeType.name).toEqual(
      existingPersonAttributeType.name
    );
    done();
  });
});
