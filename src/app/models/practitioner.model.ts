export interface ContactInfo {
  email: string;
  phone: string;
  postal_address: string;
}

export interface License {
  id: string;
  license_end: string;
  license_type: string;
  license_start: string;
  external_reference_id: string;
}

export interface Membership {
  id: string;
  gender: string;
  status: string;
  full_name: string;
  is_active: number;
  last_name: string;
  specialty: string;
  first_name: string;
  salutation: string;
  middle_name: string;
  is_withdrawn: number;
  licensing_body: string;
  registration_id: string;
  withdrawal_date: string;
  withdrawal_reason: string;
  external_reference_id: string;
}

export interface Identifiers {
  student_id: string;
  client_registry_id: string;
  identification_type: string;
  identification_number: string;
}

export interface ProfessionalDetails {
  specialty: string;
  subspecialty: string;
  practice_type: string;
  discipline_name: string;
  professional_cadre: string;
  educational_qualifications: string;
}

export interface Practitioner {
  contacts: ContactInfo;
  licenses: License[];
  membership: Membership;
  identifiers: Identifiers;
  professional_details: ProfessionalDetails;
}

export interface PractitionerSearchParams {
  nationalId?: string;
  name?: string;
  licenseNumber?: string;
}

export interface ErrorPractitionerResp {
  error: string;
}
export interface PractitionerResp {
  message: Practitioner;
}
