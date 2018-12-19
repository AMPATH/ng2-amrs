import {ConceptClass} from './concept-class.model';

describe('Model: conceptClassModel', () => {
  const existingConceptClassModel: any = {
    name: 'bett',
    description: 'he is an awesome dude',
    retired: 'no'
  };

  it('It should wrap Concept class model for display correctly', () => {
    const wrappedConceptClassModel: ConceptClass = new ConceptClass(existingConceptClassModel);
    expect(wrappedConceptClassModel.name).toEqual(existingConceptClassModel.name);
    expect(wrappedConceptClassModel.description).toEqual(existingConceptClassModel.description);
    expect(wrappedConceptClassModel.retired).toEqual(existingConceptClassModel.retired);
  });
});
