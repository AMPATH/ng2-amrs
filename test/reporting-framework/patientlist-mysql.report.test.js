import chai from 'chai';
import * as sinon from 'sinon';
import { Promise } from 'bluebird';
// chai.use(require('chai-string'));
chai.use(require('sinon-chai'));
chai.expect();
import { PatientlistMysqlReport } from '../../app/reporting-framework/patientlist-mysql.report';

// chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
let report;
let params = {
  startDate: '2018-01-01'
};

describe('PatientlistMysqlReport:', () => {
  beforeEach(() => {
    report = new PatientlistMysqlReport('MOH731', params);
  });
  it('should be defined', () => {
    expect(report).to.exist;
  });

  it('should determine the aggregate and the base schemas for an indicator', () => {
    let schemas = {
      'main': {

      },
      'aggr1': {
        uses: [
          {
            'name': 'base3',
            'version': '1.0',
            'type': 'dataset_def'
          }
        ],
        sources: [
          {
            'dataset': 'base3',
            'alias': 'b3'
          }
        ],
        columns: [
          {
            alias: 'w'
          },
          {
            column: 'b3.x'
          }
        ],
        dynamicJsonQueryGenerationDirectives: {}
      },
      'aggr2': {
        uses: [
          {
            'name': 'base4',
            'version': '1.0',
            'type': 'dataset_def'
          }
        ],
        sources: [
          {
            'dataset': 'base4',
            'alias': 'b4'
          }
        ],
        columns: [
          {
            alias: 'y'
          },
          {
            column: 'z'
          }
        ],
        dynamicJsonQueryGenerationDirectives: {}
      },
      'base3': {
        sources: [
          {
            table: 'a.t1',
            alias: 'b3'
          }
        ],
        columns: [
          {
            alias: 'w',
            column: 'a.w'
          },
          {
            alias: 'x',
            column: 'a.x'
          }
        ]
      },
      'base4': {
        sources: [
          {
            table: 'b.t2',
            alias: 'b4'
          }
        ],
        columns: [
          {
            alias: 'y',
            column: 'a.y'
          },
          {
            alias: 'z',
            column: 'a.z'
          }
        ]
      }
    };

    let withW = report.determineBaseAndAggrSchema(schemas, ['w']);
    expect(withW[0].aggregate).to.equal(schemas.aggr1);
    expect(withW[0].base).to.equal(schemas.base3);

    let withZ = report.determineBaseAndAggrSchema(schemas, ['z']);
    expect(withZ[0].aggregate).to.equal(schemas.aggr2);
    expect(withZ[0].base).to.equal(schemas.base4);

    let withX = report.determineBaseAndAggrSchema(schemas, ['x']);
    expect(withX[0].aggregate).to.equal(schemas.aggr1);
    expect(withX[0].base).to.equal(schemas.base3);

    let withNone = report.determineBaseAndAggrSchema(schemas, ['none']);
    expect(withNone.length).to.equal(0)

  });


  it('should fetch patientlist template', (done) => {

    let reports = {
      'main': {}
    };

    let aggregate = {
      dynamicJsonQueryGenerationDirectives: {
        patientListGenerator: {
          useTemplate: 'patient_list_template',
          "useTemplateVersion": '1.0',
        }
      }
    };

    let fetchReportSchemaStub = sinon.stub(report, 'fetchReportSchema')
      .returns(Promise.resolve(reports));

    report.fetchPatientListTemplate(aggregate).then((result) => {
      // fetched reports
      expect(fetchReportSchemaStub.calledWithExactly('patient_list_template', '1.0')).to.be.true;
      expect(result).to.equal(reports);
      done();
    });

  });

  it('should generate the patientlist json query', () => {
    let aggregateSchema = {

    };

    let templateSchema = {

    };

    let baseSchema = {

    };

    let params = {

    };

    let expectedDynamicQuery = {
      params: { a: 'a' },
      generated: baseSchema
    };

    let plGen = {
      generatePatientListSchema: () => {
        return expectedDynamicQuery;
      }
    };

    let getPlistGenStub = sinon.stub(report, 'getPatientListGenerator')
      .returns(plGen);

    let results = report.generatePatientListJsonQuery(aggregateSchema, baseSchema, templateSchema, params);

    expect(getPlistGenStub.calledWithExactly(aggregateSchema, baseSchema, templateSchema, params)).to.be.true;
    expect(results).to.equal(expectedDynamicQuery);
  });

  it('should generate the patientlist report', (done) => {
    let reports = {
      'main': {},
      'report1': {},
      'report2': {}
    };
    let reportQuery = 'select * from everything';
    let results = {
      results: []
    };

    let plSchemasRaw = {
      aggregate: reports.report1,
      base: reports.report2
    };

    let patientListTemplate = {
      'main': {}
    };

    let generated = {
      generated: { 'yyy': 'xxx' },
      params: { 'r': 'x' }
    };

    let fetchReportSchemaStub = sinon.stub(report, 'fetchReportSchema')
      .returns(Promise.resolve(reports));

    let determineBaseAndAggrSchemaStub = sinon.stub(report, 'determineBaseAndAggrSchema')
      .returns(plSchemasRaw);

    let fetchPatientListTemplateStub = sinon.stub(report, 'fetchPatientListTemplate')
      .returns(Promise.resolve(patientListTemplate));

    let generatePlJsonStub = sinon.stub(report, 'generatePatientListJsonQuery')
      .returns(generated);

    let generateReportQueryStub = sinon.stub(report, 'generateReportQuery')
      .returns(Promise.resolve(reportQuery));

    let executeReportQueryStub = sinon.stub(report, 'executeReportQuery')
      .returns(Promise.resolve(results));

    report.generatePatientListReport().then((res) => {
      // fetched reports
      expect(fetchReportSchemaStub.getCalls()[0].calledWithExactly(report.reportName)).to.be.true;
      expect(report.reportSchemas).to.equal(reports);

      // determined patient list base and aggregate
      expect(determineBaseAndAggrSchemaStub.getCalls()[0].calledWithExactly(report.reportSchemas)).to.be.true;
      expect(report.plSchemasRaw).to.equal(plSchemasRaw);

      // fetched templatereport
      expect(fetchPatientListTemplateStub.getCalls()[0].calledWithExactly(report.plSchemasRaw.aggregate)).to.be.true;
      expect(report.plTemplate).to.equal(patientListTemplate);

      // generate patientListJsonQuery
      expect(generatePlJsonStub.calledWithExactly(report.plSchemasRaw.aggregate, report.plSchemasRaw.base, report.plTemplate, report.params)).to.be.true;
      expect(report.generatedPL.main).to.equal(generated.generated);
      expect(report.modifiedParam).to.deep.equal(generated.params);

      // generated report query
      expect(generateReportQueryStub.calledWithExactly(report.generatedPL, report.modifiedParam)).to.be.true;
      expect(report.reportQuery).to.equal(reportQuery);

      // execute report query
      expect(executeReportQueryStub.calledWithExactly(report.reportQuery)).to.be.true;
      expect(report.queryResults).to.equal(results);

      expect(res).to.deep.equal({
        schemas: reports,
        generatedSchemas: { main: generated.generated },
        sqlQuery: reportQuery,
        results: results
      });

      done();
    });
  });

});