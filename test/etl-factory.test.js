var chai = require('chai');
var routes = require('../etl-routes');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var mockData = require('./mock/mock-data');
var _ = require('underscore');
var Hapi = require('hapi');
var fakeServer = require('./sinon-server-1.17.3');
var queryParams = { reportName: "test-report-01" };
var reports = mockData.getReportMock();

var reportFactory = require('../etl-factory');
reportFactory.setReportList(reports);
chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;


chai.use(sinonChai);

describe('ETL-SERVER TESTS REPORT FACTORY TESTS', function () {

    describe('Testing buildPatientListExpression function', function () {
        var stub;
        beforeEach(function (done) {
            stub = sinon.stub(reportFactory, 'buildPatientListExpression');
            stub.restore();
            done();
        });

        afterEach(function () {
            stub.restore();
        });

        it('should create the right  Patient List Expression object when buildPatientListExpression is called',
            function (done) {
                stub.yields({ whereClause: " and (input_expression1)", resource: "etl.test_flat_hiv_summary" });
                var queryParams = { reportIndicator: 'indicator1,indicator2', reportName: 'test-report-01' }
                var indicatorsSchema = [{ name: 'indicator1', expression: 'input_expression1' }, { name: 'indicator11', expression: 'expression2' }];
                var patientListExpression = {};
                reportFactory.setIndicatorsSchema(indicatorsSchema);
                reportFactory.buildPatientListExpression(queryParams, function (response) {
                    patientListExpression = response
                    done();
                });

                expect(patientListExpression).to.be.an("object");
                expect(patientListExpression.whereClause).to.equal(" and (input_expression1)");
                expect(patientListExpression.resource).to.equal("etl.test_flat_hiv_summary");
            });
    });

    describe('Testing buildIndicatorsSchema function', function () {
        var stub;
        beforeEach(function (done) {
            stub = sinon.stub(reportFactory, 'buildIndicatorsSchema');
            stub.restore();
            done();
        });

        afterEach(function () {
            stub.restore();
        });

        it('should create the right  Indicators Schema object when buildIndicatorsSchema is called',
            function (done) {
                stub.yields({ whereClause: " and (input_expression1)", resource: "etl.test_flat_hiv_summary" });
                var queryParams = { reportIndicator: 'indicator1,indicator2', reportName: 'test-report-01' }
                var indicatorsSchema = [{ name: 'indicator1', expression: 'input_expression1' }, { name: 'test2_scheduled', expression: 'expression2' }];
                var resolvedIndicatorsSchema = [];
                reportFactory.setIndicatorsSchema(indicatorsSchema);
                reportFactory.buildIndicatorsSchema(queryParams, function (response) {
                    resolvedIndicatorsSchema = response
                    done();
                });

                expect(resolvedIndicatorsSchema).to.be.an("array");
                expect(resolvedIndicatorsSchema[0].name).to.equal("test2_scheduled");
                expect(resolvedIndicatorsSchema[0].expression).to.equal("expression2");
            });
    });


    describe('Testing buildIndicatorsSchemaWithSections function', function () {
        var stub;
        beforeEach(function (done) {
            stub = sinon.stub(reportFactory, 'buildIndicatorsSchemaWithSections');
            stub.restore();
            done();
        });

        afterEach(function () {
            stub.restore();
        });

        it('should create the right Indicators Schema With Sections object when buildIndicatorsSchemaWithSections  is called',
            function (done) {
                stub.yields({ whereClause: " and (input_expression1)", resource: "etl.test_flat_hiv_summary" });
                var queryParams = { reportIndicator: 'indicator1,indicator2', reportName: 'test-report-01' }
                var indicatorsSchema = [{ name: 'indicator1', expression: 'input_expression1' }, { name: 'test2_scheduled', expression: 'expression2' }];
                var indicatorsSchemaWithSections = [];
                reportFactory.setIndicatorsSchema(indicatorsSchema);
                reportFactory.buildIndicatorsSchemaWithSections(queryParams, function (response) {
                    indicatorsSchemaWithSections = response
                    done();
                });

                expect(indicatorsSchemaWithSections).to.be.an("array");
                expect(indicatorsSchemaWithSections[0][0].section_key).to.equal("first_test_section");
                expect(indicatorsSchemaWithSections[0][0].indicator_key).to.be.an("object");
                expect(indicatorsSchemaWithSections[0][0].indicator_key.name).to.equal("test2_scheduled");
                expect(indicatorsSchemaWithSections[0][0].indicator_key.expression).to.equal("expression2");
                expect(indicatorsSchemaWithSections[1]).to.equal("first_test_section");
            });
    });

    describe('Testing singleReportToSql function', function () {
        var stub;
        beforeEach(function (done) {
            stub = sinon.stub(reportFactory, 'singleReportToSql');
            stub.restore();
            done();
        });

        afterEach(function () {
            stub.restore();
        });
        it('should create the right single Report Sql object when singleReportToSql  is called',
            function (done) {
                stub.yields({ whereClause: " and (input_expression1)", resource: "etl.test_flat_hiv_summary" });
                var requestParams = { reportIndicator: 'indicator1,indicator2', reportName: 'test-report-01', groupBy: 'groupByw,locations' }
                var reportName = 'test-report-01';
                var singleReport = reportFactory.singleReportToSql(requestParams, reportName);
                expect(singleReport).to.be.an("array");
                expect(singleReport[0].columns).to.be.an("array");
                expect(singleReport[0].columns[0]).to.equal("t1.encounter_id as encounter_id");
                expect(singleReport[0].columns[1]).to.equal("date(rtc_date) as d");
                expect(singleReport[0].table).to.equal("etl.test_flat_hiv_summary");
                done();
            });
    });


    describe('Testing resolveIndicators function', function () {
        var stub;
        beforeEach(function (done) {
            stub = sinon.stub(reportFactory, 'resolveIndicators');
            stub.restore();
            done();
        });

        afterEach(function () {
            stub.restore();
        });

        it('should  resolve indicators object when resolveIndicators  is called',
            function (done) {
                var reportName = 'test-report-01';
                var reportIndicatorHandlers = mockData.getReportProcessorMock();
                reportFactory.setIndicatorHandlers(reportIndicatorHandlers);
                var resolvedIndicators = reportFactory.resolveIndicators(reportName, { result: 'test result' });
                expect(resolvedIndicators).to.be.an("object");
                expect(resolvedIndicators.result).to.equal("test result");
                expect(resolvedIndicators.testindicators).to.be.an("array");
                expect(resolvedIndicators.testindicators[0]).to.equal("indicator1");
                expect(resolvedIndicators.testindicators[1]).to.equal("indicator2");
                done();

            });
    });

});

  
