var chai = require('chai');
var routes = require('../etl-routes');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var mockData = require('./mock/mock-data');
var _ = require('underscore');
var Hapi = require('hapi');
var fakeServer = require('./sinon-server-1.17.3');
var queryParams = { reportName: 'test-report-01' };
var reports = mockData.getReportMock();

var reportFactory = require('../etl-factory');
chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

chai.use(sinonChai);

describe('ETL-SERVER TESTS REPORT FACTORY TESTS', function () {});
