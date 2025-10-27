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
  showLoader = false;
  loadingMessage = null;

  constructor(private practitionerAlertService: PractitionerAlertService) {}

  ngOnInit(): void {
    this.listenToAlertChanges();
    this.practitionerAlertService.getUserAlerts();
    this.listenToLoader();
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
  listenToLoader() {
    this.practitionerAlertService.loading$
      .pipe(
        takeUntil(this.destroy$),
        tap((loadingObj) => {
          const { loading, message } = loadingObj;
          this.showLoader = loading;
          this.loadingMessage = message;
        })
      )
      .subscribe();
  }

  alertAction(action: string) {
    if (action === 'sync') {
      this.practitionerAlertService.refreshAlerts();
    }
  }

  closeAlert() {
    this.showAlert = false;
  }
}
