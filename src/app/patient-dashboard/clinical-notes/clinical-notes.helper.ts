import { DatePipe } from '@angular/common';

import { TitleCasePipe } from '../../shared/pipes/title-case.pipe';
import { Helpers } from '../../utils/helpers';
import * as _ from 'lodash';

export class ClinicalNotesHelperService {

  arvLine: any = {
    1: 'First',
    2: 'Second',
    3: 'Third',
    4: 'Fourth'
  };

  datePipe: DatePipe;
  titleCasePipe: TitleCasePipe;

  constructor() {

    this.datePipe = new DatePipe('en-US');
    this.titleCasePipe = new TitleCasePipe();
  }

  format(notes: Array<any>): Array<any> {

    let notAvailableMessage: string = 'Not available';

    let temp: Array<any> = [];

    if (!_.isArray(notes)) {
      temp = [notes];
    } else {
      temp = notes;
    }


    _.each(temp, (note) => {
      // Format date
      note.visitDate = this.resolveDate(note.visitDate);

      // Format scheduled
      if (Helpers.isNullOrEmpty(note.scheduled)) {
        note.scheduled = 'unscheduled';
      } else {
        note.scheduled = 'scheduled';
      }

      // Format providers
      this.formatProviders(note.providers, ', ');

      // Format Viral load
      if (Helpers.isNullOrEmpty(note.lastViralLoad.value)) {
        note.lastViralLoad = false;
      } else {
        // format date
        note.lastViralLoad.date = this.resolveDate(note.lastViralLoad.date);
      }

      if (Helpers.isNullOrEmpty(note.lastCD4Count.value)) {
        note.lastCD4Count = null;
      } else {
        // format date
        note.lastCD4Count.date = this.resolveDate(note.lastCD4Count.date);
      }


      // Format ARV Regimen line
      if (!Helpers.isNullOrEmpty(note.artRegimen.curArvLine)
        && _.has(this.arvLine, note.artRegimen.curArvLine)) {
        note.artRegimen.curArvLine = this.arvLine[note.artRegimen.curArvLine];
      } else {
        note.artRegimen.curArvLine = 'Not Specified';
      }

      if (Helpers.isNullOrEmpty(note.artRegimen.curArvMeds)) {
        note.artRegimen.curArvMeds = false;
      } else {
        note.artRegimen.curArvMeds = this.titleCasePipe.transform(note.artRegimen.curArvMeds);
        note.artRegimen.startDate = this.resolveDate(note.artRegimen.arvStartDate);
      }

      // Format prophylaxis
      note.tbProphylaxisPlan.plan = this.titleCasePipe.transform(note.tbProphylaxisPlan.plan);
      note.tbProphylaxisPlan.startDate = this.resolveDate(note.tbProphylaxisPlan.startDate);
      note.tbProphylaxisPlan.estimatedEndDate =
        this.resolveDate(note.tbProphylaxisPlan.estimatedEndDate);


      // format rtc date
      note.rtcDate = this.resolveDate(note.rtcDate);

      // format vitals
      if (note.vitals.systolicBp === '' || note.vitals.diastolicBp === '') {
        note.vitals.bp = '';
      } else {
        note.vitals.bp = note.vitals.systolicBp + '/' + note.vitals.diastolicBp;
      }

      Helpers.formatBlankOrNull(note.vitals, 'Not Available');

      // Group ccHpi and Assessemnt
      let grouped = this.groupCCHPIAndAssessment(note.ccHpi, note.assessment);

      if (_.isEmpty(grouped)) {
        note.hasCcHpiAssessment = false;
      } else {
        // Formant blank values
        _.each(grouped, function (group) {
          Helpers.formatBlankOrNull(group, 'Not Provided');
        });
        note.hasCcHpiAssessment = true;
        note.ccHpiAssessment = grouped;
      }
    });
    return notes;
  }

  // pipe valid dates only
  private resolveDate(date: string) {

    let dateFormat: string = 'dd-MM-yyyy';
    let parsedDate = Date.parse(date);

    return isNaN(parsedDate) ? date : this.datePipe.transform(date, dateFormat);
  }

  private formatProviders(providers, separator) {

    if (providers.length <= 1) return;

    // Add separator to every provider but the last
    for (let i = 0; i < providers.length - 1; i++) {
      providers[i].separator = separator;
    }
  }

  private groupCCHPIAndAssessment(ccHpiArray, assessmentArray) {
    // Grouping CC/HPI and Assessemnt by encounter
    if (_.isEmpty(ccHpiArray) && _.isEmpty(assessmentArray)) {
      return [];
    }

    let ccHpiAssessment = [];
    if (!_.isEmpty(ccHpiArray)) {
      if (_.isEmpty(assessmentArray)) {
        _.each(ccHpiArray, function (ccHpi) {
          let o = {
            encounterType: ccHpi.encounterType,
            ccHpi: ccHpi.value,
            assessment: ''
          };
          ccHpiAssessment.push(o);
        });
      } else {
        // In case assessmentArray is not empty
        _.each(ccHpiArray, function (ccHpi) {
          let o = {
            encounterType: ccHpi.encounterType,
            ccHpi: ccHpi.value,
            assessment: ''
          };
          let ass = _.find(assessmentArray, function (assItem) {
            return ccHpi['encounterType'] === assItem['encounterType'];
          });
          if (ass) {
            o.assessment = ass['value'];
          }
          ccHpiAssessment.push(o);
        });
      }
    } else {
      // ccHpiArray is empty we redo the code the same way.
      _.each(assessmentArray, function (ass) {
        let o = {
          encounterType: ass.encounterType,
          ccHpi: '',
          assessment: ass.value
        };
        ccHpiAssessment.push(o);
      });
    }
    return ccHpiAssessment;
  }


}
