/* tslint:disable:no-unused-variable */

import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { Angulartics2, RouterlessTracking } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { RouterTestingModule } from '@angular/router/testing';

declare var window: any;

describe('App Feature Analytics Service', () => {
  let appFeatureAnalytics: AppFeatureAnalytics;
  let _paq: Array<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule],
      providers: [
        AppFeatureAnalytics,
        Angulartics2,
        Angulartics2Piwik,
        RouterlessTracking,
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

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  xit('should be defined', () => {
    expect(appFeatureAnalytics).toBeDefined();
  });

});
