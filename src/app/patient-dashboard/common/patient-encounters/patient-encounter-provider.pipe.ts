import { EncounterType } from '../../../models/encounter-type.model';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe(
    {
         name: 'patientEncounterProviderPipe',
         pure: true
    }
)

export class PatientEncounterProviderPipe implements PipeTransform {

  public transform(provider) {
       if (provider.length === 0) {
            return provider;
       } else {

          let providerName = provider.split('-')[2];

          if (typeof providerName !== 'undefined') {
                    return providerName;
              }else {
                console.error('ERROR : Undefined Provider Name', providerName);
                return '';
            }

       }

  }

}
