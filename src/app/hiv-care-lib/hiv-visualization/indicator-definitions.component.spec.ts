/* tslint:disable:no-unused-variable */

import {
  TestBed, async, fakeAsync, ComponentFixture, ComponentFixtureAutoDetect, tick
} from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule, TabViewModule } from 'primeng/primeng';

// import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { HivCareIndicatorDefComponent } from './indicator-definitions.component';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../etl-api/clinical-summary-visualization-resource.service';

class DataStub {

  public getHivComparativeOverviewReport(payload): Observable<any> {
    return of({ status: 'okay' });
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

describe('HivCareIndicatorDefComponent', () => {
  let fixture: ComponentFixture<HivCareIndicatorDefComponent>;
  let comp: HivCareIndicatorDefComponent;
  let dataStub: ClinicalSummaryVisualizationResourceService;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TabViewModule, AccordionModule],
      declarations: [HivCareIndicatorDefComponent]
    }).overrideComponent(HivCareIndicatorDefComponent, {
      set: {
        providers: [
          { provide: ClinicalSummaryVisualizationResourceService, useClass: DataStub },
          { provide: ComponentFixtureAutoDetect, useValue: true },
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HivCareIndicatorDefComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(ClinicalSummaryVisualizationResourceService);
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should return an object dictionary for indicatorDefinitions', fakeAsync(() => {
    const spy = spyOn(dataStub, 'getHivComparativeOverviewReport').and.returnValue(
      of(results)
    );
    comp.createIndicatorDefinitionsDictionary(results.indicatorDefinitions);
    tick(50);
    expect(comp.indicatorDefinitionsArr).toEqual(indicatorDefinitions);
  }));

});

