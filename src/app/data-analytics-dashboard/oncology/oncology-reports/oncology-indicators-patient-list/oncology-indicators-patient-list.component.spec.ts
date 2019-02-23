import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { convertToParamMap, ParamMap, Params, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { defer, of, ReplaySubject } from 'rxjs';

import { AppSettingsService } from '../../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { OncologySummaryIndicatorsResourceService } from '../../../../etl-api/oncology-summary-indicators-resource.service';
import { OncologySummaryIndicatorsPatientListComponent } from './oncology-indicators-patient-list.component';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../../shared/services/data-cache.service';

const oncologyMonthlySummaryServiceSpy = jasmine.createSpyObj('OncologyMonthlySummaryIndicatorsResourceService',
  ['getOncologySummaryMonthlyIndicatorsPatientList']);

const mockParams = {};

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe').and.returnValue(of(mockParams))
  }
};

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('OncologySummaryIndicatorsPatientListComponent', () => {

});
