import { BaseModel } from './base-model.model';
import { serializable, serialize } from './serializable.decorator';
import './date.extensions';


export class Person extends BaseModel {
  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  @serializable()
  public get gender(): string {
    return this._openmrsModel.gender;
  }
  public set gender(v: string) {
    this._openmrsModel.gender = v;
  }

  @serializable(true,false)
  public get age(): number {
    return this._openmrsModel.age;
  }
  public set age(v: number) {
    this._openmrsModel.age = v;
  }

  private _birthdate: Date;
  @serializable()
  public get birthdate(): Date {
    if (this._birthdate === null || this._birthdate === undefined) {
      this._birthdate = new Date(this._openmrsModel.birthdate);
    }
    return this._birthdate;
  }
  public set birthdate(v: Date) {
    this._openmrsModel.birthdate = v.toServerTimezoneString();
    this._birthdate = v;
  }

  @serializable(false,true)
  public get preferredName(): string {
    return this._openmrsModel.preferredName;
  }
  public set preferredName(v: string) {
    this._openmrsModel.preferredName = v;
  }



}

