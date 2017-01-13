import { Injectable }     from '@angular/core';
import { Router, CanDeactivate }    from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { FormentryComponent } from './formentry.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
@Injectable()
export class FromentryGuard implements CanDeactivate<FormentryComponent> {

  constructor(private confirmationService: ConfirmationService) {
  }

  public canDeactivate(component: FormentryComponent): Observable<boolean> {
    if (!component.form || !component.form.rootNode.control.dirty) return Observable.of(true);
    return Observable.create((observer: Subject<boolean>) => {
      this.confirmationService.confirm({
        header: 'Changes Not Saved',
        message: 'Are you sure that you want to close this form?',
        accept: () => {
          observer.next(true);
        },
        reject: () => {
          observer.next(false);
        }
      });
    }).first();
  }
}
