import { BaseModel } from './base-model.model';
import { serializable } from './serializable.decorator';

export class Form extends BaseModel {

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
