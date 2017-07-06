import { Pipe } from '@angular/core';

@Pipe({
  name: 'orderByAlphabetAsc',
  pure: false
})
export class OrderByAlphabetPipe {
  transform(array: Array<any>): Array<string> {
    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
