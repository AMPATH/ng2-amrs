import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { OrderResourceService } from '../openmrs-api/order-resource.service';

@Injectable()
export class LabOrdersSearchService {
  public labOrderSearch: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public searchString: string = '';

  constructor(private resouceService: OrderResourceService) {

  }

  searchLabOrder(searchText: string, cached: boolean): Observable<any> {
    let labOrderSearch: Subject<any> = new Subject<any>();
    this.resouceService.getOrderByUuid(searchText.trim())
      .subscribe(
      (labOrder) => {
        this.searchString = searchText.trim();
        labOrderSearch.next(labOrder);
        this.labOrderSearch.next(labOrder);
      },
      (error) => {
        this.labOrderSearch.error(error); // test case that returns error
        labOrderSearch.error(error);

      }
      );
    return labOrderSearch.asObservable();
  }


  resetLabOrder() {
    this.labOrderSearch.next(null);
  }

}
