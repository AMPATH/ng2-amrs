import chai from 'chai';
import * as sinon from 'sinon';
import { Promise } from 'bluebird';
// chai.use(require('chai-string'));
chai.use(require('sinon-chai'));
chai.expect();
import { BaseMysqlReport } from '../../app/reporting-framework/base-mysql.report';

// chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
let report;
let params = {
  startDate: '2018-01-01'
};

describe('BaseMysqlReport:', () => {
  beforeEach(() => {
    report = new BaseMysqlReport('MOH731', params);
  });
  it('should be defined', () => {
    expect(report).to.exist;
  });

  it('should generate report', (done) => {
    let reports = {
      main: {},
      report1: {},
      report2: {}
    };
    let reportQuery = 'select * from everything';
    let results = {
      results: []
    };
    let fetchReportSchemaStub = sinon
      .stub(report, 'fetchReportSchema')
      .returns(Promise.resolve(reports));

    let generateReportQueryStub = sinon
      .stub(report, 'generateReportQuery')
      .returns(Promise.resolve(reportQuery));

    let executeReportQueryStub = sinon
      .stub(report, 'executeReportQuery')
      .returns(Promise.resolve(results));

    report.generateReport().then((generated) => {
      // fetched reports
      expect(fetchReportSchemaStub.calledWithExactly(report.reportName)).to.be
        .true;
      expect(report.reportSchemas).to.equal(reports);

      // generated report query
      expect(
        generateReportQueryStub.calledWithExactly(
          report.reportSchemas,
          report.params
        )
      ).to.be.true;
      expect(report.reportQuery).to.equal(reportQuery);

      // execute report query
      expect(executeReportQueryStub.calledWithExactly(report.reportQuery)).to.be
        .true;
      expect(report.queryResults).to.equal(results);

      expect(generated).to.deep.equal({
        schemas: reports,
        sqlQuery: reportQuery,
        results: results
      });

      done();
    });
  });

  it('should generate report query', (done) => {
    let jSql = {
      generateSQL: () => {
        return {
          toString: () => {
            return 'select * from everything';
          }
        };
      }
    };

    let getJson2SqlStub = sinon.stub(report, 'getJson2Sql').returns(jSql);

    let schemas = {};

    let params = {
      startDate: '2018-01-20'
    };

    report.generateReportQuery(schemas, params).then((sql) => {
      expect(getJson2SqlStub.calledWithExactly(schemas, params)).to.be.true;
      expect(sql).to.equal('select * from everything');
      done();
    });
  });

  it('should execute report query', (done) => {
    let results = [1, 2];

    let sqlParam = 'select * from a;';

    let runner = {
      executeQuery: (sql, params) => {
        if (sql === sqlParam) {
          return Promise.resolve(results);
        } else {
          return Promise.reject('Unknown case');
        }
      }
    };

    let getSqlRunnerStub = sinon.stub(report, 'getSqlRunner').returns(runner);

    report.executeReportQuery(sqlParam).then((res) => {
      expect(getSqlRunnerStub.called).to.be.true;
      expect(res).to.deep.equal({
        results: results
      });
      done();
    });
  });
});
