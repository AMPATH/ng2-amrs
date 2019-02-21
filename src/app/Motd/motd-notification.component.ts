/*

 Based on motd_messages table
 alerts are of 2 types 1-info and 2-warning
 intervals are
 1.After each session
 2.Once daily for the start to end date period
 3.Once per start to end date

 */


import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MOTDNotificationService } from './../etl-api/motd.notification.service';
import { CookieService } from 'ngx-cookie';
import * as Moment from 'moment';

@Component({
  selector: 'motd-notification',
  templateUrl: 'motd-notification.component.html',
  styleUrls: ['motd-notification.component.css']
})

export class MOTDNotificationComponent implements OnInit {
  public notifications: any = [];

  public displayNotifications: any = [];

  public overlayClass = '';

  public warningIcon = 'fa fa-exclamation-circle fa-fw fa-2x';

  public infoIcon = 'fa fa-info-circle fa-fw fa-2x';

  // cookie key will be the current days date

  public currentDate = Moment();

  public cookieKey: string = 'motdKey' + this.currentDate;
  public cookieValue: string = 'motdVal' + this.currentDate;

  constructor(private _motdSservice: MOTDNotificationService,
    private _cookieService: CookieService) {

  }

  public ngOnInit() {

    // this.removeAllCookies();
    this.getMotdNotifications();

  }

  public getMotdNotifications() {
    this._motdSservice.getMotdNotification().pipe(
      take(1)).subscribe((res) => {
        this.notifications = res;

        if (res.length > 0) {

          this.filterNotifications();

        }

        // console.log('Notification' , this.notifications);
      });
  }

  public filterNotifications() {
    // only show notifications not loaded in cookies based on id
    const notifications = this.notifications;
    if (notifications.length > 0) {

      notifications.forEach((notification) => {

        // console.log('Filter Notification', notification);

        const startDate = Moment(notification.startDate);
        const endDate = Moment(notification.expireTime);
        const messageId = notification.message_id;
        const alertInterval = parseInt(notification.alert_interval, 0);

        // console.log('Alert INterval', alertInterval);

        let cookieKey = '';
        let cookieVal = '';

        /* check the type of interval
         1.After each session
         2.Once daily for the start to end date period
         3.Once per start to end date
         */

        if (alertInterval === 1) {

          cookieKey = 'motdLoginCookie';
          cookieVal = '' + Math.random();

        }

        if (alertInterval === 2) {

          cookieKey = 'motdNotKey' + this.currentDate;
          cookieVal = 'motdNotVal' + this.currentDate;

        }
        if (alertInterval === 3) {

          cookieKey = 'motdNotKey' + messageId;
          cookieVal = 'motdNotVal' + messageId;

        }

        // console.log('Cookie key set', cookieKey);

        const currentNotificationCookie = this._cookieService.get(cookieKey);

        if (typeof currentNotificationCookie === 'undefined') {

          // get notifications then add cookie

          // check if date is between start and end

          // console.log('Start Day', this.currentDate);

          if (this.currentDate >= startDate && this.currentDate <= endDate) {

            // console.log('CookieKey', cookieKey);

            this._cookieService.put(cookieKey, cookieVal);

            this.displayNotifications.push(notification);

            this.overlayClass = 'notification_overlay';

          }

          // this.addTodaysCookie();

        } else {

        }
        // console.log('Notification', notification);
      });

    }
  }

  public dissmissNotification(index) {

    // check notification length
    this.displayNotifications.splice(index, 1);

    if (this.displayNotifications.length === 0) {
      this.overlayClass = 'hide_notifiction_overlay';
    }

  }

  public removeAllCookies() {
    this._cookieService.removeAll();
  }

}
