import { TestBed, async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabOrderSearchComponent } from './lab-order-search.component';
import { OrderResourceService } from '../openmrs-api/order-resource.service';

class FakeOrderResourceService {
  searchOrdersById(orderId: string, cached: boolean = false,
                   v: string = null): Observable<any> {
    Observable.of({_body: {
      'orderNumber': 'ORD-34557',
      'accessionNumber': null
    }});
  }
}
describe('Component: LabOrderSearchComponent', () => {
  let fixture: ComponentFixture<LabOrderSearchComponent>;
  let comp: LabOrderSearchComponent;
  let fakeOrderResourceService: OrderResourceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [LabOrderSearchComponent]
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
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LabOrderSearchComponent);
        comp = fixture.componentInstance;
        fakeOrderResourceService = fixture.debugElement.injector.get(OrderResourceService);
      });
  }));

  it('should create the search form with input and search and reset buttons', (done) => {
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement
      .querySelectorAll('button').length).toBe(2);
    expect(fixture.nativeElement
      .querySelectorAll('input').length).toBe(1);
    done();
  });

  it('should hit the success callback when searchOrdersById returns success', fakeAsync(() => {
    const spy = spyOn(fakeOrderResourceService, 'searchOrdersById').and.returnValue(
      Observable.of({_body: {
        'orderNumber': 'ORD-34557',
        'accessionNumber': null
      }})
    );
    comp.searchOrderId();
    fixture.detectChanges();
    expect(spy.calls.any()).toEqual(true);
  }));

  it('should hit the error callback when searchOrdersById returns an error', fakeAsync(() => {
    const spy = spyOn(fakeOrderResourceService, 'searchOrdersById').and.returnValue(
      Observable.throw({ error: '' })
    );
    comp.searchOrderId();
    fixture.detectChanges();
    expect(spy.calls.any()).toEqual(true);
  }));

  it('should reset form when reset button is clicked', async(() => {
    let resetButton = fixture.nativeElement.querySelector('#reset');
    spyOn(comp, 'resetSearch');
    expect(resetButton).toBeDefined();
    resetButton.click();
    fixture.whenStable().then(() => {
      expect(comp.resetSearch).toHaveBeenCalled();
    });
  }));

  it('should call searchOrderId when search button is clicked', async(() => {
    let searchButton = fixture.nativeElement.querySelector('#search');
    spyOn(comp, 'searchOrderId');
    expect(searchButton).toBeDefined();
    searchButton.click();
    fixture.whenStable().then(() => {
      expect(comp.searchOrderId).toHaveBeenCalled();
    });
  }));
});
