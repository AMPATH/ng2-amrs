import { BaseModel } from './base-model.model';
import { serializable, serialize } from './serializable.decorator';
import './date.extensions';

export class Program extends BaseModel {
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

  @serializable()
  public get concept(): string {
    return this._openmrsModel.concept;
  }

  @serializable()
  public get description(): string {
    return this._openmrsModel.description;
  }

  public set description(v: string) {
    this._openmrsModel.description = v;
  }
}
