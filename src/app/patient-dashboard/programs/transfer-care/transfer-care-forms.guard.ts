import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { ProgramsTransferCareFormWizardComponent } from './transfer-care-form-wizard.component';
import { ProgramsTransferCareService } from './transfer-care.service';

@Injectable()
export class ProgramsTransferCareFormWizardGuard implements
  CanDeactivate<ProgramsTransferCareFormWizardComponent> {
  private confirmMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private transferCareService: ProgramsTransferCareService,
              private confirmationService: ConfirmationService) {
  }

  public canDeactivate(): Observable<boolean> {
    if (this.transferCareService.transferComplete()) {
      return Observable.of(true);
    }
    // confirm with user
    return Observable.create((observer: Subject<boolean>) => {
      this.transferCareService.getPayload().subscribe((payload) => {
        let head: string;
        if (payload) {
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
          this.confirmMessage.next({
            icon: 'fa fa-exclamation-triangle fa-3x',
            header: head + ' process is not complete',
            message: 'If you do not complete this process, ' + head.toLowerCase() +
            ' will not happen. Are you sure you want to proceed?',
            rejectVisible: true,
            acceptVisible: true,
            accept: () => {
              observer.next(true);
              observer.complete();
            },
            reject: () => {
              observer.next(false);
              observer.complete();
            }
          });
        }
      });

      if (this.confirmMessage.value && !this.transferCareService.transferComplete()) {
        this.confirmationService.confirm(this.confirmMessage.getValue());
        this.confirmMessage.next(null);
        return false;
      } else {
        return true;
      }
    }).first();
  }
}
