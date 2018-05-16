import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { AgGridModule } from 'ag-grid-angular';
import { DataEntryStatisticsMonthlyListComponent } from
'./data-entry-statistics-monthly-list.component';

const mockMonthlyResult: any = [
    {
        encounter_type : 'GENCONSULTATION',
        encounter_type_id : 167,
        encounter_type_uuid : 'uuid1',
        encounters_count : 12 ,
        month : 'April, 2018',
        month_number : 4,
        year : 2018
    },
    {
        encounter_type : 'OUTREACHFIELDFU',
        encounter_type_id : 21,
        encounter_type_uuid : 'uuid2',
        encounters_count :  2425,
        month : 'April, 2018',
        month_number : 4,
        year : 2018
    }
  ];

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
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);

      });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

  it('should create encounter Monthly rows from obtained result', (done: DoneFn) => {
    comp.dataEntryEncounters = mockMonthlyResult;
    comp.params = mockParams;
    spyOn(comp, 'setPinnedRow').and.returnValue(true);
    comp.procesMonthlyData();
    cd.detectChanges();
    expect(comp.monthlyRowData).toEqual(mockMonthlyResultRow);
    done();
  });

});
