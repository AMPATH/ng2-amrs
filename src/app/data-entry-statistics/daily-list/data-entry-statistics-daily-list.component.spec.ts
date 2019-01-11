import { ChangeDetectorRef } from '@angular/core';
import { TestBed, async , ComponentFixture } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsDailyListComponent } from './data-entry-statistics-daily-list.component';

const mockDailyResult: any = [
  {
    date: '2018-04-16',
    encounter_type: 'ADULTINITIAL',
    encounter_type_id: 1,
    encounter_type_uuid: 'uuid',
    encounters_count: 23,
    location: 'MTRH-1',
    locations: 1,
    locationUuid: 'uuid',
  },
  {
    date: '2018-04-16',
    encounter_type: 'ADULTRETURN',
    encounter_type_id: '2',
    encounter_type_uuid: 'uuid2',
    encounters_count: 1023,
    location: 'MTRH-1',
    locations: 1,
    locationUuid: 'uuid',
  }
];

const mockParams = {
  providerUuid: '',
  locationUuids: '',
  startDate: '2018-04-01',
  endDate: '2018-04-30'
};

class GridOptions {
    public api = {
      setPinnedBottomRowData() {

      }
    };
}

describe('Component: Data Entry Daily List', () => {
  let fixture: ComponentFixture<DataEntryStatisticsDailyListComponent>;
  let cd: ChangeDetectorRef;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        AgGridModule.withComponents([])
      ],
      declarations: [
        DataEntryStatisticsDailyListComponent
      ],
      providers: [
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DataEntryStatisticsDailyListComponent);
        comp = fixture.componentInstance;
        cd = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef as any);

      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
      expect(comp).toBeDefined();
  });

  it('should create encounter daily rows from obtained result', (done: DoneFn) => {
    comp.dataEntryEncounters = mockDailyResult;
    comp.params = mockParams;
    spyOn(comp, 'setPinnedRow').and.returnValue(true);
    comp.processEncounterListData();
    cd.detectChanges();
    expect(comp.dataEntryEncounters).toEqual(mockDailyResult);
    done();
  });

  it('should merge columns correctly after creation of dynamic columns', () => {
    const dynamicCols = [{
      field: '02-01-2019',
      headerName: '02-01-2019'
    }];
    comp.params = {
      startDate : '02-01-2019',
      endDate : '02-01-2019'

    };
    comp.dataEntryEncounterColdef = [
      {
        field: 'location',
        headerName: 'Location',
        hide: true,
        rowGroup: true
      },
      {
        field: 'encounter_type',
        headerName: 'Encounter Types'
      },
      {
        field: 'rowTotals',
        headerName: 'Total'
      }
    ];

    const mergedCols =  [
      {
        field: 'location',
        headerName: 'Location',
        hide: true,
        rowGroup: true
      },
      {
        field: 'encounter_type',
        headerName: 'Encounter Types'
      },
      {
        field: 'rowTotals',
        headerName: 'Total'
      },
      {
        field: '02-01-2019',
        headerName: '02-01-2019',

      }
    ];

    cd.detectChanges();
    comp.mergeColsDef(dynamicCols);
    expect(comp.dataEntryEncounterColdef).toEqual(mergedCols);
  });

  it('should sort date columns in descending order', () => {

    const mockDateCols = [
      {
        field: '31-12-2018',
        headerName: '31-12-2018'
      },
      {
       field: '01-01-2019',
       headerName: '01-01-2019'
      },
      {
        field: '28-12-2018',
        headerName: '28-12-2018'
      },
      {
        field: '30-12-2018',
        headerName: '30-12-2018'
      },
      {
        field: '27-12-2018',
        headerName: '27-12-2018'
      },
      {
        field: '29-12-2018',
        headerName: '29-12-2018'
      },
      {
        field: '26-12-2018',
        headerName: '26-12-2018'
      }
  ];

  const expectedSortedCols = [
     {
      field: '26-12-2018',
      headerName: '26-12-2018'
    },
     {
       field: '27-12-2018',
       headerName: '27-12-2018'
     },
     {
      field: '28-12-2018',
      headerName: '28-12-2018'
    },
    {
      field: '29-12-2018',
      headerName: '29-12-2018'
    },
    {
      field: '30-12-2018',
      headerName: '30-12-2018'
    },
    {
      field: '31-12-2018',
      headerName: '31-12-2018'
    },
    {
      field: '01-01-2019',
      headerName: '01-01-2019'
     }
  ];
  const sortedCols = comp.sortColumnHeadersByDate(mockDateCols);
  expect(sortedCols).toEqual(expectedSortedCols);

  });

});
