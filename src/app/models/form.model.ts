import { BaseModel } from './base-model.model';
import { serializable } from './serializable.decorator';

export class Form extends BaseModel {
  uuid: string;
  version: string;
  published: Boolean;
  encounterType: {
    uuid: string;
    name: string;
  };
  retired: Boolean;
  retiredReason: string;
  resources: any;
  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }
  @serializable()
  public get name(): string {
    return this._openmrsModel.name;
  }
  public set name(v: string) {
    this._openmrsModel.name = v;
  }
}
