import { BaseModel } from './base-model.model';
import { VitalView } from '../patient-dashboard/common/todays-vitals/vital-view';

export class Vital extends BaseModel {
  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  createVital(options) {
    return this.defineVitalFromOptions(options);
  }

  get name() {
    const self = this;
    if (self['model']) {
      return self['model'];
    }
  }

  defineVitalFromOptions(options: any) {
    const self = this;
    this._openmrsModel[options.name] = new VitalView(options);
    self['model'] = options.name;
    Object.defineProperty(self, options.name, {
      get: () => {
        return this._openmrsModel[options.name];
      },
      set: (new_value) => {
        this._openmrsModel[options.name] = new VitalView(new_value);
        self[options.name] = this._openmrsModel[options.name];
      }
    });
    return self;
  }
}
