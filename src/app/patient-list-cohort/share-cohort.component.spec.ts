/* tslint:disable:no-unused-variable */
/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule, DialogModule } from 'primeng/primeng';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { CohortListService } from './cohort-list.service';
import { UserService } from '../openmrs-api/user.service';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { ShareCohortListComponent } from './share-cohort-list.component';
import { CohortUserResourceService } from '../etl-api/cohort-list-user-resource.service';
import { UserSearchComponent } from './user-search.component';
import { NgxPaginationModule } from 'ngx-pagination';

class DataStub {

  public getCohortUser(payload): Observable<any> {
    return of({ status: 'okay' });
  }
  public createCohortUser(payload): Observable<any> {
    return of({ status: 'okay' });
  }

}
class DataStubUser {

  public getLoggedInUser(payload): Observable<any> {
    return of({ status: 'okay' });
  }

}

class DummyComponent {
}
class MockActivatedRoute {
  snapshot = {
    params: { cohort_uuid: 'uuid' }
  };
}

const expectedResults = [
  {
    uuid: 'uuid',
    username: 'Test Defaulter List',
    cohort_id: 2,
    role: 'admin',
  }

];
const expectedPayload = {
  role: 'edit',
  user: 'uuid20',
  cohort: 'cohortUuid',

};

describe('ShareCohortListComponent', () => {
  let fixture: ComponentFixture<ShareCohortListComponent>;
  let comp: ShareCohortListComponent;
  let dataStub: CohortUserResourceService;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgamrsSharedModule, ConfirmDialogModule, DialogModule, CommonModule,
        FormsModule, NgxPaginationModule, HttpClientTestingModule, BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'add-cohort-list', component: DummyComponent }
        ])],
      declarations: [ShareCohortListComponent, UserSearchComponent]
    }).overrideComponent(ShareCohortListComponent, {
      set: {
        providers: [
          { provide: CohortUserResourceService, useClass: DataStub },
          { provide: UserService, useClass: DataStubUser },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { params: { 'cohort_uuid': 'uuid' } } }
          },
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

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  it('should hit the success callback when getCohortUser returns success',
    (done) => {
      const spy = spyOn(dataStub, 'getCohortUser').and.returnValue(
        of(expectedResults)
      );
      comp.getCohortUsers();
      fixture.detectChanges();
      expect(spy.calls.any()).toEqual(true);
      done();
    });
  xit('should hit the success callback when createCohortUser returns success',
    (done) => {
      const spy = spyOn(dataStub, 'createCohortUser').and.returnValue(
        of(expectedPayload)
      );
      comp.getSelectedUser({ value: 'test' });
      spyOn(dataStub, 'getCohortUser').and.returnValue(
        of(expectedResults)
      );
      comp.getCohortUsers();
      comp.ShareCohortWithNewUser();
      expect(spy.calls.any()).toBe(true);
      done();
    });
});
