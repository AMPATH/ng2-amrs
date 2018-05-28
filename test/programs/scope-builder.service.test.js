var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
//var nock = require('nock');
//var _ = require('underscore');
//var Hapi = require('hapi');
//var fakeServer = require('../sinon-server-1.17.3');
var scopeBuilder = require('../../programs/scope-builder.service');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

var baseUrl = 'http://localhost:8002';
chai.use(sinonChai);

describe('SCOPE BUILDER SERVICE:', function () {

    beforeEach(function (done) {
        done();
    });

    afterEach(function () {
    });

    it('should load scope builder service',
        function () {
            expect(scopeBuilder).to.be.defined;
        });

    it('should build a scope object',
        function () {

            var dataDictionary = {
                'patient' : {
                    'person' : {
                        age: 20,
                      gender: 'F'
                    }
                },
                'intendedVisitLocationUuid' : 'location-uuid',
                'enrollment': {
                    'uuid': 'some uuid',
                    'program': {
                        'uuid':'some program'
                    },
                    'location': {
                        'uuid': 'some location uuid'
                    }
                }
            };

            var expectedScopeObject = {
                age: 20,
              gender: 'F',
                intendedVisitLocationUuid: 'location-uuid',
                programLocation: 'some location uuid'
            };

            var actualScope = scopeBuilder.buildScope(dataDictionary);

            expect(expectedScopeObject).to.deep.equal(actualScope);

        });

});