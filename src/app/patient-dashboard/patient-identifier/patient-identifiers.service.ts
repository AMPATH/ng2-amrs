import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Patient } from '../../models/patient.model';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';

@Injectable()
export class PatientIdentifierService {
  locations: any [];
  constructor(private resouceService: PatientResourceService,
              private locationResourceService: LocationResourceService) {

  }
  public getLuhnCheckDigit(numbers) {
    let validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_';
    numbers = numbers.toUpperCase().trim();
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      let ch = numbers.charAt(numbers.length - i - 1);
      if (validChars.indexOf(ch) < 0) {
        console.log('Invalid character(s) found!');
        return false;
      }
      let digit = ch.charCodeAt(0) - 48;
      let weight;
      if (i % 2 === 0) {
        let res = digit / 5;
        weight = (2 * digit) - parseInt( res.toString() , 10) * 9;
      } else {
        weight = digit;
      }
      sum += weight;
    }
    sum = Math.abs(sum) + 10;
    let digit = (10 - (sum % 10)) % 10;
    console.log('Lunh Check Digit Is =' + digit);
    return digit;

}

  public checkRegexValidity(expression, identifier) {
    let identifierRegex = new RegExp('^' + expression + '$');
    return (identifierRegex.test(identifier));
  }

  public commonIdentifierTypes() {
    return ['KENYAN NATIONAL ID NUMBER',
      'AMRS Medical Record Number',
      'AMRS Universal ID',
      'CCC Number'];
  }

}
