import { BaseModel } from './base-model.model';
import { serializable } from './serializable.decorator';
import { Person } from './person.model';

export class Provider extends BaseModel {
  private _person = this.openmrsModel.person;

  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }
  @serializable()
  public get person(): Person {
    if (this._person === null || this._person === undefined) {
      this.initializeNavigationProperty('person');
      this._person = new Person(this._openmrsModel.person);
    }
    return this._person;
  }

  public set person(v: Person) {
    this._openmrsModel.person = v.openmrsModel;
    this._person = v;
  }
  @serializable()
  public get identifier(): string {
    return this._openmrsModel.identifier;
  }
  public set identifier(v: string) {
    this._openmrsModel.identifier = v;
  }
}
