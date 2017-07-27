import { TestBed, async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderResourceService } from '../openmrs-api/order-resource.service';
import { LabOrderSearchPostComponent } from './lab-order-search-post.component';

import { LabOrdersSearchHelperService } from './lab-order-search-helper.service';
import { HivSummaryService } from '../patient-dashboard/hiv/hiv-summary/hiv-summary.service';
import { HivSummaryResourceService } from '../etl-api/hiv-summary-resource.service';
import { ConceptResourceService  } from '../openmrs-api/concept-resource.service';
import { LabOrderResourceService } from '../etl-api/lab-order-resource.service';
import { LabOrderPostService } from './lab-order-post.service';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { FakeLabOrderResourceService } from '../etl-api/lab-order-resource.mock';

describe('LabOrderSearchPostComponent', () => {
  let fixture: ComponentFixture<LabOrderSearchPostComponent>;
  let sampleOrder: any = {
    concept: {
      uuid: 'a8982474-1350-11df-a1f1-0026b9348838'
    },
    encounter: {
      location: {
        display: 'MTRH'
      },
      obs: [
        {
          uuid: '20953434-5e97-4029-a690-9e825a86c0ea',
          concept: {
            display: 'VIRAL LOAD TEST JUSTIFICATION',
            uuid: '0a98f01f-57f1-44b7-aacf-e1121650a967'
          },
          value: {
            display: 'CONFIRMED TREATMENT FAILURE'
          }
        }
      ]
    },
    orderer: {
      display: 'TEST USER'
    },
    patient: {
      person: {
        display: '',
        gender: '',
        birthdate: new Date('01-01-1990'),
        age: 27,
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        LabOrdersSearchHelperService,
        HivSummaryService,
        HivSummaryResourceService,
        ConceptResourceService,
        LabOrderResourceService,
        LabOrderPostService,
        LocalStorageService,
        AppSettingsService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
      ],
      declarations: [
        LabOrderSearchPostComponent
      ]
    }).overrideComponent(LabOrderSearchPostComponent, {
      set: {
        providers: [
          { provide: LabOrderPostService, useClass: FakeLabOrderResourceService },
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
    }).compileComponents().then(() => {
        fixture = TestBed.createComponent(LabOrderSearchPostComponent);
      });
  }));

  it('should be initialised', (done) => {
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
    done();
  });

  it('should display the order summary', async(() => {
    let comp = fixture.componentInstance;
    comp.orderType = {
      type: 'VL'
    };
    comp.order = sampleOrder;
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {

      expect(fixture.nativeElement
        .querySelectorAll('div.order-info').length).toBe(1);
    });
  }));

  it('should reset order when reset button is clicked', async(() => {
    let comp = fixture.componentInstance;
    comp.orderType = {
      type: 'VL'
    };
    comp.order = sampleOrder;
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    spyOn(comp, 'resetOrder');

    fixture.whenStable().then(() => {

      let resetButton = fixture.nativeElement.querySelector('#reset-btn');
      expect(resetButton).toBeDefined();
      resetButton.click();

      expect(comp.resetOrder).toHaveBeenCalled();
    });
  }));

  it('should submit order when submit button is clicked', async(() => {
    let comp = fixture.componentInstance;
    comp.orderType = {
      type: 'VL'
    };
    comp.order = sampleOrder;
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    spyOn(comp, 'postOrder');

    fixture.whenStable().then(() => {

      let submitButton = fixture.nativeElement.querySelector('#post-order-btn');
      expect(submitButton).toBeDefined();
      submitButton.click();

      expect(comp.postOrder).toHaveBeenCalled();
    });
  }));
});
