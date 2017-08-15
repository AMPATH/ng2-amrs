import { EncounterType } from './../../models/encounter-type.model';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe(
    {
         name: 'visitEncountersPipe',
         pure: false
    }
)

export class VisitEncountersPipe implements PipeTransform {

  transform(mainArray, encounterFilterTypeArray) {
       if (mainArray.length === 0 || encounterFilterTypeArray.length === 0) {
            return mainArray;
       } else {

         let encounterInArray = function(encounter){
              return _.includes(encounterFilterTypeArray , encounter.encounter);
         };

         let filteredVisits = mainArray.filter((visit) => {
                 let visitEncounters = visit.encounters.filter(encounterInArray);

                 return visitEncounters.length > 0;
         });

         return filteredVisits;

       }

  }

}
