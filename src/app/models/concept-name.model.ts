/**
 * concept-class
 */
import { BaseModel } from './base-model.model';
import { serializable, serialize } from './serializable.decorator';

export class ConceptName extends BaseModel {
  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  @serializable()
  public get name(): string {
    return this._openmrsModel.name;
  }

  @serializable()
  public get conceptNameType(): string {
    return this._openmrsModel.conceptNameType;
  }
}
