import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsDailyListComponent } from
'./data-entry-statistics-daily-list.component';

const mockDailyResult: any = [
  {
    date: '2018-04-16',
    encounter_type: 'ADULTINITIAL',
    encounter_type_id: 1,
    encounter_type_uuid: 'uuid',
    encounters_count: 23
  },
  {
    date: '2018-04-16',
    encounter_type: 'ADULTRETURN',
    encounter_type_id: '2',
    encounter_type_uuid: 'uuid2',
    encounters_count: 1023
  }
];

const mockDailyResultRow: any = [
    {
     encounterType: 'ADULTINITIAL',
     encounterUuid: 'uuid',
     '16-04-2018': 23,
     rowTotals: 23,
    },
    {
      encounterType: 'ADULTRETURN',
      encounterUuid: 'uuid2',
      '16-04-2018': 1023,
      rowTotals: 1023,
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
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);

      });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

  it('should create encounter daily rows from obtained result', (done: DoneFn) => {
    comp.dataEntryEncounters = mockDailyResult;
    comp.params = mockParams;
    spyOn(comp, 'setPinnedRow').and.returnValue(true);
    comp.processEncounterListData();
    cd.detectChanges();
    expect(comp.dataEntryRowData).toEqual(mockDailyResultRow);
    done();
  });

});
