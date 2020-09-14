import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable()
export class FormentryHelperService {
  constructor() {}

  public toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  public encounterTypeFilled(encounters, encounterType, referenceDate) {
    const compconstedEncounterTypesUuids = encounters
      .filter((encounter) => {
        const isFilled = this.compareDate(
          encounter.encounterDatetime,
          referenceDate
        );
        return isFilled;
      })
      .map((encounter) => {
        return encounter.encounterType.uuid;
      });
    return _.includes(compconstedEncounterTypesUuids, encounterType);
  }

  public getLastDuplicateEncounter(encounters, encounterType, encounterDate) {
    const duplicateEncounter = _.find(encounters, (encounter: any) => {
      const isDuplicate =
        this.compareDate(encounter.encounterDatetime, encounterDate) &&
        encounter.encounterType.uuid === encounterType;
      return isDuplicate;
    });
    return duplicateEncounter;
  }

  public compareDate(date1, date2) {
    const internalDate1 = new Date(date1);
    const internalDate2 = new Date(date2);
    return internalDate1.toDateString() === internalDate2.toDateString();
  }
}
