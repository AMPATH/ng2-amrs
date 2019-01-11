/* tslint:disable:no-unused-variable */
/* tslint:disable:import-blacklist */

import {
  TestBed, async, fakeAsync, tick, ComponentFixture, ComponentFixtureAutoDetect
} from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { AccordionModule, TabViewModule } from 'primeng/primeng';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../../../etl-api/clinical-summary-visualization-resource.service';
import { ClinicDashboardCacheService } from '../../../services/clinic-dashboard-cache.service';
import { ArtOverviewIndicatorDefComponent } from './indicator-definitions.component';

class DataStub {

  public getArtOverviewReport(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }

}

const results = {
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

const indicatorDefinitions = [
  {
    'on_raltegravir': 'A patient is considered to be on \"Raltegravir\" if ',
  }

];

describe('ArtOverviewIndicatorDefComponent', () => {
  let fixture: ComponentFixture<ArtOverviewIndicatorDefComponent>;
  let comp: ArtOverviewIndicatorDefComponent;
  let dataStub: ClinicalSummaryVisualizationResourceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TabViewModule, AccordionModule],
      declarations: [ArtOverviewIndicatorDefComponent]
    }).overrideComponent(ArtOverviewIndicatorDefComponent, {
      set: {
        providers: [
          { provide: ClinicalSummaryVisualizationResourceService, useClass: DataStub },
          { provide: ComponentFixtureAutoDetect, useValue: true }
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ArtOverviewIndicatorDefComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(ClinicalSummaryVisualizationResourceService);
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be instantiated', () => {
    expect(comp).toBeTruthy();
  });

  it('should return an object dictionary for indicatorDefinitions', fakeAsync(() => {
    const spy = spyOn(dataStub, 'getArtOverviewReport').and.returnValue(
      Observable.of(results)
    );
    comp.createIndicatorDefinitionsDictionary(results.indicatorDefinitions);
    tick(50);
    expect(comp.indicatorDefinitionsArr).toEqual(indicatorDefinitions);
  }));

});
