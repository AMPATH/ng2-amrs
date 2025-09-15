const HOUSE_HOLD_NUMBER_UUID = 'bb74b20e-dcee-4f59-bdf1-2dffc3abf106';
const SHA_UUID = 'cf5362b2-8049-4442-b3c6-36f870e320cb';
const CLIENT_REGISTRY_NO_UUID = 'e88dc246-3614-4ee3-8141-1f2a83054e72';
const NATIONAL_ID_UUID = '58a47054-1359-11df-a1f1-0026b9348838';
const PROVIDER_NATIONAL_ID_UUID = '4550df92-c684-4597-8ab8-d6b10eabdcfb';

export const IdentifierTypesUuids = {
  HOUSE_HOLD_NUMBER_UUID,
  SHA_UUID,
  CLIENT_REGISTRY_NO_UUID,
  NATIONAL_ID_UUID,
  PROVIDER_NATIONAL_ID_UUID
};

export enum HieClientVerificationIdentifierType {
  NationalID = 'National ID',
  RefugeeID = 'Refugee ID',
  AlienID = 'Alien ID',
  MandateNumber = 'Mandate Number'
}
