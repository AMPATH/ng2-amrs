
/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';

import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { CohortListService } from './cohort-list.service';
// import { UserCohortResourceService } from '../etl-api/user-cohort-resource.service';
import { UserService } from '../openmrs-api/user.service';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { ShareCohortListComponent } from './share-cohort-list.component';
import { CohortUserResourceService } from '../etl-api/cohort-list-user-resource.service';
import { UserSearchComponent } from './user-search.component';
import { Ng2PaginationModule } from 'ng2-pagination';

class DataStub {

  public getCohortUser(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }
  public createCohortUser(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }

}
class DataStubUser {

  public getLoggedInUser(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }

}
class DummyComponent {
}
class MockActivatedRoute {
 // params = Observable.of([{ 'id': 1 }]);
  snapshot = {
    params: { cohort_uuid: 'uuid' }
  };
}

let expectedResults = [
    {
      uuid: 'uuid',
      username: 'Test Defaulter List',
      cohort_id: 2,
      role: 'admin',
    }

  ];
let expectedPayload = {
  role: 'edit',
  cohort: 'cohortUuid',

};

describe('ShareCohortListComponent', () => {
  let fixture: ComponentFixture<ShareCohortListComponent>;
  let comp: ShareCohortListComponent;
  let dataStub: CohortUserResourceService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgamrsSharedModule, ConfirmDialogModule, DialogModule, CommonModule,
        FormsModule, Ng2PaginationModule,
        RouterTestingModule.withRoutes([
          { path: 'add-cohort-list', component: DummyComponent }
        ])],
      declarations: [ShareCohortListComponent, UserSearchComponent]
    }).overrideComponent(ShareCohortListComponent, {
      set: {
        providers: [
          { provide: CohortUserResourceService, useClass: DataStub },
          { provide: UserService, useClass: DataStubUser },
          {
            provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          },
            deps: [MockBackend, BaseRequestOptions]
          },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: MockActivatedRoute
          },
          MockBackend,
          BaseRequestOptions,
          CohortListService,
          CohortResourceService
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ShareCohortListComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(CohortUserResourceService);
      });
  }));

  /*it('should hit the success callback when getCohortUser returns success',
    (done)  => {
      const spy = spyOn(dataStub, 'getCohortUser').and.returnValue(
        Observable.of(expectedResults)
      );
      comp.getCohortUsers();
      fixture.detectChanges();
      expect(spy.calls.any()).toEqual(true);
      done();
    });*/
  /*it('should hit the success callback when createCohortUser returns success',
    (done)  => {
      const spy = spyOn(dataStub, 'createCohortUser').and.returnValue(
        Observable.of(expectedPayload)
      );
      comp.ShareCohortWithNewUser();
      fixture.detectChanges();
      expect(spy.calls.any()).toEqual(true);
      done();
    });
*/
});

