/* tslint:disable:no-unused-variable */


import { Relationship } from './relationship.model';



describe('Model: Relationship', () => {

  let existingRelationship: any = {
    'relationshipTypeName': 'Parent/Child',
    'relationshipTypeUuId': 'uuid',
    'relationshipType': 'child',
    'relative': 'name',
    'relatedPersonUuid': 'uuid'
  };

  it('should wrap patient relationship for display correctly', () => {
    let wrappedRelationship: Relationship = new Relationship(existingRelationship);
    expect(wrappedRelationship.relationshipTypeName).
        toEqual(existingRelationship.relationshipTypeName);
    expect(wrappedRelationship.relationshipTypeUuId).
        toEqual(existingRelationship.relationshipTypeUuId);
    expect(wrappedRelationship.relationshipType).toEqual(existingRelationship.relationshipType);
    expect(wrappedRelationship.relative).toEqual(existingRelationship.relative);
    expect(wrappedRelationship.relatedPersonUuid).toEqual(existingRelationship.relatedPersonUuid);

  });

});




