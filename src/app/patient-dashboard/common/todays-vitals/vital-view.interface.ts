import { Vital } from '../../../models/vital.model';

export interface VitalViewInterface {
  value?: ((vital: Vital) => string | number) | string | number;
  label: (() => string) | string;
  name: string;
  order?: number;
  vital?: Vital;
  isCompoundedWith?: string;
  compoundValue?: ((vital: Vital, compoundWith: string) => string | number) | string | number;
  color?:  (() => string) | string;
  show:  ((args?: any) => boolean) | boolean;
}
