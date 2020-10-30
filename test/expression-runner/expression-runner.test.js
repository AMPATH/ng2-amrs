var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
//var nock = require('nock');
//var _ = require('underscore');
//var Hapi = require('hapi');
//var fakeServer = require('../sinon-server-1.17.3');
var expressionRunner = require('../../expression-runner/expression-runner');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('EXPRESSION RUNNER:', function () {
  beforeEach(function (done) {
    done();
  });

  afterEach(function () {});

  it('should load expression runner module', function () {
    expect(expressionRunner).to.be.defined;
  });

  it('should run an expession given a scope and an expression', function () {
    var scope = {
      programLocationUuid: 'some uuid',
      intentedVisitUuid: 'some other uuid',
      age: 8,
      sum: function (a, b) {
        return a + b;
      }
    };

    var expression = "programLocationUuid === 'some uuid' && age > 7";
    var expression2 = 'programLocationUuid === intentedVisitUuid';
    var expression3 =
      'programLocationUuid !== intentedVisitUuid && sum(1,2) === 3';

    expect(expressionRunner.run(expression, scope)).to.be.true;
    expect(expressionRunner.run(expression2, scope)).to.be.false;
    expect(expressionRunner.run(expression3, scope)).to.be.true;
  });
});
