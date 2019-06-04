import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';

import { Observable, of } from 'rxjs';
import { Moh731PatientListComponent } from './moh-731-patientlist.component';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { Moh731ReportBaseComponent } from './moh-731-report-base.component';
import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry';
import { Router, ActivatedRoute } from '@angular/router';
import { EtlApi } from '../../etl-api/etl-api.module';
import {
  Moh731PatientListResourceService
} from '../../etl-api/moh-731-patientlist-resource.service';

const mockParams: any = {
  startDate: '2018-05-01',
  endDate: '2018-05-31',
  locations: 'uuid1',
  indicators: 'arv_first_regimen_start_date',
  isLegacy: 'true'

};

class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  public params = of(mockParams);
  public data = of({ 'moh731Params': 1 });
}

class FakeMoh731PatientListResourceService {

  public getMoh731PatientListReport(params): Observable<any> {
    return of({
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
  let route;
  let router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Moh731ReportBaseComponent,
        Moh731PatientListComponent
      ],
      imports: [
        NgamrsSharedModule,
        CommonModule,
        EtlApi,
        AgGridModule,
        DataListsModule,
        DateTimePickerModule
      ]
    }).overrideComponent(Moh731PatientListComponent, {
      set: {
        providers: [
          {
            provide: Moh731PatientListResourceService,
            useClass: FakeMoh731PatientListResourceService
          },
          { provide: Router, useClass: MockRouter },
          {
            provide: ActivatedRoute, useClass: MockActivatedRoute
          }
        ]
      }
    }).compileComponents().then(() => {
      currentTestFixture = TestBed.createComponent(Moh731PatientListComponent);
      currentTestComponent = currentTestFixture.componentInstance;
      route = currentTestFixture.debugElement.injector.get(Router);
      router = currentTestFixture.debugElement.injector.get(ActivatedRoute);
    });

  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should have a defined component', (done) => {
    expect(currentTestComponent).toBeDefined();
    done();
  });

  it('should render component properties correctly', (done) => {
    spyOn(currentTestComponent, 'ngOnInit');
    currentTestComponent._startDate = moment(new Date());
    currentTestComponent._endDate = moment(new Date());
    currentTestComponent._locations = 'MTRH Module 1, MTRH Module 2';
    currentTestComponent._indicator = 'Currently in care total';
    currentTestComponent.patientListPerIndicator = [{ a: 'b' }];
    currentTestComponent.ngOnInit();
    currentTestFixture.detectChanges();
    setTimeout(() => {
      const h4strong: Array<DebugElement> = currentTestFixture.debugElement
        .queryAll(By.css('h4 > strong'));
      const inCare = h4strong[0].nativeElement;
      const locations = h4strong[1].nativeElement;
      const startDate = h4strong[2].nativeElement;
      const endDate = h4strong[2].nativeElement;
      expect(h4strong.length).toBe(4);
      expect(inCare.textContent).toContain('Currently in care total');
      expect(locations.textContent).toContain('MTRH Module 1, MTRH Module 2');
      expect(startDate.textContent).toContain(moment(new Date()).format('DD/MM/YYYY'));
      expect(endDate.textContent).toContain(moment(new Date()).format('DD/MM/YYYY'));
      done();
    }, 5);
  });
});
