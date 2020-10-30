import chai from 'chai';
import * as sinon from 'sinon';
import { Promise } from 'bluebird';
// chai.use(require('chai-string'));
chai.use(require('sinon-chai'));
chai.expect();
import { MultiDatasetReport } from '../../app/reporting-framework/multi-dataset.report';

// chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
let report;
let params = {
  startDate: '2018-01-01'
};

describe('MultiDatasetReport:', () => {
  beforeEach(() => {
    report = new MultiDatasetReport('MOH731', params);
  });

  it('should be defined', () => {
    expect(report).to.exist;
  });

  it('should generate reports', (done) => {
    let reports = {
      main: {
        reports: ['report1', 'report2']
      }
    };

    let additionalParams = {};

    let results = [];

    let fetchReportSchemaStub = sinon
      .stub(report, '_fetchAndInitReports')
      .returns(Promise.resolve(reports));

    let executeReportHandlersStub = sinon
      .stub(report, 'executeReportHandlers')
      .returns(Promise.resolve(results));

    report.generateReport(additionalParams).then((generated) => {
      // fetched reports
      expect(fetchReportSchemaStub.called).to.be.true;
      expect(
        executeReportHandlersStub.calledWithExactly(
          report.reportHandlers,
          additionalParams
        )
      ).to.be.true;
      expect(generated).to.equal(results);
      done();
    });
  });

  it('should fetch report and init report handlers', (done) => {
    let reports = {
      main: {
        reports: ['report1', 'report2']
      }
    };

    let fetchReportSchemaStub = sinon
      .stub(report, 'fetchReportSchema')
      .returns(Promise.resolve(reports));

    report._fetchAndInitReports().then((generated) => {
      // fetched reports
      expect(fetchReportSchemaStub.calledWithExactly(report.reportName)).to.be
        .true;
      expect(report.reportSchemas).to.equal(reports);
      expect(report.reportHandlers.length).to.equal(2);
      expect(report.reportHandlers[0].reportName).to.equal('report1');
      expect(report.reportHandlers[1].reportName).to.equal('report2');
      done();
    });
  });

  it('should execute report handlers', (done) => {
    let reportHandlers = [
      {
        name: 'report1'
      },
      {
        name: 'report2'
      }
    ];

    let sampleResult = {
      schemas: null,
      sqlQuery: '',
      results: []
    };

    let additionalParams = {
      type: 'aggregateReport'
    };

    let runSingleReportStub = sinon
      .stub(report, 'runSingleReport')
      .returns(Promise.resolve(sampleResult));

    report
      .executeReportHandlers(reportHandlers, additionalParams)
      .then((results) => {
        expect(
          runSingleReportStub
            .getCalls()[0]
            .calledWithExactly(reportHandlers[0], additionalParams)
        );
        expect(results).to.deep.equal([
          {
            report: reportHandlers[0],
            results: sampleResult
          },
          {
            report: reportHandlers[1],
            results: sampleResult
          }
        ]);
        done();
      });
  });

  // it('should fetch all individual reports', () => {

  //     let reports = {
  //         'main': {
  //             reports: ['report1', 'report2']
  //         }
  //     };

  // });

  // it('should fetch a single report', (done) => {

  // });
});
