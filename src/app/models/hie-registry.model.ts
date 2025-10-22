export enum HieIdentificationType {
  NationalID = 'National ID',
  SHANumber = 'SHA Number',
  HouseholdNumber = 'Household Number',
  RefugeeID = 'Refugee ID',
  AlienID = 'Alien ID',
  MandateNumber = 'Mandate Number',
  Cr = 'id',
  TemporaryDependantID = 'Temporary Dependant ID'
}

export interface HieIdentifications {
  identification_number: string;
  identification_type: HieIdentificationType;
}

export interface HieDependant {
  date_added: string;
  relationship: string;
  total: number;
  result: HieClient[];
}

export interface AlternateContact {
  contact_type: string;
  contact_id: string;
  contact_name: string;
  relationship: string;
  remarks: string;
}

export interface HieClient {
  resourceType: string;
  id: string;
  meta: {
    versionId: string;
    creationTime: string;
    lastUpdated: string;
    source: string;
  };
  originSystem: {
    system: string;
    record_id: string;
  };
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  place_of_birth: string;
  person_with_disability: number;
  citizenship: string;
  kra_pin: string;
  preferred_primary_care_network: string;
  employment_type: string;
  domestic_worker_type: string;
  civil_status: string;
  identification_type: HieIdentificationType;
  identification_number: string;
  other_identifications: HieIdentifications[];
  dependants: HieDependant[];
  is_alive: number;
  deceased_datetime: string;
  phone: string;
  biometrics_verified: number;
  biometrics_score: number;
  email: string;
  country: string;
  county: string;
  sub_county: string;
  ward: string;
  village_estate: string;
  building_house_no: string;
  latitude: string;
  longitude: string;
  province_state_country: string;
  zip_code: string;
  identification_residence: string;
  employer_name: string;
  employer_pin: string;
  disability_category: string;
  disability_subcategory: string;
  disability_cause: string;
  in_lawful_custody: string;
  admission_remand_number: string;
  document_uploads: any[];
  alternative_contacts: AlternateContact[];
  gross_income: number;
  gross_income_currency: string;
  postal_address: string;
  estimated_contribution: number;
  estimated_annual_contribution: number;
  city: string;
  id_serial: string;
  learning_institution_code: string;
  learning_institution_name: string;
  grade_level: string;
  admission_number: string;
  expected_year_of_graduation: string;
  unconfirmed_dependants: HieDependant[];
  is_agent: number;
  agent_id: string;
}

export interface HieClientSearchDto {
  identificationNumber: number | string;
  identificationType: HieIdentificationType;
  locationUuid: string;
}

export interface HieAmrsObj {
  key: string;
  title: string;
  hieValue: string | number | boolean;
  amrsValue: string | number | boolean;
}

export interface ValidateHieCustomOtpDto {
  sessionId: string;
  otp: number | string;
  locationUuid: string;
}

export type HieOtpValidationStatus = 'valid' | 'invalid';

export interface ValidateHieCustomOtpResponse {
  data: {
    identification_type: string;
    identification_number: string;
    status: HieOtpValidationStatus;
  };
}

export interface ValidateHieCustomOtpErrorResponse {
  error: string;
  details: string;
}

export interface RequestCustomOtpDto {
  identificationNumber: string | number;
  identificationType: string;
  locationUuid: string;
}

export interface RequestCustomOtpResponse {
  message: string;
  sessionId: string;
  maskedPhone: string;
}
export interface RequestCustomOtpErrorResponse {
  error: string;
  details: string;
}

export interface HieClientDependant extends HieClient {
  date_added: string;
  relationship: string;
}

export interface HieFacility {
  id: string;
  facility_name: string;
  registration_number: string;
  facility_code: string;
  regulator: string;
  facility_level: string;
  facility_category: string;
  facility_owner: string;
  facility_type: string;
  county: string;
  sub_county: string;
  ward: string;
  found: number;
  approved: number;
  operational_status: string;
  current_license_expiry_date: string;
}

export interface HieFacilitySearchResponse {
  message: HieFacility;
}

export interface FacilitySearchFilter {
  filterType: string;
  filterValue: string;
  locationUuid: string;
}

export enum FacilitySearchFilterType {
  location = 'location',
  facilityCode = 'facilityCode',
  registrationNumber = 'registrationNumber'
}
