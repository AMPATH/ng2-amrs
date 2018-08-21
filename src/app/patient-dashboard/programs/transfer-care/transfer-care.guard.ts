
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { ProgramsTransferCareService } from './transfer-care.service';

@Injectable()
export class ProgramsTransferCareGuard implements CanActivate {
  private confirmMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  private hasPayload: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private transferCareService: ProgramsTransferCareService,
              private confirmationService: ConfirmationService) {
  }

  public canActivate(routeSnapshot: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> {
    return of(true).pipe(map(() => {
      this.transferCareService.getPayload().subscribe((payload) => {
        if (payload) {
          let head: string;
          switch (payload.transferType) {
            case 'AMPATH':
              head = 'Intra-AMPATH transfer';
              break;
            case 'NON-AMPATH':
              head = 'Extra-AMPATH transfer';
              break;
            case 'DISCHARGE':
              head = 'Discharge';
              break;
          }
          this.hasPayload.next(true);
          this.confirmMessage.next({
            icon: 'fa fa-info',
            header: 'Transfer complete',
            message: head + ' has been completed successfully.',
            rejectVisible: false,
            acceptVisible: false
          });
        }
      });
      if (this.hasPayload.getValue() && this.transferCareService.transferComplete()) {
        this.confirmationService.confirm(this.confirmMessage.getValue());
        this.transferCareService.setTransferStatus(false);
      }
      return true;
    }));
  }
}
