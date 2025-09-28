const HOUSE_HOLD_NUMBER_UUID = 'bb74b20e-dcee-4f59-bdf1-2dffc3abf106';
const SHA_UUID = 'cf5362b2-8049-4442-b3c6-36f870e320cb';
const CLIENT_REGISTRY_NO_UUID = 'e88dc246-3614-4ee3-8141-1f2a83054e72';
const NATIONAL_ID_UUID = '58a47054-1359-11df-a1f1-0026b9348838';
const PROVIDER_NATIONAL_ID_UUID = '4550df92-c684-4597-8ab8-d6b10eabdcfb';
const REFUGEE_ID_UUID = '465e81af-8d69-47e9-9127-53a94adc75fb';
const MANDATE_NUMBER_UUID = 'aae2d097-20ba-43ca-9b71-fd8296068f39';
const ALIEN_ID_UUID = '12f5b147-3403-4a73-913d-7ded9ffec094';
const TEMPORARY_DEPENDANT_ID_UUID = 'a3d34214-93e8-4faf-bf4d-0272eee079eb';

export const IdentifierTypesUuids = {
  HOUSE_HOLD_NUMBER_UUID,
  SHA_UUID,
  CLIENT_REGISTRY_NO_UUID,
  NATIONAL_ID_UUID,
  PROVIDER_NATIONAL_ID_UUID,
  REFUGEE_ID_UUID,
  MANDATE_NUMBER_UUID,
  ALIEN_ID_UUID,
  TEMPORARY_DEPENDANT_ID_UUID
};

export enum HieClientVerificationIdentifierType {
  NationalID = 'National ID',
  RefugeeID = 'Refugee ID',
  AlienID = 'Alien ID',
  MandateNumber = 'Mandate Number'
}
