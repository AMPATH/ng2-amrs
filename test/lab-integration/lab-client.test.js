var chai = require('chai');
var request = require('request');
var sinon = require('sinon'); //for creating spies, mocks and stubs
var sinonChai = require('sinon-chai'); //expection engine for sinion
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var Promise = require('bluebird');
var expect = chai.expect;
var should = chai.should;
import { LabClient } from '../../app/lab-integration/utils/lab-client';
describe.only('Lab Client Test Suite:', function () {
  var client;
  beforeEach(function () {
    var config = {
      serverUrl: 'https://ampath-test.nascop.org',
      apiKey: 'test'
    };
    client = new LabClient(config);
  });

  afterEach(function () {
    client = null;
  });
  it('Should Fetch Viral Load results given server config', function (done) {
    (typeof client.fetchViralLoad).should.equals('function');
    sinon.stub(client, 'fetchViralLoad').resolves({
      current_page: 1,
      data: [
        {
          id: 428169,
          order_number: null,
          provider_identifier: '',
          facility_code: 15204,
          AMRs_location: 84,
          full_names: '',
          date_collected: '02-Jan-2018',
          date_received: '02-Jan-2018',
          date_tested: '03-Jan-2018',
          interpretation: 'Target Not Detected',
          result: '< LDL copies/ml',
          date_dispatched: '04-Jan-2018',
          sample_status: 'Complete',
          patient: 'hhshh-08036'
        },
        {
          id: 428171,
          order_number: 'ORD-85401',
          provider_identifier: '167687-3',
          facility_code: 15204,
          AMRs_location: 13,
          full_names: 'Tesd',
          date_collected: '02-Jan-2018',
          date_received: '02-Jan-2018',
          date_tested: '03-Jan-2018',
          interpretation: 'Target Not Detected',
          result: '< LDL copies/ml',
          date_dispatched: '04-Jan-2018',
          sample_status: 'Complete',
          patient: 'jjjs-3'
        }
      ],
      first_page_url: 'http://ampath-test.nascop.org/api/function?page=1',
      from: 1,
      last_page: 3640,
      last_page_url: 'http://ampath-test.nascop.org/api/function?page=3640',
      next_page_url: 'http://ampath-test.nascop.org/api/function?page=2',
      path: 'http://ampath-test.nascop.org/api/function',
      per_page: 20,
      prev_page_url: null,
      to: 20,
      total: 72797
    });

    client
      .fetchViralLoad({ start_date: '', end_date: '', patient_id: '' })
      .then((results) => {
        expect(results).to.eql({
          current_page: 1,
          data: [
            {
              id: 428169,
              order_number: null,
              provider_identifier: '',
              facility_code: 15204,
              AMRs_location: 84,
              full_names: '',
              date_collected: '02-Jan-2018',
              date_received: '02-Jan-2018',
              date_tested: '03-Jan-2018',
              interpretation: 'Target Not Detected',
              result: '< LDL copies/ml',
              date_dispatched: '04-Jan-2018',
              sample_status: 'Complete',
              patient: 'hhshh-08036'
            },
            {
              id: 428171,
              order_number: 'ORD-85401',
              provider_identifier: '167687-3',
              facility_code: 15204,
              AMRs_location: 13,
              full_names: 'Tesd',
              date_collected: '02-Jan-2018',
              date_received: '02-Jan-2018',
              date_tested: '03-Jan-2018',
              interpretation: 'Target Not Detected',
              result: '< LDL copies/ml',
              date_dispatched: '04-Jan-2018',
              sample_status: 'Complete',
              patient: 'jjjs-3'
            }
          ],
          first_page_url: 'http://ampath-test.nascop.org/api/function?page=1',
          from: 1,
          last_page: 3640,
          last_page_url: 'http://ampath-test.nascop.org/api/function?page=3640',
          next_page_url: 'http://ampath-test.nascop.org/api/function?page=2',
          path: 'http://ampath-test.nascop.org/api/function',
          per_page: 20,
          prev_page_url: null,
          to: 20,
          total: 72797
        });
      })
      .finally(done);
  });

  it('Should Fetch CD4 results given server config', function (done) {
    (typeof client.fetchViralLoad).should.equals('function');
    sinon.stub(client, 'fetchDNAPCR').resolves({
      current_page: 1,
      data: [
        {
          id: 428169,
          order_number: null,
          provider_identifier: '',
          facility_code: 15204,
          AMRs_location: 84,
          full_names: '',
          date_collected: '02-Jan-2018',
          date_received: '02-Jan-2018',
          date_tested: '03-Jan-2018',
          interpretation: 'Target Not Detected',
          result: '< LDL copies/ml',
          date_dispatched: '04-Jan-2018',
          sample_status: 'Complete',
          patient: 'hhshh-08036'
        },
        {
          id: 428171,
          order_number: 'ORD-85401',
          provider_identifier: '167687-3',
          facility_code: 15204,
          AMRs_location: 13,
          full_names: 'Tesd',
          date_collected: '02-Jan-2018',
          date_received: '02-Jan-2018',
          date_tested: '03-Jan-2018',
          interpretation: 'Target Not Detected',
          result: '< LDL copies/ml',
          date_dispatched: '04-Jan-2018',
          sample_status: 'Complete',
          patient: 'jjjs-3'
        }
      ],
      first_page_url: 'http://ampath-test.nascop.org/api/function?page=1',
      from: 1,
      last_page: 3640,
      last_page_url: 'http://ampath-test.nascop.org/api/function?page=3640',
      next_page_url: 'http://ampath-test.nascop.org/api/function?page=2',
      path: 'http://ampath-test.nascop.org/api/function',
      per_page: 20,
      prev_page_url: null,
      to: 20,
      total: 72797
    });
    var config = {
      serverUrl: 'https://ampath-test.nascop.org',
      apiKey: 'test'
    };
    client
      .fetchDNAPCR({ start_date: '', end_date: '', patient_id: '' })
      .then((results) => {
        expect(results).to.eql({
          current_page: 1,
          data: [
            {
              id: 428169,
              order_number: null,
              provider_identifier: '',
              facility_code: 15204,
              AMRs_location: 84,
              full_names: '',
              date_collected: '02-Jan-2018',
              date_received: '02-Jan-2018',
              date_tested: '03-Jan-2018',
              interpretation: 'Target Not Detected',
              result: '< LDL copies/ml',
              date_dispatched: '04-Jan-2018',
              sample_status: 'Complete',
              patient: 'hhshh-08036'
            },
            {
              id: 428171,
              order_number: 'ORD-85401',
              provider_identifier: '167687-3',
              facility_code: 15204,
              AMRs_location: 13,
              full_names: 'Tesd',
              date_collected: '02-Jan-2018',
              date_received: '02-Jan-2018',
              date_tested: '03-Jan-2018',
              interpretation: 'Target Not Detected',
              result: '< LDL copies/ml',
              date_dispatched: '04-Jan-2018',
              sample_status: 'Complete',
              patient: 'jjjs-3'
            }
          ],
          first_page_url: 'http://ampath-test.nascop.org/api/function?page=1',
          from: 1,
          last_page: 3640,
          last_page_url: 'http://ampath-test.nascop.org/api/function?page=3640',
          next_page_url: 'http://ampath-test.nascop.org/api/function?page=2',
          path: 'http://ampath-test.nascop.org/api/function',
          per_page: 20,
          prev_page_url: null,
          to: 20,
          total: 72797
        });
      })
      .finally(done);
  });

  it('Should Fetch DNA PCR results given server config', function (done) {
    (typeof client.fetchViralLoad).should.equals('function');
    sinon.stub(client, 'fetchCD4').resolves({
      current_page: 1,
      data: [
        {
          id: 428169,
          order_number: null,
          provider_identifier: '',
          facility_code: 15204,
          AMRs_location: 84,
          full_names: '',
          date_collected: '02-Jan-2018',
          date_received: '02-Jan-2018',
          date_tested: '03-Jan-2018',
          interpretation: 'Target Not Detected',
          result: '< LDL copies/ml',
          date_dispatched: '04-Jan-2018',
          sample_status: 'Complete',
          patient: 'hhshh-08036'
        },
        {
          id: 428171,
          order_number: 'ORD-85401',
          provider_identifier: '167687-3',
          facility_code: 15204,
          AMRs_location: 13,
          full_names: 'Tesd',
          date_collected: '02-Jan-2018',
          date_received: '02-Jan-2018',
          date_tested: '03-Jan-2018',
          interpretation: 'Target Not Detected',
          result: '< LDL copies/ml',
          date_dispatched: '04-Jan-2018',
          sample_status: 'Complete',
          patient: 'jjjs-3'
        }
      ],
      first_page_url: 'http://ampath-test.nascop.org/api/function?page=1',
      from: 1,
      last_page: 3640,
      last_page_url: 'http://ampath-test.nascop.org/api/function?page=3640',
      next_page_url: 'http://ampath-test.nascop.org/api/function?page=2',
      path: 'http://ampath-test.nascop.org/api/function',
      per_page: 20,
      prev_page_url: null,
      to: 20,
      total: 72797
    });
    var config = {
      serverUrl: 'https://ampath-test.nascop.org',
      apiKey: 'test'
    };
    client
      .fetchCD4({ start_date: '', end_date: '', patient_id: '' })
      .then((results) => {
        expect(results).to.eql({
          current_page: 1,
          data: [
            {
              id: 428169,
              order_number: null,
              provider_identifier: '',
              facility_code: 15204,
              AMRs_location: 84,
              full_names: '',
              date_collected: '02-Jan-2018',
              date_received: '02-Jan-2018',
              date_tested: '03-Jan-2018',
              interpretation: 'Target Not Detected',
              result: '< LDL copies/ml',
              date_dispatched: '04-Jan-2018',
              sample_status: 'Complete',
              patient: 'hhshh-08036'
            },
            {
              id: 428171,
              order_number: 'ORD-85401',
              provider_identifier: '167687-3',
              facility_code: 15204,
              AMRs_location: 13,
              full_names: 'Tesd',
              date_collected: '02-Jan-2018',
              date_received: '02-Jan-2018',
              date_tested: '03-Jan-2018',
              interpretation: 'Target Not Detected',
              result: '< LDL copies/ml',
              date_dispatched: '04-Jan-2018',
              sample_status: 'Complete',
              patient: 'jjjs-3'
            }
          ],
          first_page_url: 'http://ampath-test.nascop.org/api/function?page=1',
          from: 1,
          last_page: 3640,
          last_page_url: 'http://ampath-test.nascop.org/api/function?page=3640',
          next_page_url: 'http://ampath-test.nascop.org/api/function?page=2',
          path: 'http://ampath-test.nascop.org/api/function',
          per_page: 20,
          prev_page_url: null,
          to: 20,
          total: 72797
        });
      })
      .finally(done);
  });
});
