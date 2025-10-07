export interface FhirBundle {
  resourceType: 'Bundle';
  id: string;
  meta: Meta;
  type: string;
  link: BundleLink[];
  entry: BundleEntry[];
}

export interface Meta {
  versionId?: string;
  lastUpdated: string;
  source?: string;
  profile?: string[];
}

export interface BundleLink {
  relation: string;
  url: string;
}

export interface BundleEntry {
  fullUrl: string;
  resource: FhirResource;
  search: { mode: string };
}

export interface ShrIdentifier {
  use?: string;
  system?: string;
  value?: string;
  type?: CodeableConcept;
}

export interface Reference {
  reference?: string;
  type?: string;
  identifier?: ShrIdentifier;
  display?: string;
}

export interface ShrCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface CodeableConcept {
  coding?: ShrCoding[];
  text?: string;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface Annotation {
  authorString?: string;
  time?: string;
  text?: string;
}

export type FhirResource =
  | ShrPatient
  | ShrEncounter
  | ShrCondition
  | ShrServiceRequest
  | ShrObservation
  | ShrSpecimen;

export interface ShrPatient {
  resourceType: 'Patient';
  id: string;
  meta: Meta;
  identifier?: ShrIdentifier[];
  name?: {
    text?: string;
    family?: string;
    given?: string[];
  }[];
  gender?: string;
  birthDate?: string;
}

export interface ShrEncounter {
  resourceType: 'Encounter';
  id: string;
  meta: Meta;
  identifier?: ShrIdentifier[];
  status?: string;
  class?: ShrCoding;
  type?: CodeableConcept[];
  priority?: CodeableConcept;
  subject?: Reference;
  participant?: {
    individual?: {
      identifier?: ShrIdentifier;
    };
  }[];
  period?: Period;
  serviceProvider?: Reference;
}

export interface ShrCondition {
  resourceType: 'Condition';
  id: string;
  meta: Meta;
  identifier?: ShrIdentifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  severity?: CodeableConcept;
  code?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  recordedDate?: string;
  note?: Annotation[];
}

export interface ShrServiceRequest {
  resourceType: 'ServiceRequest';
  id: string;
  meta: Meta;
  contained?: (ShrObservation | ShrSpecimen)[];
  identifier?: ShrIdentifier[];
  status?: string;
  intent?: string;
  category?: CodeableConcept[];
  priority?: string;
  subject?: Reference;
  encounter?: Reference;
  occurrencePeriod?: Period;
  occurrenceDateTime?: string;
  authoredOn?: string;
  requester?: Reference;
  performer?: Reference[];
  reasonCode?: CodeableConcept[];
  note?: Annotation[];
}

export interface ShrObservation {
  resourceType: 'Observation';
  id: string;
  status?: string;
  code?: CodeableConcept;
  subject?: Reference;
  valueCodeableConcept?: CodeableConcept;
}

export interface ShrSpecimen {
  resourceType: 'Specimen';
  id: string;
  identifier?: ShrIdentifier[];
  type?: CodeableConcept;
  subject?: Reference;
  collection?: {
    collectedDateTime?: string;
  };
}
