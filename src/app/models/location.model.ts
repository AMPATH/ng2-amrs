import { BaseModel } from './base-model.model';
import { serializable } from './serializable.decorator';

export class Location extends BaseModel {
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
  public get description(): string {
    return this._openmrsModel.description;
  }
  public set description(v: string) {
    this._openmrsModel.description = v;
  }

  @serializable()
  public get address1(): string {
    return this._openmrsModel.address1;
  }
  public set address1(v: string) {
    this._openmrsModel.address1 = v;
  }

  @serializable()
  public get address2(): string {
    return this._openmrsModel.address2;
  }
  public set address2(v: string) {
    this._openmrsModel.address2 = v;
  }

  @serializable()
  public get address3(): string {
    return this._openmrsModel.address3;
  }
  public set address3(v: string) {
    this._openmrsModel.address3 = v;
  }

  @serializable()
  public get address4(): string {
    return this._openmrsModel.address4;
  }
  public set address4(v: string) {
    this._openmrsModel.address4 = v;
  }

  @serializable()
  public get address5(): string {
    return this._openmrsModel.address5;
  }
  public set address5(v: string) {
    this._openmrsModel.address5 = v;
  }

  @serializable()
  public get address6(): string {
    return this._openmrsModel.address6;
  }
  public set address6(v: string) {
    this._openmrsModel.address6 = v;
  }

  @serializable()
  public get cityVillage(): string {
    return this._openmrsModel.cityVillage;
  }
  public set cityVillage(v: string) {
    this._openmrsModel.cityVillage = v;
  }

  @serializable()
  public get stateProvince(): string {
    return this._openmrsModel.stateProvince;
  }
  public set stateProvince(v: string) {
    this._openmrsModel.stateProvince = v;
  }

  @serializable()
  public get country(): string {
    return this._openmrsModel.country;
  }
  public set country(v: string) {
    this._openmrsModel.country = v;
  }

  @serializable()
  public get postalCode(): string {
    return this._openmrsModel.postalCode;
  }
  public set postalCode(v: string) {
    this._openmrsModel.postalCode = v;
  }

  @serializable()
  public get latitude(): string {
    return this._openmrsModel.latitude;
  }
  public set latitude(v: string) {
    this._openmrsModel.latitude = v;
  }

  @serializable()
  public get longitude(): string {
    return this._openmrsModel.longitude;
  }
  public set longitude(v: string) {
    this._openmrsModel.longitude = v;
  }

  @serializable()
  public get tags(): string {
    return this._openmrsModel.tags;
  }
  public set tags(v: string) {
    this._openmrsModel.tags = v;
  }

  @serializable()
  public get parentLocation(): any {
    return this._openmrsModel.parentLocation;
  }
  public set parentLocation(v: any) {
    this._openmrsModel.parentLocation = v;
  }

  @serializable()
  public get childLocations(): Array<any> {
    return this._openmrsModel.childLocations;
  }
  public set childLocations(v: Array<any>) {
    this._openmrsModel.childLocations = v;
  }

  @serializable()
  public get attributes(): string {
    return this._openmrsModel.attributes;
  }
  public set attributes(v: string) {
    this._openmrsModel.attributes = v;
  }
}
