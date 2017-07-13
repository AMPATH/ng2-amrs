/*

Based on motd_messages table
alerts are of 2 types 1-info and 2-warning
intervals are 
    1.After each session
    2.Once daily for the start to end date period
    3.Once per start to end date

*/

import { Component, OnInit , OnDestroy } from '@angular/core';
import { MOTDNotificationService } from './../etl-api/motd.notification.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import * as Moment from 'moment';


@Component({
    selector : 'motd-notification',
    templateUrl : 'motd-notification.component.html',
    styleUrls : [ 'motd-notification.component.css' ]
})

export class MOTDNotificationComponent implements OnInit {
     notifications: any = [];

     displayNotifications: any = [];

     overlayClass: string = '';

     warningIcon: string = 'fa fa-exclamation-circle fa-fw fa-2x';

     infoIcon: string = 'fa fa-info-circle fa-fw fa-2x';

     // cookie key will be the current days date

     currentDate = Moment().startOf('day');

     cookieKey: string = 'motdKey' + this.currentDate;
     cookieValue: string = 'motdVal' + this.currentDate;


     constructor(private _motdSservice: MOTDNotificationService,
     private _cookieService: CookieService) {

     }
     ngOnInit() {

       // this.removeAllCookies();
           this.getMotdNotifications();



     }


     getMotdNotifications() {
         this._motdSservice.getMotdNotification()
           .subscribe((res) => {
               this.notifications = res;

               if (res.length > 0) {

                    this.filterNotifications();

               }

            // console.log('Notification' , this.notifications);
           });
     }

     filterNotifications() {
         // only show notifications not loaded in cookies based on id
         let notifications = this.notifications;
         if (notifications.length > 0 ) {

                notifications.forEach(notification => {

                    // console.log('Filter Notification', notification);

                    let startDate = Moment(notification.startDate);
                    let endDate = Moment(notification.expireTime);
                    let messageId = notification.message_id;
                    let alertInterval = parseInt(notification.alert_interval, 0);

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
                    if (alertInterval === 3 ) {

                          cookieKey = 'motdNotKey' + messageId;
                          cookieVal = 'motdNotVal' + messageId;

                       }

                    // console.log('Cookie key set', cookieKey);

                    let currentNotificationCookie = this._cookieService.get(cookieKey);

                      if (typeof currentNotificationCookie === 'undefined') {

                                // get notifications then add cookie

                                // check if date is between start and end

                                // console.log('Start Day', this.currentDate);

                                if ( this.currentDate >= startDate && this.currentDate <= endDate) {

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

     dissmissNotification(index) {

         // check notification length
          this.displayNotifications.splice(index, 1);

         if ( this.displayNotifications.length === 0 ) {
              this.overlayClass = 'hide_notifiction_overlay';
            }


     }

     removeAllCookies() {
         this._cookieService.removeAll();
     }



}
