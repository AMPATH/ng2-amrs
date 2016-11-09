import { Injectable } from '@angular/core';
// analytics
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from  'angulartics2/dist/providers';
/**
 * FakeAppFeatureAnalytics
 */
@Injectable()
export class FakeAppFeatureAnalytics {
  constructor() { }

  trackEvent(category: string, action: string, name?: string): void {

  }
}
