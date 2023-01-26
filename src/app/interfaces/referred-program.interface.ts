import { ReturnValue } from './return-value.interface';

export interface ReferredProgram {
  uuid: string;
  name: string;
  locationUuid: string;
  providerUuid: string;
  referralMetaData: ReturnValue;
}
