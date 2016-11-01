import { Injectable } from '@angular/core';
// analytics
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/src/providers/angulartics2-piwik';

@Injectable()
export class AppFeatureAnalytics {

  private appUser: any = {  // TODO: fetch this information from user service
    userName: 'akimaina',
    userId: '1',
    firstName: 'John',
    lastName: 'Doe'
  };

  constructor(private angulartics2: Angulartics2, private angulartics2Piwik: Angulartics2Piwik) { }


  /**
   *
   *
   * @param {string} category
   * @param {string} action
   * @param {string} [name]
   *
   * @memberOf AppFeatureAnalytics
   */
  public trackEvent(category: string, action: string, name?: string) {
    this.angulartics2.setUsername.next(this.appUser.userName);
    this.angulartics2.setUserProperties.next(this.appUser);
    this.angulartics2.eventTrack.next({
      action: action,
      properties: {
        category: category || 'General',
        label: name || 'N/A'
      }
    });
  }
}
