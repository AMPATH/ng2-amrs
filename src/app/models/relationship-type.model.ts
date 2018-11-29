import {BaseModel} from './base-model.model';
import {serializable} from './serializable.decorator';
import './date.extensions';

export class RelationshipType extends BaseModel {

  constructor(openmrsModel?: any) {
    super(openmrsModel);
    const o = this._openmrsModel;
  }

  @serializable()
  public get display(): string {
    return this._openmrsModel.display;
  }

  public set display(v: string) {
    this._openmrsModel.display = v;
  }

}
