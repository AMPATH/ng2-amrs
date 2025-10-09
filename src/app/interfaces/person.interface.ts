export interface CreatePersonDto {
  gender?: string;
  birthdate?: string;
  dead?: boolean;
  deathDate?: string;
  names?: {
    givenName?: string;
    middleName?: string;
    familyName?: string;
  }[];
  addresses?: {
    country?: string;
    address1?: string;
    address2?: string;
    address4?: string;
    address7?: string;
    address10?: string;
    countyDistrict?: string;
    stateProvince?: string;
    cityVillage?: string;
    longitude?: string;
    latitude?: string;
  }[];
  attributes?: {
    value: string | number;
    attributeType: string;
  }[];
}
