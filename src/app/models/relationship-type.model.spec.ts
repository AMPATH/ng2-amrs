/* tslint:disable:no-unused-variable */


import { RelationshipType } from './relationship-type.model';



describe('Model: RelationshipType', () => {

    let existingRelationshipType: any = {
        'display': 'Robai is the Aunt/Uncle of Test',
    };

    it('should wrap patient relationship for display correctly', () => {
        let wrappedRelationshipType: RelationshipType =
            new RelationshipType(existingRelationshipType);
        expect(wrappedRelationshipType.display).
            toEqual(existingRelationshipType.display);

    });

});




