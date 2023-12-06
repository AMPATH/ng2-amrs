import { BaseModel } from './base-model.model';
import { serializable } from './serializable.decorator';
import * as _ from 'lodash';
const program_visits_config = require('../program-visit-encounter-search/program-visits-config.json');

export class Group extends BaseModel {
  constructor(openmrsModel?: any) {
    super(openmrsModel);
    this._openmrsModel.display = this._openmrsModel.name;
  }

  @serializable()
  public get groupNumber(): string {
    const attrType = 'groupNumber';
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
    const attrType = 'landmark';
    return this.getAttribute(attrType, this._openmrsModel.attributes);
  }

  @serializable()
  public get status() {
    const lastMeetingDate = this.getLatestMeetingDate(
      this._openmrsModel.cohortVisits
    );
    // if last meeting date is more than 3 months ago, group is inactive
    if (lastMeetingDate) {
      const today = new Date();
      const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
      if (lastMeetingDate < threeMonthsAgo) {
        return 'Inactive';
      }
    }
    return this._openmrsModel.endDate ? 'Disbanded' : 'Active';
  }

  @serializable()
  public get program() {
    const attrType = 'programUuid';
    const programUuid = this.getAttribute(
      attrType,
      this._openmrsModel.attributes
    );
    if (programUuid) {
      if (program_visits_config[programUuid]) {
        return program_visits_config[programUuid]['name'];
      }
    } else {
      return null;
    }
  }

  @serializable()
  public get groupCount() {
    return this.getGroupMembersCount(this._openmrsModel.cohortMembers);
  }

  @serializable()
  public get otzChampion() {
    const attrType = this.getCurrentLeader(this._openmrsModel.cohortLeaders);
    if (attrType) {
      return attrType.person.display.replace(/\d+|-/g, '');
    }
    return null;
  }

  @serializable()
  public get groupActivity() {
    const attrType = 'groupActivity';
    return this.getAttribute(attrType, this._openmrsModel.attributes);
  }

  @serializable()
  public get viralSuppression() {
    return Math.floor(Math.random() * 100) + 1 + '%';
  }

  @serializable()
  public get lastMeetingDate() {
    return this.getLatestMeetingDate(this._openmrsModel.cohortVisits);
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

  public getLatestMeetingDate(startDates) {
    if (startDates.length > 0) {
      const latestStartDateString = startDates.reduce(
        (maxDate, currentDateObject) => {
          const currentStartDate = new Date(currentDateObject.startDate);
          const maxStartDate = maxDate ? new Date(maxDate.startDate) : null;

          if (!maxStartDate || currentStartDate > maxStartDate) {
            return currentDateObject;
          } else {
            return maxDate;
          }
        },
        null
      ).startDate;
      return new Date(latestStartDateString);
    }
  }

  public getGroupMembersCount(cohortMembers) {
    const active_members = cohortMembers.filter(
      (current) => current.endDate == null
    );
    return active_members ? active_members.length : 0;
  }

  public getCurrentLeader(allLeaders: any[]) {
    const currentLeader = _.filter(
      allLeaders,
      (leader) => leader.endDate == null
    )[0];
    return currentLeader;
  }
}
