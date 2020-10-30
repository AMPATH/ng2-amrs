import ReportProcessorHelpersService from '../../app/reporting-framework/report-processor-helpers.service';
import mlog from 'mocha-logger';
const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  chaiAsPromised = require('chai-as-promised'),
  Mysql = require('mysql'),
  sinon = require('sinon'),
  Promise = require('bluebird');
chai.use(chaiAsPromised);

describe('MOH731 Helpers', function () {
  const reportProcessorHelpersService = new ReportProcessorHelpersService();
  beforeEach(() => {});
  afterEach(() => {});

  it('should transform a set given aggregation columns and join constant when transform() is called', () => {
    let set1 = [
      {
        location_id: 1,
        age_range: '0_to_1',
        gender: 'M',
        on_art: 40
      },
      {
        location_id: 1,
        age_range: '0_to_1',
        gender: 'F',
        on_art: 20
      },
      {
        location_id: 1,
        age_range: '1_to_2',
        gender: 'M',
        on_art: 20
      },
      {
        location_id: 1,
        age_range: '1_to_2',
        gender: 'F',
        on_art: 10
      },
      {
        location_id: 2,
        age_range: '0_to_1',
        gender: 'M',
        on_art: 50
      },
      {
        location_id: 2,
        age_range: '0_to_1',
        gender: 'F',
        on_art: 60
      },
      {
        location_id: 2,
        age_range: '1_to_2',
        gender: 'M',
        on_art: 30
      },
      {
        location_id: 2,
        age_range: '1_to_2',
        gender: 'F',
        on_art: 70
      }
    ];
    let result = reportProcessorHelpersService.tranform(set1, {
      use: ['gender', 'age_range'],
      joinColumn: 'location_id',
      skip: []
    });
    mlog.log('Result', JSON.stringify(result));
    expect(result).to.be.an('array');

    let finalSet1 = {
      location_id: 1,
      dc__gender__M__age_range__0_to_1__on_art: 40,
      dc__gender__F__age_range__0_to_1__on_art: 20,
      dc__gender__M__age_range__1_to_2__on_art: 20,
      dc__gender__F__age_range__1_to_2__on_art: 10
    };

    let finalSet2 = {
      location_id: 2,
      dc__gender__M__age_range__0_to_1__on_art: 50,
      dc__gender__F__age_range__0_to_1__on_art: 60,
      dc__gender__M__age_range__1_to_2__on_art: 30,
      dc__gender__F__age_range__1_to_2__on_art: 70
    };
    expect(result).to.deep.include(finalSet1);
    expect(result).to.deep.include(finalSet2);
  });

  it('should join to datasets when joinDatasets in called with a join column and data sets', () => {
    let set1 = [
      {
        location_id: 1,
        art: 40
      }
    ];

    let set2 = [
      {
        location_id: 1,
        active: 60
      },
      {
        location_id: 2,
        active: 40
      }
    ];

    let set3 = [
      {
        location_id: 2,
        ltfu: 60
      }
    ];

    let finalSet1 = {
      location_id: 1,
      art: 40,
      active: 60
    };

    let finalSet2 = {
      location_id: 2,
      active: 40,
      ltfu: 60
    };
    let result = reportProcessorHelpersService.joinDataSets(
      'location_id',
      set1,
      set2
    );
    let finalResult = reportProcessorHelpersService.joinDataSets(
      'location_id',
      result,
      set3
    );
    mlog.log('Result', JSON.stringify(finalResult));
    expect(finalResult).to.be.an('array');
    expect(finalResult).to.deep.include(finalSet1);
    expect(finalResult).to.deep.include(finalSet2);
  });
});
