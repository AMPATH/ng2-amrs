var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
// var _ = require('underscore');
var listCompare = require('../../service/patient-list-compare.service.js');

var expect = chai.expect;
chai.use(sinonChai);

describe('Patient List COMPARE TESTS', function () {

    beforeEach(function (done) {

        done();
    });

    afterEach(function () {

    });

    it('should load eid-obs-compare module',
        function () {
            expect(listCompare).to.be.defined;
        });

    it('should compare 2 patient lists and output the comparison details',
        function () {
            var incomingList = [
                {
                    person_id: 1
                },
                {
                    person_id: 2
                },
                {
                    person_id: 3
                },
                {
                    person_id: 4
                }

            ];

            var pocList = [
                {
                    person_id: 3
                },
                {
                    person_id: 4
                },
                {
                    person_id: 5
                },
                {
                    person_id: 6
                }
            ];

            var expectedSetDifference = {
                both: [
                    {
                        person_id: 3
                    },
                    {
                        person_id: 4
                    }
                ],
                onlyPoc: [
                    {
                        person_id: 5
                    },
                    {
                        person_id: 6
                    }
                ],
                onlyIncoming: [
                    {
                        person_id: 1
                    },
                    {
                        person_id: 2
                    }
                ]
                ,
                summaryStats: {
                    totalPoc : 4,
                    totalIncoming: 4,
                    totalBoth: 2,
                    totalOnlyPoc: 2,
                    totalOnlyIncoming: 2
                }
            };

            var actual = listCompare.fullPatientListComparison(incomingList, pocList);

            expect(actual).to.deep.equal(expectedSetDifference);
        });

});
