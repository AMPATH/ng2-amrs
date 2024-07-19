export interface ReturnValue {
  hasDifferentiatedCareReferal: boolean;
  isInterMovementForm: boolean;
  hasInterFacilityReferral: boolean;
  hasTransitionReferral: boolean;
  hasTbTreatmentReferral: boolean;
  hasPmtctReferral: boolean;
  hasActgReferral: boolean;
  hasInpatientCareReferral: boolean;
  hasBackToCareReferral: boolean;
  hasPppReferral: boolean;
  hasPatientPreferenceReferral: boolean;
  hasStandardHivCareReferral: boolean;
  rtcDate: Date;
  encounterDatetime: Date;
  providerUuid: string;
  locationUuid: string;
  hivReferralLocationUuid: string;
  pmtctProgrammeUuid: string;
}
