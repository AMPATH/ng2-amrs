import { TestBed, async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderResourceService } from '../openmrs-api/order-resource.service';
import { LabOrderSearchContainerComponent } from './lab-order-search-container.component';
import { LabOrderSearchComponent } from './lab-order-search.component';
import { LabOrderSearchPostComponent } from './lab-order-search-post.component';

import { LabOrdersSearchHelperService } from './lab-order-search-helper.service';
import { HivSummaryService } from '../patient-dashboard/hiv/hiv-summary/hiv-summary.service';
import { HivSummaryResourceService } from '../etl-api/hiv-summary-resource.service';
import { ConceptResourceService  } from '../openmrs-api/concept-resource.service';
import { LabOrderResourceService } from '../etl-api/lab-order-resource.service';
import { LabOrderPostService } from './lab-order-post.service';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';

class FakeOrderResourceService {
  searchOrdersById(orderId: string, cached: boolean = false,
                   v: string = null): Observable<any> {
    return Observable.of({_body: {
      'orderNumber': 'ORD-34557',
      'accessionNumber': null
    }});
  }
}
describe('LabOrderSearchContainerComponent', () => {
  let fixture: ComponentFixture<LabOrderSearchContainerComponent>;
  let labOrderFixture: ComponentFixture<LabOrderSearchComponent>;
  let currentComp: LabOrderSearchContainerComponent;
  let labOrderComp: LabOrderSearchComponent;

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
        LabOrderSearchContainerComponent,
        LabOrderSearchComponent,
        LabOrderSearchPostComponent
      ]
    }).overrideComponent(LabOrderSearchComponent, {
      set: {
        providers: [
          { provide: OrderResourceService, useClass: FakeOrderResourceService },
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
        fixture = TestBed.createComponent(LabOrderSearchContainerComponent);
        labOrderFixture = TestBed.createComponent(LabOrderSearchComponent);
        currentComp = fixture.componentInstance;
      });
  }));

  it('should render lab-order-search component', (done) => {
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement
      .querySelectorAll('lab-order-search').length).toBe(1);
    done();
  });

  it('should render lab-order-search-post component', (done) => {
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement
      .querySelectorAll('lab-order-search-post').length).toBe(1);
    done();
  });

  it('should call orderReceieved() when searched order is emitted by searchOrderId()', async(() => {
    let searchButton = fixture.nativeElement.querySelector('#search');
    labOrderComp = labOrderFixture.componentInstance;
    expect(searchButton).toBeDefined();
    spyOn(labOrderComp, 'searchOrderId');
    spyOn(currentComp, 'orderReceieved');
    searchButton.click();
    labOrderFixture.detectChanges();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(currentComp.orderReceieved).toHaveBeenCalled();
    });
  }));
});
