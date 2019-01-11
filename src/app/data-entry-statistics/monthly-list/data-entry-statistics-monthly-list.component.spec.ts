import { ChangeDetectorRef } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsMonthlyListComponent } from './data-entry-statistics-monthly-list.component';

const mockMonthlyResultRow: any = [
  { encounterType: 'GENCONSULTATION', encounterUuid: 'uuid1', 'April, 2018': 12 , rowTotals: 12 },
  { encounterType: 'OUTREACHFIELDFU', encounterUuid: 'uuid2',  'April, 2018': 2425 ,
  rowTotals: 2425 }
];

const mockParams = {
  providerUuid: '',
  locationUuids: '',
  startDate: '2018-04-01',
  endDate: '2018-04-30'
};

const mockEncounters = [
  {
    encounter_type: 'HIVTRIAGE',
    encounter_type_id: 110,
    encounter_type_uuid: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
    encounters_count: 11,
    location: 'MTRH Module 1',
    locationUuid: '08feae7c-1352-11df-a1f1-0026b9348838',
    locations: 1,
    month: 'January, 2019',
    month_number: 1,
    year: 2019,
  },
  {
    encounter_type: 'ADULTRETURN',
    encounter_type_id: 2,
    encounter_type_uuid: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
    encounters_count: 9,
    location: 'MTRH Module 1',
    locationUuid: '08feae7c-1352-11df-a1f1-0026b9348838',
    locations: 1,
    month: 'January, 2019',
    month_number: 1,
    year: 2019
  },
  {
    encounter_type: 'DIFFERENTIATEDCARECLINICIAN',
    encounter_type_id: 153,
    encounter_type_uuid: '0ea8bfc4-fd3b-40bb-bb34-d5c5d9199c96',
    encounters_count: 5,
    location: 'MTRH Module 1',
    locationUuid: '08feae7c-1352-11df-a1f1-0026b9348838',
    locations: 1,
    month: 'January, 2019',
    month_number: 1,
    year: 2019
  },
  {
    encounter_type: 'TXSUPPORTERMEDREFILL',
    encounter_type_id: 158,
    encounter_type_uuid: '693559d3-4e44-4d33-83f9-bc70ca56fe34',
    encounters_count: 1,
    location: 'MTRH Module 1',
    locationUuid: '08feae7c-1352-11df-a1f1-0026b9348838',
    locations: 1,
    month: 'January, 2019',
    month_number: 1,
    year: 2019
  },
  {
    encounter_type: 'PEPINITIAL',
    encounter_type_id: 56,
    encounter_type_uuid: 'c3a78744-f94a-4a25-ac9d-1c48df887895',
    encounters_count: 2,
    location: 'MTRH Module 1',
    locationUuid: '08feae7c-1352-11df-a1f1-0026b9348838',
    locations: 1,
    month: 'January, 2019',
    month_number: 1,
    year: 2019
  }
];



describe('Component: Data Entry Monthly List', () => {
  let fixture: ComponentFixture<DataEntryStatisticsMonthlyListComponent>;
  let cd: ChangeDetectorRef;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        AgGridModule.withComponents([])
      ],
      declarations: [
        DataEntryStatisticsMonthlyListComponent
      ],
      providers: [
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DataEntryStatisticsMonthlyListComponent);
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
  it('should create correct total monthly encounters row', (done: DoneFn) => {
    const totalsMap =  new Map();
    totalsMap.set('January, 2019', 50);
    const totalEncounters = 50;
    const mockTotalsRow = {
        'encounterUuid': '',
        'encounterType': 'Total',
        'rowTotals': 50,
        'January, 2019': 50
    };
    const rowTotalObj = comp.createTotalsRow(totalsMap, totalEncounters);
    expect(rowTotalObj).toEqual(mockTotalsRow);
    done();
  });

  it('should generate correct monthly data based on map given', (done: DoneFn) => {
    const encounterMap =  new Map();
    const spy = spyOn(comp, 'setPinnedRow').and.returnValue(true);
    const encounterData = {
      location: 'Test Location',
      locationUuid: 'luuid',
      encounterTypes: {
          ADULTINITIAL : {
            encounterCounts: [
              {
              encounterCount: 1,
              encounterMonth: 'January, 2019'
              }
            ],
            encounterName: 'ADULTINITIAL',
            encounterTypeUuid: '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f'
          }
        }
  };

  const mockMotnhlyRowData = [
    {
      'January, 2019' : 1,
      'encounterTypeUuid' : '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f',
      'encounter_type': 'ADULTINITIAL',
      'location': 'Test Location',
      'locationUuid': 'luuid',
      'rowTotals': 1
    }
  ];
    encounterMap.set('Test Location', encounterData);
    comp.processMonthlyRows(encounterMap);
    expect(comp.monthlyRowData).toEqual(mockMotnhlyRowData);
    expect(comp.setPinnedRow).toHaveBeenCalled();
    done();
  });

});
