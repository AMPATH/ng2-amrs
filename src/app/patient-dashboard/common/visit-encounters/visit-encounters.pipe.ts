import { EncounterType } from '../../../models/encounter-type.model';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe(
    {
         name: 'myVisitEncountersPipe',
         pure: false
    }
)

export class VisitEncountersPipe implements PipeTransform {

  public transform(mainArray, encounterFilterTypeArray) {
       if (mainArray.length === 0 || encounterFilterTypeArray.length === 0) {
            return mainArray;
       } else {

         const encounterInArray = (encounter) => {
              return _.includes(encounterFilterTypeArray , encounter.encounter);
         };

         const filteredVisits = mainArray.filter((visit) => {
                 const visitEncounters = visit.encounters.filter(encounterInArray);

                 return visitEncounters.length > 0;
         });

         return filteredVisits;

       }

  }

}
