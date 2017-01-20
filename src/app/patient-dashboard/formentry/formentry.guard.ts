import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
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
      if (component.preserveFormAsDraft) {
        component.setCurrentFormDraftedForm();
      }
      observer.next(true);
    }).first();
  }
}
