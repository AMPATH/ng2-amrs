import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { LabOrderResourceService } from '../etl-api/lab-order-resource.service';

@Injectable()
export class LabOrderPostService {

  constructor(private resouceService: LabOrderResourceService) {

  }

  postOrderToEid(location, payload: any): Observable<any> {
    let postSubject: Subject<any> = new Subject<any>();
    this.resouceService.postOrderToEid(location, payload)
      .subscribe(
      (data) => {
        postSubject.next(data);
      },
      (error) => {
        postSubject.error(error);
      }
      );
    return postSubject.asObservable();
  }
}
