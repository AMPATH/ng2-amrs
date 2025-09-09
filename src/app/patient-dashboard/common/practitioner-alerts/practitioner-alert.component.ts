import { Component, OnDestroy, OnInit } from '@angular/core';
import { PractitionerAlertService } from './practitioner-alert.service';
import { takeUntil, tap } from 'rxjs/operators';
import { PractitionerAlert } from '../../../models/practitioner.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'practitioner-alerts',
  templateUrl: './practitioner-alert.component.html',
  styleUrls: ['./practitioner-alert.component.css']
})
export class PractionerAlertComponent implements OnInit, OnDestroy {
  showAlert = true;
  alerts: PractitionerAlert[] = [];
  destroy$ = new Subject<boolean>();

  constructor(private practitionerAlertService: PractitionerAlertService) {}

  ngOnInit(): void {
    this.listenToAlertChanges();
    this.practitionerAlertService.getUserAlerts();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  listenToAlertChanges() {
    this.practitionerAlertService.alerts$
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          this.alerts = res;
        })
      )
      .subscribe();
  }

  alertAction(action: string) {
    console.log({ action });
  }

  closeAlert() {
    this.showAlert = false;
  }
}
