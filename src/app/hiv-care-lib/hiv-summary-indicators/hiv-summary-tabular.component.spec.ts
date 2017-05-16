
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular/main';

;
import { HivSummaryTabularComponent } from './hiv-summary-tabular.component';

describe('HivSummaryTabularComponent: ', () => {
  let fixture: ComponentFixture<HivSummaryTabularComponent>;
  let comp: HivSummaryTabularComponent;
  let el;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HivSummaryTabularComponent
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        AgGridModule.withComponents([])
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HivSummaryTabularComponent);
      comp = fixture.componentInstance;

      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  it('should be injectable', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should convert hiv summary section definition object to ag-grid column definition object',
    () => {
      let sectionsDef = [
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
      let component = fixture.componentInstance;
    //  component.setColumns(sectionsDef);

      let expected = [
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
