import { MonthlyScheduleService } from '../../service/monthly-schedule-service'
let chai = require('chai');
let sinon = require("sinon");
let sinonChai = require("sinon-chai");
let expect = chai.expect;
const dao = require('../../etl-dao');
const Promise = require("bluebird");
chai.use(sinonChai);
describe('Monthly Schedule Service Test Suite', () => {
    let service;
    beforeEach(() => {
        service = new MonthlyScheduleService();
    })
    it('It should be defined', () => {
        expect(service).to.be.ok
    });
    it('Should return a list of actual visits and scheduled visits for a given month', (done) => {
        let runReportStub = sinon.stub(dao, 'runReport', (reportParams) => {
            return new Promise((resolve, reject) => {
                if (reportParams['reportName'] === 'attended') {
                    resolve({ "startIndex": 0, "size": 9, "result": [{ "attended_date": "2017-01-31T21:00:00.000Z", "attended": 84 }, { "attended_date": "2017-02-01T21:00:00.000Z", "attended": 93 }, { "attended_date": "2017-02-02T21:00:00.000Z", "attended": 30 }, { "attended_date": "2017-02-05T21:00:00.000Z", "attended": 61 }, { "attended_date": "2017-02-06T21:00:00.000Z", "attended": 72 }, { "attended_date": "2017-02-07T21:00:00.000Z", "attended": 96 }, { "attended_date": "2017-02-08T21:00:00.000Z", "attended": 82 }, { "attended_date": "2017-02-09T21:00:00.000Z", "attended": 29 }, { "attended_date": "2017-02-12T21:00:00.000Z", "attended": 37 }], "sql": "SELECT date(t1.encounter_datetime) as attended_date, count(distinct person_id) as attended FROM etl.flat_hiv_summary `t1` WHERE (t1.encounter_datetime >= ? and t1.encounter_datetime <= ? and t1.location_id in (?)  and encounter_type not in (21,99999) ) GROUP BY attended_date LIMIT 1000000", "sqlParams": ["2017-02-01", "2017-02-28", "1"] });
                }
                if (reportParams['reportName'] === 'scheduled') {

                    resolve({ "startIndex": 0, "size": 20, "result": [{ "scheduled_date": "2017-02-01", "scheduled": 102, "followed_up_by_outreach": 0, "has_not_returned": 23, "not_attended": 37 }, { "scheduled_date": "2017-02-02", "scheduled": 119, "followed_up_by_outreach": 1, "has_not_returned": 32, "not_attended": 33 }, { "scheduled_date": "2017-02-03", "scheduled": 27, "followed_up_by_outreach": 0, "has_not_returned": 11, "not_attended": 10 }, { "scheduled_date": "2017-02-06", "scheduled": 74, "followed_up_by_outreach": 0, "has_not_returned": 24, "not_attended": 22 }, { "scheduled_date": "2017-02-07", "scheduled": 89, "followed_up_by_outreach": 0, "has_not_returned": 29, "not_attended": 19 }, { "scheduled_date": "2017-02-08", "scheduled": 98, "followed_up_by_outreach": 0, "has_not_returned": 23, "not_attended": 19 }, { "scheduled_date": "2017-02-09", "scheduled": 86, "followed_up_by_outreach": 0, "has_not_returned": 30, "not_attended": 11 }, { "scheduled_date": "2017-02-10", "scheduled": 13, "followed_up_by_outreach": 0, "has_not_returned": 4, "not_attended": 3 }, { "scheduled_date": "2017-02-13", "scheduled": 81, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 12 }, { "scheduled_date": "2017-02-14", "scheduled": 117, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 12 }, { "scheduled_date": "2017-02-15", "scheduled": 109, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 16 }, { "scheduled_date": "2017-02-16", "scheduled": 126, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 18 }, { "scheduled_date": "2017-02-17", "scheduled": 24, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 5 }, { "scheduled_date": "2017-02-20", "scheduled": 65, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 5 }, { "scheduled_date": "2017-02-21", "scheduled": 110, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 12 }, { "scheduled_date": "2017-02-22", "scheduled": 102, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 4 }, { "scheduled_date": "2017-02-23", "scheduled": 107, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 4 }, { "scheduled_date": "2017-02-24", "scheduled": 17, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 1 }, { "scheduled_date": "2017-02-27", "scheduled": 73, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 6 }, { "scheduled_date": "2017-02-28", "scheduled": 111, "followed_up_by_outreach": 0, "has_not_returned": 0, "not_attended": 9 }], "sql": "SELECT date_format(t1.rtc_date,'%Y-%m-%d') as scheduled_date, count(distinct t1.person_id) as scheduled, if(next_encounter_type_hiv =21, 1,0) as followed_up_by_outreach, count(distinct if(date(t1.rtc_date) >='2017-02-01' and date(t1.rtc_date)< date(now()) and next_clinical_datetime_hiv is null and death_date is null and transfer_out is null, t1.person_id, null)) as has_not_returned, count(distinct if(date(t1.rtc_date)<>date(next_clinical_datetime_hiv), t1.person_id, null)) as not_attended FROM etl.flat_hiv_summary `t1` WHERE (t1.rtc_date >= ? and t1.rtc_date <= ? and t1.location_id in (?) and coalesce(t1.transfer_out) is null and coalesce(t1.death_date) is null and encounter_type not in (99999) ) GROUP BY scheduled_date LIMIT 1000000", "sqlParams": ["2017-02-01", "2017-02-28", "1"] });
                }
                reject('report name required');
            });
        });
        let expectedData = {
            "results": [
                {
                    "date": "2017-02-01",
                    "count": {
                        "attended": 84,
                        "scheduled": 102,
                        "not_attended": 37,
                        "has_not_returned": 23
                    }
                },
                {
                    "date": "2017-02-02",
                    "count": {
                        "attended": 93,
                        "scheduled": 119,
                        "not_attended": 33,
                        "has_not_returned": 32
                    }
                },
                {
                    "date": "2017-02-03",
                    "count": {
                        "attended": 30,
                        "scheduled": 27,
                        "not_attended": 10,
                        "has_not_returned": 11
                    }
                },
                {
                    "date": "2017-02-06",
                    "count": {
                        "attended": 61,
                        "scheduled": 74,
                        "not_attended": 22,
                        "has_not_returned": 24
                    }
                },
                {
                    "date": "2017-02-07",
                    "count": {
                        "attended": 72,
                        "scheduled": 89,
                        "not_attended": 19,
                        "has_not_returned": 29
                    }
                },
                {
                    "date": "2017-02-08",
                    "count": {
                        "attended": 96,
                        "scheduled": 98,
                        "not_attended": 19,
                        "has_not_returned": 23
                    }
                },
                {
                    "date": "2017-02-09",
                    "count": {
                        "attended": 82,
                        "scheduled": 86,
                        "not_attended": 11,
                        "has_not_returned": 30
                    }
                },
                {
                    "date": "2017-02-10",
                    "count": {
                        "attended": 29,
                        "scheduled": 13,
                        "not_attended": 3,
                        "has_not_returned": 4
                    }
                },
                {
                    "date": "2017-02-13",
                    "count": {
                        "attended": 35,
                        "scheduled": 81,
                        "not_attended": 12,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-14",
                    "count": {
                        "scheduled": 117,
                        "not_attended": 12,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-15",
                    "count": {
                        "scheduled": 109,
                        "not_attended": 16,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-16",
                    "count": {
                        "scheduled": 126,
                        "not_attended": 18,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-17",
                    "count": {
                        "scheduled": 24,
                        "not_attended": 5,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-20",
                    "count": {
                        "scheduled": 65,
                        "not_attended": 5,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-21",
                    "count": {
                        "scheduled": 110,
                        "not_attended": 12,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-22",
                    "count": {
                        "scheduled": 102,
                        "not_attended": 4,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-23",
                    "count": {
                        "scheduled": 107,
                        "not_attended": 4,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-24",
                    "count": {
                        "scheduled": 17,
                        "not_attended": 1,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-27",
                    "count": {
                        "scheduled": 73,
                        "not_attended": 6,
                        "has_not_returned": 0
                    }
                },
                {
                    "date": "2017-02-28",
                    "count": {
                        "scheduled": 111,
                        "not_attended": 9,
                        "has_not_returned": 0
                    }
                }
            ]
        };
        service.getMonthlyScheduled({})
            .then((result) => {
                expect(runReportStub.called).to.be.true;
                expect(result.results).to.be.ok;
                expect(result.results[0]).to.deep.equal(expectedData.results[0]);
                runReportStub.restore();
                done();
            })
            .catch((error) => {
                console.log(error);
                runReportStub.restore();
                expect(false).to.be.true; // for the test case, no error
                done();
            });
    });
});
