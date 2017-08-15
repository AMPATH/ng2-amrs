import { Pipe, PipeTransform } from '@angular/core';
import * as Moment from 'moment';
/**
 * Pipe format a date
 */
@Pipe({name: 'stringToDate'})
export class StringToDatePipe implements PipeTransform {
  constructor() {
  }

  public transform(value: string, format: string): any {
    let formatted = '';
    if (value) {
      formatted = Moment(value).format(format);
    }
    return formatted;
  }
}
