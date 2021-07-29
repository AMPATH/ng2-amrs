import { BaseModel } from "./base-model.model";
import { serializable } from "./serializable.decorator";
import * as _ from "lodash";
const program_visits_config = require("../program-visit-encounter-search/program-visits-config.json");

export class Group extends BaseModel {
  constructor(openmrsModel?: any) {
    super(openmrsModel);
    this._openmrsModel.display = this._openmrsModel.name;
  }

  @serializable()
  public get groupNumber(): string {
    const attrType = "groupNumber";
    return this.getAttribute(attrType, this._openmrsModel.attributes);
  }

  @serializable()
  public get facility() {
    return this._openmrsModel.location.display;
  }

  @serializable()
  public get voided() {
    return this._openmrsModel.voided;
  }

  @serializable()
  public get endDate() {
    return this._openmrsModel.endDate;
  }

  @serializable()
  public get landmark() {
    const attrType = "landmark";
    return this.getAttribute(attrType, this._openmrsModel.attributes);
  }

  @serializable()
  public get status() {
    return this._openmrsModel.voided ? "Disbanded" : "Active";
  }

  @serializable()
  public get program() {
    const attrType = "programUuid";
    const programUuid = this.getAttribute(
      attrType,
      this._openmrsModel.attributes
    );
    if (programUuid) {
      if (program_visits_config[programUuid]) {
        return program_visits_config[programUuid]["name"];
      }
    } else {
      return null;
    }
  }

  @serializable()
  public get groupCount() {
    return this.getGroupMembersCount(this._openmrsModel.cohortMembers);
  }

  public getAttribute(attributeType, attributes) {
    const attr = _.filter(
      attributes,
      (attribute) => attribute.cohortAttributeType.name === attributeType
    )[0];
    if (attr) {
      return attr.value;
    }
    return null;
  }

  public getGroupMembersCount(cohortMembers) {
    const active_members = cohortMembers.filter(
      (current) => current.endDate == null
    );
    return active_members ? active_members.length : 0;
  }
}
