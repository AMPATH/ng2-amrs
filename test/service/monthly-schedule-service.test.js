import {
    MonthlyScheduleService
} from '../../service/monthly-schedule-service'
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
        let runReportStub = sinon.stub(dao, 'runReport').returns((reportParams) => {
            return new Promise((resolve, reject) => {
                if (reportParams['reportName'] === 'attended') {
                    resolve({
                        "startIndex": 0,
                        "size": 9,
                        "result": [{
                            "attended_date": "2017-01-31T21:00:00.000Z",
                            "attended": 84
                        }],
                        "sql": "SELECT date(t1.encounter_datetime) as attended_date, count(distinct person_id) as attended FROM etl.flat_hiv_summary `t1` WHERE (t1.encounter_datetime >= ? and t1.encounter_datetime <= ? and t1.location_id in (?)  and encounter_type not in (21,99999) ) GROUP BY attended_date LIMIT 1000000",
                        "sqlParams": ["2017-02-01", "2017-02-28", "1"]
                    });
                }
                if (reportParams['reportName'] === 'scheduled') {

                    resolve({
                        "startIndex": 0,
                        "size": 1,
                        "result": [{
                            "scheduled_date": "2017-02-01",
                            "scheduled": 102
                        }],
                        "sql": "SELECT date_format(t1.rtc_date,'%Y-%m-%d') as scheduled_date, count(distinct t1.person_id) as scheduled, if(next_encounter_type_hiv =21, 1,0) as followed_up_by_outreach, count(distinct if(date(t1.rtc_date) >='2017-02-01' and date(t1.rtc_date)< date(now()) and next_clinical_datetime_hiv is null and death_date is null and transfer_out is null, t1.person_id, null)) as has_not_returned, count(distinct if(date(t1.rtc_date)<>date(next_clinical_datetime_hiv), t1.person_id, null)) as not_attended FROM etl.flat_hiv_summary `t1` WHERE (t1.rtc_date >= ? and t1.rtc_date <= ? and t1.location_id in (?) and coalesce(t1.transfer_out) is null and coalesce(t1.death_date) is null and encounter_type not in (99999) ) GROUP BY scheduled_date LIMIT 1000000",
                        "sqlParams": ["2017-02-01", "2017-02-28", "1"]
                    });
                }
                if (reportParams['reportName'] === 'has-not-returned-report') {

                    resolve({
                        "startIndex": 0,
                        "size": 1,
                        "result": [{
                            "d": "2017-02-01",
                            "has_not_returned": 3
                        }]
                    });
                }
                reject('report name required');
            });
        });
        let expectedData = {
            "results": [{
                "date": "2017-02-01",
                "count": {
                    "attended": 84,
                    "scheduled": 102,
                    "has_not_returned": 3
                }
            }]
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
        done();
    });
});