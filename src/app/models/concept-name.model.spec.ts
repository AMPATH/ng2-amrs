import { ConceptName } from './concept-name.model';

describe('Model: conceptName', () => {
  const existingConceptName: any = {
    name: 'name',
    conceptNameType: 'concept name type'
  };

  it('it should wrap concept Name Model for display correctly', (done) => {
    const wrappedConceptNameModel: ConceptName = new ConceptName(
      existingConceptName
    );
    expect(wrappedConceptNameModel.name).toEqual(existingConceptName.name);
    expect(wrappedConceptNameModel.conceptNameType).toEqual(
      existingConceptName.conceptNameType
    );
    done();
  });
});
