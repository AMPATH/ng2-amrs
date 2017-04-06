import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DebugElement }    from '@angular/core';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { Moh731ResourceService } from './moh-731-fake-resource';
import { Moh731PatientListComponent } from './moh-731-patientlist.component';
import { DataListsModule } from '../../data-lists/data-lists.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { Moh731ReportBaseComponent } from './moh-731-report-base.component';
import { Moh731PatientListBaseComponent } from './moh-731-patientlist-base.component';
import {
  MomentPipe
} from 'ng2-openmrs-formentry/src/app/components/date-time-picker/pipes/moment.pipe';
import { Router, ActivatedRoute } from '@angular/router';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  params = Observable.of([{'id': 1}]);
  data = Observable.of({'moh731Params': 1});
}

class FakeMoh731ResourceService {

  getMoh731PatientList(params): Observable<any> {
    return Observable.of({
      a: 'b'
    });
  }

}

const indicators = [
  {
    indicator: 'arv_first_regimen_start_date',
    label: 'ARV first regimen start date',
    ref: ''
  },
  {
    indicator: 'enrollment_date',
    label: 'Enrollment Date',
    ref: ''
  },
];

describe('Component: Moh731PatientListComponent', () => {
  let currentTestComponent: Moh731PatientListComponent;
  let currentTestFixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Moh731ReportBaseComponent,
        Moh731PatientListBaseComponent,
        Moh731PatientListComponent,
        MomentPipe
      ],
      imports: [
        NgamrsSharedModule,
        CommonModule,
        AgGridModule,
        DataListsModule
      ]
    }).overrideComponent(Moh731PatientListComponent, {
      set: {
        providers: [
          {
            provide: Moh731ResourceService, useClass: FakeMoh731ResourceService
          },
          {provide: Router, useClass: MockRouter},
          {
            provide: ActivatedRoute, useClass: MockActivatedRoute
          }
        ]
      }
    }).compileComponents().then(() => {
      currentTestFixture = TestBed.createComponent(Moh731PatientListComponent);
      currentTestComponent = currentTestFixture.componentInstance;
    });

  }));

  it('should have a defined component', (done) => {
    expect(currentTestComponent).toBeDefined();
    done();
  });

  it('should render component properties correctly', (done) => {
    spyOn(currentTestComponent, 'ngOnInit');
    currentTestComponent._startDate = moment(new Date());
    currentTestComponent._endDate = moment(new Date());
    currentTestComponent.locations = 'MTRH Module 1, MTRH Module 2';
    currentTestComponent.indicator = 'Currently in care total';
    currentTestComponent.ngOnInit();
    currentTestFixture.detectChanges();
    let h4strong: Array<DebugElement> = currentTestFixture.debugElement
      .queryAll(By.css('h4 > strong'));
    let inCare = h4strong[0].nativeElement;
    let locations = h4strong[1].nativeElement;
    let startDate = h4strong[2].nativeElement;
    let endDate = h4strong[3].nativeElement;
    expect(h4strong.length).toBe(4);
    expect(inCare.textContent).toContain('Currently in care total');
    expect(locations.textContent).toContain('MTRH Module 1, MTRH Module 2');
    expect(startDate.textContent).toContain(moment(new Date()).format('DD/MM/YYYY'));
    expect(endDate.textContent).toContain(moment(new Date()).format('DD/MM/YYYY'));
    done();
  });
});
