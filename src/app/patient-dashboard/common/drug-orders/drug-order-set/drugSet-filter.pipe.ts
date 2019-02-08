import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
    name: 'drugSetFilter',
    pure: false
})
@Injectable()
export class DrugSetFilterPipe implements PipeTransform {
    public transform(drugSetOrders: any, searchText: any): any {
    if (searchText == null) {
      return drugSetOrders;
    }

    return drugSetOrders.filter((drugSetOrder) => {
      return drugSetOrder.display.toUpperCase().indexOf(searchText.toUpperCase()) > -1;
    });
  }
}
