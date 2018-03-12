import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'zeroVl' })
export class ZeroVlPipe implements PipeTransform {

  public transform(vl) {
    if (vl === 0 || vl === '0') {
           return 'LDL';
       }else {
           return vl;
    }
  }

}
