import { Component, OnInit , OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
    this.timer = Observable.timer(1000, 30000);
    this.timer
      .takeWhile(() => this.subscribeToTimer)
      .subscribe((t) => this.getOnlineStatus());
  }

  public ngOnDestroy() {
    this.subscribeToTimer = false;
  }

  public getOnlineStatus() {
    this.isUpdating = true;
    this._onlineTrackerService.updateOnlineStatus()
      .then((results: any) => {
        this.isOnline = results;
        this.isUpdating = false;
      }).catch((error) => {
      this.isOnline = false;
      console.error('ERROR: GetOnline Status Error', error);
    });
  }
}
