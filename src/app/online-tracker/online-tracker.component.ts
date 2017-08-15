import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';

import { SessionService } from '../openmrs-api/session.service';

@Component({
  selector: 'online-tracker',
  template: `
    <p *ngIf="isOnline" class="text-bold"><i class="fa fa-circle text-success"></i>
      <span></span>
    </p>
    <p *ngIf="!isOnline" class="text-bold"><i class="fa fa-circle text-danger"></i>
      <span class="text-danger"><span *ngIf="isUpdating"> (updating...) </span></span>
    </p>
  `
})
export class OnlineTrackerComponent implements OnInit {
  public isOnline: boolean = false;
  public isUpdating: boolean = false;

  constructor(private sessionService: SessionService) {
  }

  public ngOnInit() {
    let timer = Observable.timer(1000, 30000);
    timer.subscribe((t) => this.updateOnlineStatus());
  }

  public updateOnlineStatus() {
    if (this.isUpdating) {
      return;
    }
    this.isUpdating = true;
    let request = this.sessionService.getSession();
    request
      .subscribe(
        (response: Response) => {
          this.isUpdating = false;
          this.isOnline = true;
        }, (error) => {
          this.isUpdating = false;
          this.isOnline = false;
        });
  }
}
