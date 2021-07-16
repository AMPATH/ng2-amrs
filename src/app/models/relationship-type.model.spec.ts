/* tslint:disable:no-unused-variable */

import { RelationshipType } from "./relationship-type.model";

describe("Model: RelationshipType", () => {
  const existingRelationshipType: any = {
    display: "Robai is the Aunt/Uncle of Test",
  };

  it("should wrap patient relationship for display correctly", () => {
    const wrappedRelationshipType: RelationshipType = new RelationshipType(
      existingRelationshipType
    );
    expect(wrappedRelationshipType.display).toEqual(
      existingRelationshipType.display
    );
  });
});
