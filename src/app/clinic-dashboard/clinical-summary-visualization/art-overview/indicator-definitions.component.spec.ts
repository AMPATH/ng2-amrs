/* tslint:disable:no-unused-variable */

import {
  TestBed, async, fakeAsync, ComponentFixture, ComponentFixtureAutoDetect
} from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule, TabViewModule } from 'primeng/primeng';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../../etl-api/clinical-summary-visualization-resource.service';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { ArtOverviewIndicatorDefComponent } from './indicator-definitions.component';

class DataStub {

  public getArtOverviewReport(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }

}

let results = {
  'results': [
    {
      location_uuid: 'location-uuid',
      location_id: 13,
      patients: 4276,
      on_nevirapine: 1641,
      on_lopinavir: 266,
      on_efavirenz: 2067,
      on_atazanavir: 266,
      on_raltegravir: 5,
      on_other_arv_drugs: 15,
      not_on_arv: 17
    }

  ],
  'indicatorDefinitions': [
    {
      'name': 'on_raltegravir',
      'label': 'patient on_raltegravir',
      'description': 'A patient is considered to be on \"Raltegravir\" if ',
      'expression': 'cur_arv_meds regexp '
    }
  ]
};

let indicatorDefinitions = [
  {
    'on_raltegravir': 'A patient is considered to be on \"Raltegravir\" if ',
  }

];

describe('ArtOverviewIndicatorDefComponent', () => {
  let fixture: ComponentFixture<ArtOverviewIndicatorDefComponent>;
  let comp: ArtOverviewIndicatorDefComponent;
  let dataStub: ClinicalSummaryVisualizationResourceService;
  let router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TabViewModule, AccordionModule],
      declarations: [ArtOverviewIndicatorDefComponent]
    }).overrideComponent(ArtOverviewIndicatorDefComponent, {
      set: {
        providers: [
          { provide: ClinicalSummaryVisualizationResourceService, useClass: DataStub },
          { provide: ComponentFixtureAutoDetect, useValue: true },
          {
            provide: Http, useFactory: (backend, options) => {
              return new Http(backend, options);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          MockBackend,
          BaseRequestOptions
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ArtOverviewIndicatorDefComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(ClinicalSummaryVisualizationResourceService);
      });
  }));

  it('should return an object dictionary for indicatorDefinitions', fakeAsync(() => {
    const spy = spyOn(dataStub, 'getArtOverviewReport').and.returnValue(
      Observable.of(results)
    );
    comp.createIndicatorDefinitionsDictionary(results.indicatorDefinitions);
    expect(comp.indicatorDefinitionsArr).toEqual(indicatorDefinitions);
  }));

});
