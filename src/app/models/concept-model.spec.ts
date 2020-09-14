/**
 * concept-class
 */
import { BaseModel } from './base-model.model';
import { serializable } from './serializable.decorator';

export class ConceptClass extends BaseModel {
  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  @serializable()
  public get name(): string {
    return this._openmrsModel.name;
  }

  @serializable()
  public get description(): string {
    return this._openmrsModel.description;
  }

  @serializable()
  public get retired(): string {
    return this._openmrsModel.retired;
  }
}
