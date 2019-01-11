import { ChangeDetectorRef } from '@angular/core';
import { TestBed, async , ComponentFixture } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsCreatorsListComponent } from './data-entry-statistics-creators-list.component';

const mockCreatorResult: any = [
  {
    creator_id: 1,
    creator_name: 'Test Patient',
    encounter_type: 'ADULTRETURN',
    encounter_type_id: 2,
    encounter_type_uuid: 'uuid1',
    encounters_count: 6,
    is_clinical_encounter: 1,
    user_uuid: 'uuuud',
    location: 'MTRH-1',
    locations: 1,
    location_uuid: 'uuid',
  },
  {
    creator_id: 1,
    creator_name: 'Test Patient',
    encounter_type: 'BETWEENCAREVISIT',
    encounter_type_id: 138,
    encounter_type_uuid: 'db9f6a5c-e141-49fc-ad2b-bdce3f9a6c80',
    encounters_count: 1,
    is_clinical_encounter: 0,
    user_uuid: '5a99b536-13a9-11df-a1f1-0026b9348838',
    location: 'MTRH-1',
    locations: 1,
    location_uuid: 'uuid'
  }
];

const mockCreatorResultRow: any = [
  {
    creators: 'Test Patient',
    creatorUuid: 'uuuud',
    ADULTRETURN: 6,
    BETWEENCAREVISIT: 1,
    total: 7,
    total_clinical: 6,
    clinicalEncounters: [ 'uuid1' ],
    location: 'MTRH-1',
    locationUuid: 'uuid'
   }
];
const mockParams = {
  providerUuid: '',
  locationUuids: '',
  startDate: '2018-04-01',
  endDate: '2018-04-30'
};

describe('Component: Data Entry Creators List', () => {
  let fixture: ComponentFixture<DataEntryStatisticsCreatorsListComponent>;
  let cd: ChangeDetectorRef;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        AgGridModule.withComponents([])
      ],
      declarations: [
        DataEntryStatisticsCreatorsListComponent
      ],
      providers: [
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DataEntryStatisticsCreatorsListComponent);
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
  it('should create encounter Creator rows from obtained result', (done: DoneFn) => {
    comp.dataEntryEncounters = mockCreatorResult;
    comp.params = mockParams;
    const spy = spyOn(comp, 'setPinnedRow').and.returnValue(true);
    comp.processCreatorData();
    cd.detectChanges();
    expect(comp.creatorRowData).toEqual(mockCreatorResultRow);
    done();
  });

  it('should generate the correct totals row', (done: DoneFn) => {
     const totalCreatorEncounters = 6;
     const totalCreatorClinicalEncounters = 4;
     const totalsMap = new Map();
     comp.params = {
       'locationUuids': '08feae7c-1352-11df-a1f1-0026b9348838'
     };
     totalsMap.set('HIVTRIAGE', 2);
     totalsMap.set('ADULTRETURN', 2);
     totalsMap.set('DIFFERENTIATEDCARECLINICIAN', 2);
     const expectedTotal = {
       creators: 'Totals',
       creatorUuid: '',
       total: 6,
       total_clinical: 4,
       clinicalEncounters: [  ],
       locationUuid: '08feae7c-1352-11df-a1f1-0026b9348838',
       HIVTRIAGE: 2,
       ADULTRETURN: 2,
       DIFFERENTIATEDCARECLINICIAN: 2
      };
     const totalsRow = comp.createTotalsRow(totalsMap, totalCreatorEncounters, totalCreatorClinicalEncounters);
     expect(totalsRow).toEqual(expectedTotal);
     done();
  });

});
