
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular/main';
import { HivSummaryMonthlyTabularComponent } from './hiv-monthly-summary-tabular.component';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  params = of([{ 'id': 1 }]);
}

describe('HivSummaryMonthlyTabularComponent: ', () => {
  let fixture: ComponentFixture<HivSummaryMonthlyTabularComponent>;
  let comp: HivSummaryMonthlyTabularComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HivSummaryMonthlyTabularComponent
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute, useClass: MockActivatedRoute
        }],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        AgGridModule.withComponents([])
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HivSummaryMonthlyTabularComponent);
      comp = fixture.componentInstance;

      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injectable', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should convert hiv summary monthly section definition object to ag-grid column definition object',
    () => {
      const sectionsDef = [
        {
          label: 'patients',
          name: 'patients',
          description: 'Total number of patients',
          expression: 'true'
        },
        {
          label: 'on arvs',
          name: 'on_arvs',
          description: 'Total number of patients',
          expression: 'true'
        },
      ];

      fixture.detectChanges();
      const component = fixture.componentInstance;
      //  component.setColumns(sectionsDef);

      const expected = [
        {
          headerName: 'Location',
          field: 'location',
          pinned: 'left'
        },
        {
          headerName: 'Patients',
          field: 'patients'
        },
        {
          headerName: 'On Arvs',
          field: 'on_arvs'
        },
      ];

      //  expect(component.gridOptions.columnDefs).toEqual(expected);

      // should also create columns when setter is set
      /*component.gridOptions = { columnDefs: [] };
      fixture.detectChanges();

      component.sectionDefs = sectionsDef;
      fixture.detectChanges();
      expect(component.gridOptions.columnDefs).toEqual(expected);*/

    });
});
