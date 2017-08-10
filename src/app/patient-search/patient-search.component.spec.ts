import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from './../utils/local-storage.service';
import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PatientSearchComponent } from './patient-search.component';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { Ng2PaginationModule } from 'ng2-pagination';
import { FormsModule } from '@angular/forms';
import { PatientSearchService } from './patient-search.service';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { FakeAppSettingsService } from '../etl-api/moh-731-patientlist-resource.service.spec';
import { FakeAppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytcis.mock';
import { PatientResourceService } from './../openmrs-api/patient-resource.service';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  params = Observable.of([{ 'id': 1 }]);
}

let results: any = [
  {
    'commonIdentifiers': {
      'ampathMrsUId': '',
      'amrsMrn': '',
      'cCC': '',
      'kenyaNationalId': '00140012'

    },
    'encounters': [],
    'enrolledPrograms': {},
    'person': {
       'display': 'Ricco',
       'gender': 'M',
       'age': '31'
    }

  }
];



describe('Component: PatientSearch', () => {

  let comp:    PatientSearchComponent;
  let fixture: ComponentFixture<PatientSearchComponent>;
  let inputde, searchBtne , resetBtne:      DebugElement;
  let inputel, searchBtnel, resetBtnel:      HTMLElement;
  let nativeElement;


  // async beforeEach
beforeEach(async(() => {

        TestBed.configureTestingModule({
              declarations: [ PatientSearchComponent ], // declare the test component
              imports: [
                    FormsModule,
                    Ng2PaginationModule
              ],
              providers: [
                  PatientSearchService,
                  PatientResourceService,
                  MockBackend,
                  LocalStorageService,
                  BaseRequestOptions,
                  AppSettingsService,
                  MockRouter,
                  MockActivatedRoute,
                  FakeAppFeatureAnalytics,
                  {
                    provide: Http,
                    useFactory: (backendInstance: MockBackend,
                      defaultOptions: BaseRequestOptions) => {
                      return new Http(backendInstance, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                  },
                  {
                    provide: AppFeatureAnalytics,
                    useClass: FakeAppFeatureAnalytics
                  },
                  { provide: Router, useClass: MockRouter },
                  {
                    provide: ActivatedRoute,
                    useClass: MockActivatedRoute
                  }
            ]
            })
            .compileComponents();  // compile template and css
          }));

          beforeEach(() => {
              fixture = TestBed.createComponent(PatientSearchComponent);

              comp = fixture.componentInstance; // PatientSearch test instance

              nativeElement = fixture.nativeElement;

              inputde = fixture.debugElement.query(By.css('.search-texbox'));
              inputel = inputde.nativeElement;

              searchBtne = fixture.debugElement.query(By.css('.search-texbox'));
              searchBtnel = searchBtne.nativeElement;

               resetBtne = fixture.debugElement.query(By.css('.search-texbox'));
               resetBtnel = resetBtne.nativeElement;

              // Service from the root injector
              let patientSearchService = fixture.debugElement.injector.get(PatientSearchService);
              let route = fixture.debugElement.injector.get(MockRouter);
              let appFeatureAnalytics = fixture.debugElement.injector.get(FakeAppFeatureAnalytics);
              let router = fixture.debugElement.injector.get(MockRouter);

          });


    it('Should Instantiate Component', async(() => {
         expect(comp).toBeTruthy();
    }));

    it('Should Have a title of Patient Search', async(() => {
         expect(comp.title).toBe('Patient Search');
    }));

    it('Should Load the search textbox , search and reset button', async(() => {
            expect( inputel === null).toBe(false);
            expect( searchBtnel === null).toBe(false);
            expect(  resetBtnel === null).toBe(false);
    }));




});
