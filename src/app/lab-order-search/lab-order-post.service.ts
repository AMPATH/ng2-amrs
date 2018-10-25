
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabOrderResourceService } from '../etl-api/lab-order-resource.service';

@Injectable()
export class LabOrderPostService {

  constructor(private resouceService: LabOrderResourceService) {

  }

  public postOrderToEid(location, payload: any): Observable<any> {
    return this.resouceService.postOrderToEid(location, payload);
  }
}
