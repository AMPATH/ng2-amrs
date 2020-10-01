import { TestBed, inject, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { ClinicalNotesResourceService } from '../../../etl-api/clinical-notes-resource.service';
import { ClinicalNotesComponent } from './clinical-notes.component';
import { ClinicalNotesHelperService } from './clinical-notes.helper';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('Component: Clinical notes Unit Tests', () => {
  let fakeAppFeatureAnalytics: AppFeatureAnalytics,
    component,
    notesStub: ClinicalNotesResourceService;

  class FakeClinicalNotesResourceService {
    public getClinicalNotes(
      patientUuid: string,
      startIndex: number,
      limit: number
    ) {
      return of({ status: 'success' }, { res: 'clinical notes' });
    }
  }

  class FakeActivatedRoute {
    url = '';
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FakeAppFeatureAnalytics,
        ClinicalNotesComponent,
        {
          provide: HttpClient,
          useFactory: HttpClientTestingModule
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: ClinicalNotesResourceService,
          useClass: FakeClinicalNotesResourceService
        },
        { provide: Location, useClass: SpyLocation },
        { provide: ActivatedRoute, useValue: FakeActivatedRoute },
        AppSettingsService,
        {
          provide: ClinicalNotesHelperService,
          useValue: new ClinicalNotesHelperService()
        },
        LocalStorageService
      ]
    });

    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(ClinicalNotesComponent);
    notesStub = TestBed.get(ClinicalNotesResourceService);
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
    expect(component.hasNotes).toEqual(false);
    done();
  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'getNotes').and.callFake((err, data) => {});
    component.getNotes(0, 10, (err, data) => {});
    expect(component.getNotes).toHaveBeenCalled();

    spyOn(component, 'getMoreNotes').and.callThrough();
    component.getMoreNotes();
    expect(component.getMoreNotes).toHaveBeenCalled();
    done();
  });
});
