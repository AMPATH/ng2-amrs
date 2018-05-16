import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture , tick } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsProviderListComponent } from
'./data-entry-statistics-providers-list.component';

const mockProviderResult: any = [
  {
    encounter_type: 'ADULTRETURN',
    encounter_type_id: 2,
    encounter_type_uuid: 'uuid',
    encounters_count: 6,
    is_clinical_encounter: 1,
    provider_id: 44,
    provider_name: 'Test Patient',
    provider_uuid: 'uuid1'
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
    clinicalEncounters: [ 'uuid' ]
  }
];

const mockParams = {
  providerUuid: '',
  locationUuids: '',
  startDate: '2018-04-01',
  endDate: '2018-04-30'
};

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
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);

      });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
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

});
