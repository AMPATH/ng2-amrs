import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
  name: 'proceduresFilter',
  pure: false
})
@Injectable()
export class ProceduresFilterPipe implements PipeTransform {
  public transform(selectedOrdersWithObs: any, searchText: any): any {
    if (searchText == null) {
      return selectedOrdersWithObs;
    }

    return selectedOrdersWithObs.filter((procedureOrder) => {
      return procedureOrder.display.toUpperCase().indexOf(searchText.toUpperCase()) > -1;
    });
  }
}

