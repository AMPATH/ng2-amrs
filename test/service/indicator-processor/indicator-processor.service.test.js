var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var indicatorProcessor = require('../../../service/indicator-processor/indicator-processor.service');
var indicatorsSchemaDefinition = require('../../../reports/indicators.json');
var sampleReport = require('./sample-report.json');
var _ = require('underscore');
var expect = chai.expect;
chai.use(sinonChai);

describe('Indicator Processor Service Unit Tests', function () {
  beforeEach(function (done) {
    done();
  });

  afterEach(function () {});

  it('should be defined', function () {
    expect(indicatorProcessor).to.be.defined;
  });

  it('should have required methods defined', function () {
    expect(indicatorProcessor.disaggregateDynamicIndicators).to.be.defined;
    expect(indicatorProcessor.disaggregateFixedIndicators).to.be.defined;
    expect(indicatorProcessor.replaceIndicatorParam).to.be.defined;
  });

  it('should be able to disaggregate and mutate any indicator by age range ', function () {
    var request = {
      requestParams: {
        ageRangeFilter: '5,30' // meaning 5 to 30
      }
    };
    var result = indicatorProcessor.disaggregateDynamicIndicators(
      sampleReport,
      indicatorsSchemaDefinition,
      request
    );
    expect(result)
      .to.be // for age 6
      .an('array')
      .that.includes(
        'count(distinct if(timestampdiff(month,arv_start_date,encounter_datetime) >= 6 and (timestampdiff(year,t3.birthdate,t2.endDate) > 5 and timestampdiff(year,t3.birthdate,t2.endDate) <= 6), t1.person_id,null)) as patients_requiring_vl_age_6'
      );
    expect(result)
      .to.be // for age 8... and so on
      .an('array')
      .that.includes(
        'count(distinct if(timestampdiff(month,arv_start_date,encounter_datetime) >= 6 and (timestampdiff(year,t3.birthdate,t2.endDate) > 7 and timestampdiff(year,t3.birthdate,t2.endDate) <= 8), t1.person_id,null)) as patients_requiring_vl_age_8'
      );
  });

  it('should be able to disaggregate and mutate any indicator by age group ', function () {
    var request = {
      requestParams: {
        ageGroupFilter: '0_to_5,6_to_10' // meaning age_group_0_to_5 e.t.c
      }
    };
    var result = indicatorProcessor.disaggregateDynamicIndicators(
      sampleReport,
      indicatorsSchemaDefinition,
      request
    );
    expect(result).to.be.an('array');

    // for age 0_to_5
    expect(result)
      .to.be.an('array')
      .that.includes(
        'count(distinct if(timestampdiff(month,arv_start_date,encounter_datetime) >= 6 and (timestampdiff(year,t3.birthdate,t2.endDate) >= 0 and timestampdiff(year,t3.birthdate,t2.endDate) <= 5), t1.person_id,null)) as patients_requiring_vl_age_0_to_5'
      );

    // for age 6_to_10
    expect(result)
      .to.be.an('array')
      .that.includes(
        'count(distinct if(timestampdiff(month,arv_start_date,encounter_datetime) >= 6 and (timestampdiff(year,t3.birthdate,t2.endDate) >= 6 and timestampdiff(year,t3.birthdate,t2.endDate) <= 10), t1.person_id,null)) as patients_requiring_vl_age_6_to_10'
      );
  });

  it('should be able to disaggregate and mutate any indicator by gender', function () {
    var request = {
      requestParams: {
        genderFilter: 'male,female'
      }
    };
    var result = indicatorProcessor.disaggregateDynamicIndicators(
      sampleReport,
      indicatorsSchemaDefinition,
      request
    );
    expect(result).to.be.an('array');
    // for M
    expect(result)
      .to.be.an('array')
      .that.includes(
        "count(distinct if(timestampdiff(month,arv_start_date,encounter_datetime) >= 6 and (t3.gender='M'), t1.person_id,null)) as patients_requiring_vl_male"
      );
    // for F
    expect(result)
      .to.be.an('array')
      .that.includes(
        "count(distinct if(timestampdiff(month,arv_start_date,encounter_datetime) >= 6 and (t3.gender='F'), t1.person_id,null)) as patients_requiring_vl_female"
      );
  });

  it('should be able to disaggregate and mutate any indicator by patient Care Status', function () {
    var request = {
      requestParams: {
        patientCareStatusFilter: 'ltfu' // >90 means LTFU, <1 means Active, between 0 and 91 means defaulter
      }
    };
    var result = indicatorProcessor.disaggregateDynamicIndicators(
      sampleReport,
      indicatorsSchemaDefinition,
      request
    );
    expect(result).to.be.an('array');
    // case LTFU
    expect(result)
      .to.be.an('array')
      .that.includes(
        'count(distinct if(timestampdiff(month,arv_start_date,encounter_datetime) >= 6 and (case when date(t1.death_date) <= t2.endDate or (date(outreach_death_date_bncd) <= t2.endDate and date(outreach_date_bncd) <= t2.endDate) then null when t1.transfer_out is not  null or  (outreach_patient_care_status_bncd in (1287,1594,9068,9504,1285) and date(outreach_date_bncd) <=  t2.endDate) or (transfer_transfer_out_bncd is not null and date(transfer_date_bncd) <=  t2.endDate) then null when t1.patient_care_status in (9083) or (outreach_patient_care_status_bncd in (9083) and date(outreach_date_bncd) <=  t2.endDate) then null when (outreach_patient_care_status_bncd in (9036) and date(outreach_date_bncd) <=  t2.endDate) or t1.patient_care_status in (9036) then null when timestampdiff(day, if(t1.rtc_date, t1.rtc_date, DATE_ADD(t1.encounter_datetime, INTERVAL 30 DAY)), t2.endDate) >90 then 1 else null end), t1.person_id,null)) as patients_requiring_vl_ltfu'
      );
    // TODO: case Defaulters

    // TODO: case Active in care
  });

  it('should NOT disaggregate indicators with no property "canBeDisaggregated" and it should be set to true', function () {
    var request = {
      requestParams: {
        ageRangeFilter: '5,7', // meaning age 5 to 7
        ageGroupFilter: '0_to_5',
        genderFilter: 'male',
        patientCareStatusFilter: 'active_in_care' // >90 means LTFU, <1 means Active, between 0 and 91 means defaulter
      }
    };
    var result = indicatorProcessor.disaggregateDynamicIndicators(
      sampleReport,
      indicatorsSchemaDefinition,
      request
    );
    expect(result).to.be.an('array');
    expect(result)
      .to.be.an('array')
      .to.not.include(
        'if([tested_appropriately]=0, 0,([tested_appropriately]/[patients_requiring_vl])*100) as perc_tested_appropriately_age_6'
      );
    expect(result)
      .to.be.an('array')
      .to.not.include(
        'if([tested_appropriately]=0, 0,([tested_appropriately]/[patients_requiring_vl])*100) as perc_tested_appropriately_age_7'
      );
    expect(result)
      .to.be.an('array')
      .to.not.include(
        'if([tested_appropriately]=0, 0,([tested_appropriately]/[patients_requiring_vl])*100) as perc_tested_appropriately_age_0_to_5'
      );
    expect(result)
      .to.be.an('array')
      .to.not.include(
        'if([tested_appropriately]=0, 0,([tested_appropriately]/[patients_requiring_vl])*100) as perc_tested_appropriately_male'
      );
    expect(result)
      .to.be.an('array')
      .to.not.include(
        'if([tested_appropriately]=0, 0,([tested_appropriately]/[patients_requiring_vl])*100) as perc_tested_appropriately_active_in_care'
      );

    console.log(result);
  });
});
