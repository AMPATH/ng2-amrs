
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { OrderResourceService } from '../openmrs-api/order-resource.service';

@Injectable()
export class LabOrdersSearchService {
  public labOrderSearch: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public searchString = '';

  constructor(private resouceService: OrderResourceService) {

  }

  public searchLabOrder(searchText: string, cached: boolean): Observable<any> {
    const labOrderSearch: Subject<any> = new Subject<any>();
    this.resouceService.getOrderByUuid(searchText.trim()).pipe(
      take(1)).subscribe(
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

  public resetLabOrder() {
    this.labOrderSearch.next(null);
  }

}
