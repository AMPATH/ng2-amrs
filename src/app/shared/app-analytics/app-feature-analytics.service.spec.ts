/* tslint:disable:no-unused-variable */

import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

// analytics
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/dist/providers';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';

declare var window: any;

describe('App Feature Analytics Service', () => {
  let appFeatureAnalytics: AppFeatureAnalytics;
  let _paq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppFeatureAnalytics,
        Angulartics2,
        Angulartics2Piwik,
        {
          provide: Location,
          useClass: SpyLocation
        }]
    });
    window._paq = _paq = [];
  });

  beforeEach(inject([AppFeatureAnalytics], (_appFeatureAnalytics: AppFeatureAnalytics) => {
    appFeatureAnalytics = _appFeatureAnalytics;
  }));

});
