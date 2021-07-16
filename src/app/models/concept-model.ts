/**
 * Concept
 */
import { BaseModel } from "./base-model.model";
import { serializable } from "./serializable.decorator";
import { ConceptName } from "./concept-name.model";
import { ConceptClass } from "./concept-class.model";

export class Concept extends BaseModel {
  private _conceptName = this.openmrsModel.conceptName;
  private _conceptClass = this.openmrsModel.conceptClass;
  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  @serializable()
  public get conceptName(): ConceptName {
    if (this._conceptName === null || this._conceptName === undefined) {
      this.initializeNavigationProperty("");
      this._conceptName = new ConceptName(this._openmrsModel.conceptName);
    }
    return this._conceptName;
  }

  @serializable()
  public get conceptClass(): ConceptClass {
    if (this._conceptClass === null || this._conceptClass === undefined) {
      this.initializeNavigationProperty("");
      this._conceptClass = new ConceptClass(this._openmrsModel.conceptClass);
    }
    return this._conceptClass;
  }
}
