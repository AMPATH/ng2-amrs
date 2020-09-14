import { DatePipe } from '@angular/common';

import { TitleCasePipe } from '../../../shared/pipes/title-case.pipe';
import { ClinicalNotesHelperService } from './clinical-notes.helper';

describe('Clinical Notes Helper functions', () => {
  let datePipe: DatePipe;
  let titleCasePipe: TitleCasePipe;
  let mockNotes: Array<any> = [];
  let helper: ClinicalNotesHelperService;

  beforeAll(() => {
    datePipe = new DatePipe('en-US');
    titleCasePipe = new TitleCasePipe();
    helper = new ClinicalNotesHelperService();
  });

  beforeEach(() => {
    mockNotes = [
      {
        visitDate: '2016-05-11T08:41:28.000Z',
        scheduled: null,
        providers: [
          {
            uuid: 'd72283f6-be47-4999-8ae9-969357c3fe78',
            name: 'Idnetifier - FirstName Lastname',
            encounterType: 'TRIAGE'
          }
        ],
        lastViralLoad: {
          value: null,
          date: null
        },
        lastCD4Count: {
          value: null,
          date: null
        },
        artRegimen: {
          curArvMeds: '',
          curArvLine: '',
          startDate: ''
        },
        tbProphylaxisPlan: {
          plan: 'Not available',
          estimatedEndDate: 'N/A',
          startDate: 'Not available'
        },
        ccHpi: [],
        assessment: [],
        vitals: {
          weight: 150,
          height: 150,
          bmi: 67,
          temperature: 36,
          oxygenSaturation: 80,
          systolicBp: 110,
          diastolicBp: 90,
          pulse: 80
        },
        rtcDate: null
      }
    ];
  });

  it('Should return correct date format from DatePipe  ', () => {
    expect(
      datePipe.transform('2016-05-11T08:41:28.000Z', 'dd-MM-yyyy')
    ).toEqual('11-05-2016');
  });

  it('Should return correct Title Case ', () => {
    expect(titleCasePipe.transform('Not available')).toEqual('Not Available');
    expect(titleCasePipe.transform('Not avAilable')).toEqual('Not Available');
    expect(titleCasePipe.transform('Not AVAilable')).toEqual('Not Available');
    expect(titleCasePipe.transform('not available')).toEqual('Not Available');
    expect(titleCasePipe.transform('not Available')).toEqual('Not Available');
  });

  it('Should append seperator to all providers except the last', () => {
    mockNotes[0].providers.push({
      uuid: 'd72283f6-be47-4999-8ae9-969357c3fe78 2',
      name: 'Identifier - FirstName Lastname 2',
      encounterType: 'TRIAGE 2'
    });

    spyOn(helper, 'format').and.callThrough();
    helper.format(mockNotes);
    expect(helper.format).toHaveBeenCalled();
    // expect a new non-enumarable property 'seperator' to have been added
    expect(mockNotes[0].providers[0]['separator']).toEqual(', ');
    // seperator should not be added to the last item in the providers array
    expect(mockNotes[0].providers[1]['separator']).toBeUndefined();
  });

  it('Should format notes correctly', () => {
    spyOn(helper, 'format').and.callThrough();
    helper.format(mockNotes);
    expect(helper.format).toHaveBeenCalled();

    /* test for private methods and that they execute correctly*/
    // valid date input
    expect(mockNotes[0].visitDate).toEqual('11-05-2016');

    // invalid date input to resolveDate function should return default value passed
    expect(mockNotes[0].tbProphylaxisPlan.estimatedEndDate).toEqual('N/A');
    expect(mockNotes[0].tbProphylaxisPlan.startDate).toEqual('Not available');

    // no 'seperator' for providers if its one element
    expect(mockNotes[0].providers[0]['separator']).toBeUndefined();

    // ccHpi is empty hence undefined
    expect(mockNotes[0].hasCcHpiAssessment).toBe(false);
    expect(mockNotes[0].ccHpiAssessment).toBeUndefined();
  });
});
