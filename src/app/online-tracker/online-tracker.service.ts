import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { SessionService } from '../openmrs-api/session.service';
import { take } from 'rxjs/operators';

@Injectable()
export class OnlineTrackerService {

  public isOnline = false;

  constructor(private _sessionService: SessionService) {

  }

  public updateOnlineStatus() {
  // console.log('Online Tracker Service: updateOnlineStatus');
    return new Promise((resolve, reject) => {

      this._sessionService.getSession()
        .pipe(take(1)).subscribe(
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
