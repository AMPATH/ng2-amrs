import { Injectable } from '@angular/core';

@Injectable()
export class PatientIdentifierService {
  public locations: any[];
  constructor() {
  }
  public getLuhnCheckDigit(numbers) {
    const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_';
    numbers = numbers.toUpperCase().trim();
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      const ch = numbers.charAt(numbers.length - i - 1);
      if (validChars.indexOf(ch) < 0) {
        console.log('Invalid character(s) found!');
        return false;
      }
      // tslint:disable-next-line:no-shadowed-variable
      const digit = ch.charCodeAt(0) - 48;
      let weight;
      if (i % 2 === 0) {
        const res = digit / 5;
        weight = (2 * digit) - parseInt(res.toString(), 10) * 9;
      } else {
        weight = digit;
      }
      sum += weight;
    }
    sum = Math.abs(sum) + 10;
    const digit = (10 - (sum % 10)) % 10;
    console.log('Lunh Check Digit Is =' + digit);
    return digit;

  }

  public checkRegexValidity(expression, identifier) {
    const identifierRegex = new RegExp(expression);
    return (identifierRegex.test(identifier));
  }

  public commonIdentifierTypes() {
    return [
      'KENYAN NATIONAL ID NUMBER',
      'AMRS Medical Record Number',
      'AMRS Universal ID',
      'CCC Number',
      'MTRH Hospital Number',
      'HEI',
      'KUZA ID',
      'Zuri Health ID',
      'NAT',
      'BHIM',
      'OVC ID'
    ];
  }
  public patientIdentifierTypeFormat() {
    return [
      {
        label: 'KENYAN NATIONAL ID NUMBER', format: null, checkdigit: null,
        val: '58a47054-1359-11df-a1f1-0026b9348838'
      },
      {
        label: 'AMRS Medical Record Number', format: null, checkdigit: 1,
        val: '58a46e2e-1359-11df-a1f1-0026b9348838'
      },
      {
        label: 'AMRS Universal ID', format: null, checkdigit: 1,
        val: '58a4732e-1359-11df-a1f1-0026b9348838'
      },
      {
        label: 'CCC Number', format: '^\\d{5}-\\d{5}$', checkdigit: null,
        val: 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e'
      },
      {
        label: 'MTRH Hospital Number', format: null, checkdigit: 0,
        val: '43f78399-ca5d-4c1e-acb7-b30fc327283f'
      },
      {
        label: 'HEI', format: '^\\d{5}-\\d{4}-\\d{4}$', checkdigit: 0,
        val: 'ead42a8f-203e-4b11-a942-df03a460d617'
      },
      {
        label: 'KUZA ID', format: '^KUZA\\d{5}$', checkdigit: 0,
        val: 'd1e5ef63-126f-4b1f-bd3f-496c16c4098d'
      },
      {
        label: 'Zuri Health ID', format: null, checkdigit: 0,
        val: '9cae9c8a-2821-4aa7-8064-30508e9f62ec'
      },
      {
        label: 'NAT', format: 'NAT-\\d{4}$', checkdigit: 0,
        val: '22ee6ad7-58fb-4382-9af2-c6a553f3d56a'
      },
      {
        label: 'BHIM', format: '^B\\d{5}-\\d{5}$', checkdigit: 0,
        val: '5b91df4a-db7d-4c52-ac85-ac519420d82e'
      },
    {
      label: 'OVCID', format: '^\\d{7}$', checkdigit: 0,
      val: 'ace5f7c7-c5f4-4e77-a077-5588a682a0d6'
    }
    ];
  }
}
