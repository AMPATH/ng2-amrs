import { Injectable } from '@angular/core';
// analytics
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/src/providers/angulartics2-piwik';

@Injectable()
export class AppFeatureAnalytics {

  /**
   * Creates an instance of AppFeatureAnalytics.
   *
   * @param {Angulartics2} angulartics2
   * @param {Angulartics2Piwik} angulartics2Piwik
   *
   * @memberOf AppFeatureAnalytics
   */
  constructor(private angulartics2: Angulartics2, private angulartics2Piwik: Angulartics2Piwik) { }


  /**
   *
   *
   * @param {string} category
   * @param {string} action
   *
   * @memberOf AppFeatureAnalytics
   */
  public trackEvent(category: string, action: string) {
    let appUser: string = 'akimaina'; // TODO: fetch this information from user service
    this.angulartics2.eventTrack.next({
      action: action,
      properties: {
        category: category || 'General',
        label: (action || 'General') + ' | ' + (appUser || 'N/A')
      }
    });
  }
}
