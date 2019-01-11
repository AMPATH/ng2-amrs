import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture , tick } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsProviderListComponent } from './data-entry-statistics-providers-list.component';

const mockProviderResult: any = [
  {
    encounter_type: 'ADULTRETURN',
    encounter_type_id: 2,
    encounter_type_uuid: 'uuid',
    encounters_count: 6,
    is_clinical_encounter: 1,
    provider_id: 44,
    provider_name: 'Test Patient',
    provider_uuid: 'uuid1',
    location: 'MTRH-1',
    locations: 1,
    location_uuid: 'uuid',
  },
  {
    encounter_type: 'BETWEENCAREVISIT',
    encounter_type_id: 138,
    encounter_type_uuid: 'uuid3',
    encounters_count: 1,
    is_clinical_encounter: 0,
    provider_id: 44,
    provider_name: 'Test Patient',
    provider_uuid: 'uuid1',
    location: 'MTRH-1',
    locations: 1,
    location_uuid: 'uuid',
  }
];

const mockProviderResultRow: any = [
  {
    providers: 'Test Patient',
    providerUuid: 'uuid1',
    ADULTRETURN: 6,
    BETWEENCAREVISIT: 1,
    total: 7,
    total_clinical: 6,
    clinicalEncounters: [ 'uuid' ],
    location: 'MTRH-1',
    locationUuid: 'uuid'
  }
];

const mockProviderRowData = [{
  providers: 'Test Provider',
  location: 'MTRH Module 3',
  locationUuid: '08fec150-1352-11df-a1f1-0026b9348838',
  providerUuid: 'puuid',
  clinicalEncounters: [],
  HIVTRIAGE: 4,
  total: 4,
  total_clinical: 0
}];

const mockParams = {
  providerUuid: 'puuid',
  locationUuids: '08fec150-1352-11df-a1f1-0026b9348838',
  startDate: '2018-04-01',
  endDate: '2018-04-30'
};

const providerMap = new Map();

describe('Component: Data Entry Provider List', () => {
  let fixture: ComponentFixture<DataEntryStatisticsProviderListComponent>;
  let cd: ChangeDetectorRef;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        AgGridModule.withComponents([])
      ],
      declarations: [
        DataEntryStatisticsProviderListComponent
      ],
      providers: [
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DataEntryStatisticsProviderListComponent);
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
  it('should create encounter Provider rows from obtained result', (done: DoneFn) => {
    comp.dataEntryEncounters = mockProviderResult;
    spyOn(comp, 'setPinnedRow').and.returnValue(true);
    comp.params = mockParams;
    comp.processProviderData();
    cd.detectChanges();
    expect(comp.providerRowData).toEqual(mockProviderResultRow);
    done();
  });

  it('should generate correct provider rows given provider map', (done: DoneFn) => {
    const providerMapData = {
      encounters : [{
        encounterUuid: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        encounter_type: 'HIVTRIAGE',
        encounters_count: 4,
        is_clinical: 0
      }],
      location: 'MTRH Module 3',
      locationUuid: '08fec150-1352-11df-a1f1-0026b9348838',
      providerName: 'Test Provider',
      providerUuid: 'puuid'
    };
    comp.params = mockParams;
    providerMap.set('123', providerMapData);
    comp.generateProviderRowData(providerMap);
    expect(comp.providerRowData).toEqual(mockProviderRowData);
    expect(comp.totalProviderEncounters).toEqual(4);
    done();
  });

  it('should create correct total row based on provider encounters', (done: DoneFn) => {
    const totalsMap = new Map();
    totalsMap.set('HIVTRIAGE', 4);
    const totalProvidersEncounters = 4;
    const totalProviderClinicalEncounters = 0;
    const mockTotalRow = {
      HIVTRIAGE: 4,
      clinicalEncounters: [],
      locationUuid: '08fec150-1352-11df-a1f1-0026b9348838',
      providerUuid: 'puuid',
      providers: 'Total',
      total: 4,
      total_clinical: 0
    };
    comp.params = mockParams;
    const rowTotalObj = comp.createTotalsRow(totalsMap, totalProvidersEncounters, totalProviderClinicalEncounters);
    expect(rowTotalObj).toEqual(mockTotalRow);

    done();
  });

});
