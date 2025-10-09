export interface CreateRelationshipDto {
  personA: string;
  relationshipType: string;
  personB: string;
  startDate?: string;
}
