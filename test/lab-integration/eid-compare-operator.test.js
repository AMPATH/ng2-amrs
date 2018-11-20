import { EidCompareOperator } from '../../app/lab-integration/utils/eid-compare-operator';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.config.includeStack = true;
global.expect = chai.expect;
global.should = chai.should;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

chai.use(sinonChai);

describe('EID Obs Compare Operator Unit Tests', () => {

    const eidCompareOperator = new EidCompareOperator();

    beforeEach(function (done) {
        done();
    });

    it('should load EID Obs operator', () => {
        expect(eidCompareOperator).to.be.defined;
    });

    it('should check is a given eid result exists in an array of obsResults when findEquivalentObject is called', () => {
        var obsResults = [
            {
                uuid: 'uuid10',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-29',
                concept: { uuid: 'uuid10' },
                value: 0
            },
            {
                uuid: 'uuid20',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-04-27',
                concept: { uuid: 'uuid10' },
                value: 0
            },
            {
                uuid: 'uuid15',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-26T00:00:00+03:00',
                concept: { uuid: 'uuid1' },
                value: 0
            },
            {
                uuid: 'uuid13',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-26T00:00:00+03:00',
                concept: { uuid: 'uuid13' },
                value: {
                    uuid: 'uuid14'
                }
            }
        ];

        var eidResult = {
            concept: 'uuid13',
            value: 'uuid14',
            obsDatetime: '2016-05-26T00:00:00+03:00',
            comment: 'test1'
        };

        var foundObs = eidCompareOperator.findEquivalentObject(eidResult, obsResults);

        expect(foundObs).to.be.true;

    });

    it('should load missing eid results when getMissingResults is called', () => {

        var eidResults = [
            {
                concept: 'uuid1',
                value: 0,
                obsDatetime: '2018-11-15',
                comment: 'test1'
            },
            {
                concept: 'uuid2',
                value: 13,
                obsDatetime: '2018-11-15',
                comment: 'test2'
            },
            {
                concept: 'uuid11',
                value: 15,
                obsDatetime: '2016-05-28',
                comment: 'test3'
            },
            {
                concept: 'uuid12',
                value: 20,
                obsDatetime: '2016-05-29',
                comment: 'test4'
            }
        ];

        var obsResults = [
            {
                uuid: 'uuid10',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-27',
                concept: { uuid: 'uuid10' },
                value: 0
            },
            {
                uuid: 'uuid11',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-28',
                concept: { uuid: 'uuid11' },
                value: 15
            },
            {
                uuid: 'uuid12',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-29',
                concept: { uuid: 'uuid12' },
                value: 20
            }
        ];

        var missingResults = eidCompareOperator.getMissingResults(eidResults, obsResults);
        expect(missingResults.length).to.equal(2);

    });

    it('should load conflicting eid results when getConflictingResults is called', () => {

        var eidResults = [
            {
                concept: 'uuid1',
                value: 0,
                obsDatetime: '2018-11-15',
                comment: 'test1'
            },
            {
                concept: 'uuid2',
                value: 13,
                obsDatetime: '2018-11-15',
                comment: 'test2'
            },
            {
                concept: 'uuid11',
                value: '15',
                obsDatetime: '2016-05-28',
                comment: 'test3'
            },
            {
                concept: 'uuid12',
                value: 20,
                obsDatetime: '2016-05-29',
                comment: 'test4'
            },
            {
                concept: 'uuid13',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-29',
                value: 'uuid13'
            }
        ];

        var obsResults = [
            {
                uuid: 'uuid10',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-27',
                concept: { uuid: 'uuid10' },
                value: 0
            },
            {
                uuid: 'uuid11',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-28',
                concept: { uuid: 'uuid11' },
                value: 15
            },
            {
                uuid: 'uuid12',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-29',
                concept: { uuid: 'uuid12' },
                value: 20
            },
            {
                uuid: 'uuid13',
                person: { uuid: 'c6e4e026-3b49-4b64-81de-05cf8bd18594' },
                obsDatetime: '2016-05-29',
                concept: { uuid: 'uuid13' },
                value: {
                    uuid: 'uuid13'
                }
            }
        ];

        var missingResults = eidCompareOperator.getConflictingResults(eidResults, obsResults);
        expect(missingResults.length).to.equal(3);

    });

});