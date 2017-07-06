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
          let filterd = mainArray.filter((item) => {
                let result =  (item.date !== '00:00') && (item.type === 'parent' ||
                _.includes(encounterFilterTypeArray , item.encounterType));

                return result;
          });

          return filterd;
       }

  }

}
