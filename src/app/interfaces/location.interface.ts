export interface Location {
  uuid: string;
  display: string;
  name: string;
  description: string;
}

export interface LocationResponseLink {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface AmrsLocationResponse {
  results: Location[];
  links: LocationResponseLink[];
}
