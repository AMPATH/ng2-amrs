
/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortListComponent } from './cohort-list.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CohortListService } from './cohort-list.service';

class DataStub {

  public getAllCohorts(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }

}
class DummyComponent {
}

let expectedResults = {
  results: [
    {
      uuid: 'uuid',
      name: 'Test Defaulter List',
      description: 'Test Defaulter List',
      voided: false,
      display: 'display',
      auditInfo: {
        dateCreated: '2010-05-06T16:17:48.000+0300'
      },
      memberIds: [
        {
          0: '1551515'
        }

      ],
      links: [
        {
          rel: 'self'

        }
      ],
      resourceVersion: '1.8'
    }

  ]
};

describe('CohortListComponent', () => {
  let fixture: ComponentFixture<CohortListComponent>;
  let comp: CohortListComponent;
  let dataStub: CohortResourceService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgamrsSharedModule, ConfirmDialogModule, DialogModule, CommonModule, FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'add-cohort-list', component: DummyComponent }
        ])],
      declarations: [CohortListComponent]
    }).overrideComponent(CohortListComponent, {
      set: {
        providers: [
          { provide: CohortResourceService, useClass: DataStub },
          {
            provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          },
            deps: [MockBackend, BaseRequestOptions]
          },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: { parent: { params: Observable.of({id: 'testId'}) }}
          },
          MockBackend,
          BaseRequestOptions,
          CohortListService
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CohortListComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(CohortResourceService);
      });
  }));

  it('should hit the success callback when getAllCohorts returns success',
    (done)  => {
      const spy = spyOn(dataStub, 'getAllCohorts').and.returnValue(
        Observable.of(expectedResults)
      );
      comp.getCohortList();
      fixture.detectChanges();
      expect(spy.calls.any()).toEqual(true);
      done();
    });

  it('should hit the error callback when getAllCohorts returns an error',
    fakeAsync(() => {
      const spy = spyOn(dataStub, 'getAllCohorts').and.returnValue(
        Observable.throw({ error: '' })
      );
      comp.getCohortList();
      fixture.detectChanges();
      tick(500);
      expect(spy.calls.any()).toEqual(true);
      tick(500);
    }));
});
