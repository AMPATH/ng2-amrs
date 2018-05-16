import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsCreatorsListComponent } from
'./data-entry-statistics-creators-list.component';

const mockCreatorResult: any = [
  {
    creator_id: 1,
    creator_name: 'Test Patient',
    encounter_type: 'ADULTRETURN',
    encounter_type_id: 2,
    encounter_type_uuid: 'uuid1',
    encounters_count: 6,
    is_clinical_encounter: 1,
    user_uuid: 'uuuud'
  },
  {
    creator_id: 1,
    creator_name: 'Test Patient',
    encounter_type: 'BETWEENCAREVISIT',
    encounter_type_id: 138,
    encounter_type_uuid: 'db9f6a5c-e141-49fc-ad2b-bdce3f9a6c80',
    encounters_count: 1,
    is_clinical_encounter: 0,
    user_uuid: '5a99b536-13a9-11df-a1f1-0026b9348838'
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
    clinicalEncounters: [ 'uuid1' ]
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
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);

      });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });
  it('should create encounter Creator rows from obtained result', (done: DoneFn) => {
    comp.dataEntryEncounters = mockCreatorResult;
    comp.params = mockParams;
    let spy = spyOn(comp, 'setPinnedRow').and.returnValue(true);
    comp.processCreatorData();
    cd.detectChanges();
    expect(comp.creatorRowData).toEqual(mockCreatorResultRow);
    done();
  });

});
