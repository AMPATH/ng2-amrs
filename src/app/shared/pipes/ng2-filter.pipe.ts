/* tslint:disable:forin */
import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
  pure: false
})

@Injectable()
export class Ng2FilterPipe implements PipeTransform {
  public transform(array: any[], filter: any): any {
    const type = typeof filter;

    if (type === 'string') {
      if (this.isNumber(filter)) {
        return array.filter(this.filterDefault(filter));
      }

      return array.filter(this.filterByString(filter));
    }

    if (type === 'object') {
      return array.filter(this.filterByObject(filter));
    }

    return array.filter(this.filterDefault(filter));
  }

  private filterByString(filter) {
    filter = filter.toLowerCase();
    return (value) => {
      return !filter || value.toLowerCase().indexOf(filter) !== -1;
    };
  }

  private filterByObject(filter) {
    return (value) => {
      for (const key in filter) {
        if (!value.hasOwnProperty(key)) {
          return false;
        }

        const type = typeof value[key];
        let isMatching;

        if (type === 'string') {
          isMatching = this.filterByString(filter[key])(value[key]);
        } else if (type === 'object') {
          isMatching = this.filterByObject(filter[key])(value[key]);
        } else {
          isMatching = this.filterDefault(filter[key])(value[key]);
        }

        if (!isMatching) {
          return false;
        }
      }

      return true;
    };
  }

  /**
   * Defatul filterDefault function
   *
   * @param filter
   * @returns {(value:any)=>boolean}
   */
  private filterDefault(filter) {
    return (value) => {
      return !filter || filter === value;
    };
  }

  private isNumber(value) {
    return !isNaN(parseInt(value, 10)) && isFinite(value);
  }

}
