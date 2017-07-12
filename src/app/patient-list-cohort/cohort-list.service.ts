import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject }    from 'rxjs/Rx';

@Injectable()
export class CohortListService {
  editCohort: any;
  private isEditCohort = new BehaviorSubject(this.editCohort);

  public setData(data: any) {
    this.isEditCohort.next(data);
  }
  public getData() {
    return this.isEditCohort;
  }
}
