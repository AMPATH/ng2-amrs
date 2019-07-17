import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { JsExpressionHelper } from 'ngx-openmrs-formentry';
const bfaMale5Above = require('../../../assets/zscore/bfa_boys_5_above.json');
const wflMaleBelow5 = require('../../../assets/zscore/wfl_boys_below5.json');
const hfaMale5Above = require('../../../assets/zscore/hfa_boys_5_above.json');
const hfaMaleBelow5 = require('../../../assets/zscore/hfa_boys_below5.json');

const bfaFemale5Above = require('../../../assets/zscore/bfa_girls_5_above.json');
const wflFemaleBelow5 = require('../../../assets/zscore/wfl_girls_below5.json');
const hfaFemale5Above = require('../../../assets/zscore/hfa_girls_5_above.json');
const hfaFemaleBelow5 = require('../../../assets/zscore/hfa_girls_below5.json');

@Injectable()
export class ZscoreService {

    constructor() {}

// get score reference by gender,birth date and period reported
 public getZRefByGenderAndAge(gender, birthDate, refdate) {
    const scoreRefModel = {weightForHeightRef: null, heightForAgeRef: null, bmiForAgeRef: null};
    const age = this.getAge(birthDate, refdate, 'years');
    const ageInMonths = this.getAge(birthDate, refdate, 'months');
    const ageInDays = this.getAge(birthDate, refdate, 'days');

    if (gender === 'F') {
        if ( age < 5 ) {
          scoreRefModel.weightForHeightRef  = wflFemaleBelow5;
          scoreRefModel.heightForAgeRef = this.getScoreReference(hfaFemaleBelow5, 'Day', ageInDays);
          }
          if ( age >= 5 && age < 18 ) {
            scoreRefModel.bmiForAgeRef =  this.getScoreReference(bfaFemale5Above, 'Month', ageInMonths);
            scoreRefModel.heightForAgeRef = this.getScoreReference(hfaFemale5Above, 'Month', ageInMonths);
          }

    }
    if (gender === 'M') {
        if ( age < 5 ) {
        scoreRefModel.weightForHeightRef = wflMaleBelow5;
        scoreRefModel.heightForAgeRef = this.getScoreReference(hfaMaleBelow5, 'Day', ageInDays);
        }

        if ( age >= 5 && age < 18 ) {
          scoreRefModel.bmiForAgeRef =  this.getScoreReference(bfaMale5Above, 'Month', ageInMonths);
          scoreRefModel.heightForAgeRef = this.getScoreReference(hfaMale5Above, 'Month', ageInMonths);
        }

    }
 return scoreRefModel;
 }

 public getZScoreByGenderAndAge(gender, birthDate, refdate, height, weight) {
   const helper = new JsExpressionHelper();
   const scoreModel = {weightForHeight: null, heightForAge: null, bmiForAge: null};
   const refModel =  this.getZRefByGenderAndAge(gender, birthDate, refdate);
   scoreModel.bmiForAge = helper.calcBMIForAgeZscore(refModel.bmiForAgeRef, height, weight);
   scoreModel.weightForHeight = helper.calcWeightForHeightZscore(refModel.weightForHeightRef, height, weight);
   scoreModel.heightForAge = helper.calcHeightForAgeZscore(refModel.heightForAgeRef, height, weight);
   return scoreModel;
 }

 private getScoreReference(refData, searchKey, searchValue): any {
    return _.filter(refData, (refObject) => {
       return refObject[searchKey] === searchValue;
    });
  }

  private getAge(birthdate, refDate, ageIn) {
    if (birthdate  && refDate && ageIn ) {
    const todayMoment: any = Moment(refDate);
    const birthDateMoment: any = Moment(birthdate);
    return todayMoment.diff(birthDateMoment, ageIn);
    }
    return null;
  }

}
