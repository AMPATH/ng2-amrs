import { Pipe, PipeTransform } from '@angular/core';

import * as Moment from 'moment';

@Pipe({ name: 'ngamrsAge' })
export class AgePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      const todayMoment: any = Moment();
      const birthDateMoment: any = Moment(value);
      const years = todayMoment.diff(birthDateMoment, 'year');
      birthDateMoment.add(years, 'years');
      const months = todayMoment.diff(birthDateMoment, 'months');
      birthDateMoment.add(months, 'months');
      const days = todayMoment.diff(birthDateMoment, 'days');
      return years + ' y ' + months + ' m ' + days + ' d';
    }
    return '';
  }
}
