import { Component, OnInit , OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';

import { SessionService } from '../openmrs-api/session.service';
import { OnlineTrackerService } from './online-tracker.service';

@Component({
  selector: 'online-tracker',
  templateUrl: './online-tracker.component.html'
})
export class OnlineTrackerComponent implements OnInit, OnDestroy {
  public isOnline: boolean = false;
  public isUpdating: boolean = false;
  public timer: Observable<any>;
  public subscribeToTimer: boolean = true;

  constructor(private _onlineTrackerService: OnlineTrackerService) {
  }

  public ngOnInit() {
    console.log('Tracker Loaded');
    this.timer = Observable.timer(1000, 30000);
    this.timer
      .takeWhile(() => this.subscribeToTimer)
      .subscribe((t) => this.getOnlineStatus());
  }

  public ngOnDestroy() {
    this.subscribeToTimer = false;
    console.log('Timer Unsubscription');
  }

  public getOnlineStatus() {
    this.isUpdating = true;
    this._onlineTrackerService.updateOnlineStatus()
      .then((results: any) => {
        if (results) {
          this.isOnline = results;
          this.isUpdating = !results;
        }
      }).catch((error) => {
      this.isOnline = false;
      console.error('ERROR: GetOnline Status Error', error);
    });
  }
}
