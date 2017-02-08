import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { ClinicalNotesResourceService } from '../../etl-api/clinical-notes-resource.service';
import { MockClinicalNotesResourceService }
  from '../../etl-api/clinical-notes-resource.service.mock';
import { ClinicalNotesComponent } from './clinical-notes.component';
import { ClinicalNotesHelperService } from './clinical-notes.helper';

describe('Component: Clinical notes Unit Tests', () => {

  let notesResourceService: ClinicalNotesResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;
  class FakeActivatedRoute {
    url = '';
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        FakeAppFeatureAnalytics,
        ClinicalNotesComponent,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: ClinicalNotesResourceService,
          useClass: MockClinicalNotesResourceService
        },
        { provide: Location, useClass: SpyLocation },
        { provide: ActivatedRoute, useValue: FakeActivatedRoute },
        AppSettingsService,
        { provide: ClinicalNotesHelperService, useValue: new ClinicalNotesHelperService() },
        LocalStorageService
      ]
    });

    notesResourceService = TestBed.get(ClinicalNotesResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(ClinicalNotesComponent);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {

    expect(component.notes.length).toEqual(0);
    expect(component.isBusy).toBeUndefined();
    expect(component.helper).toBeDefined();
    expect(component.subscription).toBeUndefined();
    expect(component.nextStartIndex).toEqual(0);
    expect(component.dataLoaded).toEqual(false);
    expect(component.fetching).toEqual(true);
    expect(component.experiencedLoadingError).toEqual(false);
    expect(component.patientUuid).toEqual('');

    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'getNotes').and.callFake((err, data) => { });
    component.getNotes(0, 10, (err, data) => { });
    expect(component.getNotes).toHaveBeenCalled();

    spyOn(component, 'getMoreNotes').and.callThrough();
    component.getMoreNotes();
    expect(component.getMoreNotes).toHaveBeenCalled();

    done();

  });

});
