import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { SessionService } from '../openmrs-api/session.service';

@Injectable()
export class OnlineTrackerService {

  public isOnline: boolean = false;

  constructor(private _sessionService: SessionService) {

  }

  public updateOnlineStatus() {
    // console.log('Online Tracker Service: updateOnlineStatus');
    return new Promise((resolve, reject) => {

      this._sessionService.getSession()
        .subscribe(
          (results) => {
            this.isOnline = true;
            resolve(this.isOnline);
          }, (error) => {
            this.isOnline = false;
            resolve(this.isOnline);
          });

    });
  }

}
