import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
    name: 'drugsFilter',
    pure: false
})
@Injectable()
export class DrugsFilterPipe implements PipeTransform {
    public transform(drugOrders: any, searchText: any): any {
    if (searchText == null) {
      return drugOrders;
    }

    return drugOrders.filter((drugOrder) => {
      return drugOrder.display.toUpperCase().indexOf(searchText.toUpperCase()) > -1;
    });
  }
}
