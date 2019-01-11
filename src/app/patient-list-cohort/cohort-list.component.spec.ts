/* tslint:disable:no-unused-variable */
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { TestBed, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CohortListComponent } from './cohort-list.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { CohortListService } from './cohort-list.service';
import { UserCohortResourceService } from '../etl-api/user-cohort-resource.service';
import { UserService } from '../openmrs-api/user.service';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfirmDialogModule, DialogModule } from 'primeng/primeng';

class DataStub {

  public getUserCohorts(payload): Observable<any> {
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

const expectedResults = {
  results: [
    {
      uuid: 'uuid',
      name: 'Test Defaulter List',
      description: 'Test Defaulter List',
      access: 'public',
      cohort_id: 2,
      role: 'admin',
      date_created: '2010-05-06T13:17:48.000Z'
    }

  ]
};

describe('CohortListComponent', () => {
  let fixture: ComponentFixture<CohortListComponent>;
  let comp: CohortListComponent;
  let dataStub: UserCohortResourceService;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgamrsSharedModule, ConfirmDialogModule, DialogModule, CommonModule, FormsModule,
        BrowserAnimationsModule, HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'add-cohort-list', component: DummyComponent }
        ])],
      declarations: [CohortListComponent]
    }).overrideComponent(CohortListComponent, {
      set: {
        providers: [
          { provide: UserCohortResourceService, useClass: DataStub },
          { provide: UserService, useClass: DataStubUser },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: { parent: { params: of({ id: 'testId' }) } }
          },
          CohortListService,
          CohortResourceService
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CohortListComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(UserCohortResourceService);
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should hit the success callback when getAllCohorts returns success',
    (done) => {
      const spy = spyOn(dataStub, 'getUserCohorts').and.returnValue(
        of(expectedResults)
      );
      comp.getCohortList();
      fixture.detectChanges();
      expect(spy.calls.any()).toEqual(true);
      done();
    });

  it('should hit the error callback when getAllCohorts returns an error',
    fakeAsync(() => {
      const spy = spyOn(dataStub, 'getUserCohorts').and.returnValue(
        observableThrowError({ error: '' })
      );
      comp.getCohortList();
      fixture.detectChanges();
      tick(500);
      expect(spy.calls.any()).toEqual(true);
      tick(500);
    }));
});
