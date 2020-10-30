import { CD4Adapter } from '../../../app/lab-integration/adapters/cd4-adapter';
import { DNAPCRAdapter } from '../../../app/lab-integration/adapters/dnapcr-adpater';
import { VLAdapter } from '../../../app/lab-integration/adapters/vl-adapter';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect;

describe('Lab Adapters Unit Tests', function () {
  const testCD4ArrayResult = [
    {
      id: 14451,
      order_number: null,
      provider_identifier: '167948-9',
      facility_code: 15229,
      AMRs_location: 2,
      full_names: 'Nicholas Kiptarbei Lagat',
      date_collected: '2018-11-16',
      date_received: '2018-11-16',
      date_tested: '',
      interpretation: null,
      result: 0,
      date_dispatched: '',
      sample_status: null,
      THelperSuppressorRatio: null,
      AVGCD3percentLymph: 81.49,
      AVGCD3AbsCnt: 1339.69,
      AVGCD3CD4percentLymph: 26.29,
      AVGCD3CD4AbsCnt: 432.28,
      CD45AbsCnt: 1644.03,
      AVGCD3CD8percentLymph: null,
      AVGCD3CD8AbsCnt: null,
      AVGCD3CD4CD8percentLymph: null,
      AVGCD3CD4CD8AbsCnt: null
    }
  ];
  const testObjectResult = testCD4ArrayResult[0];
  beforeEach(function (done) {
    done();
  });

  afterEach(function () {});

  it('should throw LabAdapterError if result is not array', function (done) {
    (function () {
      new CD4Adapter(testObjectResult, '12345');
    }.should.throw(Error, /Please provide lab results as an array/));
    done();
  });

  it('should ensure that convertViralLoadPayloadToRestConsumableObs receives  the right input and generates the correct payload', function (done) {
    const patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
    const expectedInput = [
      {
        id: 590069,
        order_number: null,
        provider_identifier: null,
        facility_code: 15204,
        AMRs_location: null,
        full_names: null,
        date_collected: '2018-11-19',
        date_received: '2018-11-19',
        date_tested: '2018-11-19',
        interpretation: null,
        result: '450',
        date_dispatched: '2018-11-19',
        sample_status: 'Complete',
        patient: '540000000'
      }
    ];
    var expectedOutput = {
      concept: 'a8982474-1350-11df-a1f1-0026b9348838',
      person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
      obsDatetime: '2018-11-19T00:00:00+03:00',
      value: '450'
    };
    const adapter = new VLAdapter(expectedInput, patientUuId);
    adapter.getLabResults().then((results) => {
      const p = results[0];
      expect(p).to.have.property('concept');
      expect(p).to.have.property('person');
      expect(p).to.have.property('obsDatetime');
      expect(p).to.have.property('value');
      expect(p).deep.equal(expectedOutput);
      done();
    });
  });

  it('should ensure that convertCD4PayloadTORestConsumableObs receives  the right input and generates the correct payload', function (done) {
    const patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
    const expectedOutput = {
      concept: 'a896cce6-1350-11df-a1f1-0026b9348838',
      person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
      obsDatetime: '2018-11-16T00:00:00+03:00',
      groupMembers: [
        {
          concept: 'a89c4220-1350-11df-a1f1-0026b9348838',
          person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
          value: 81.49,
          obsDatetime: '2018-11-16T00:00:00+03:00'
        },
        {
          concept: 'a898fcd2-1350-11df-a1f1-0026b9348838',
          person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
          value: 1339.69,
          obsDatetime: '2018-11-16T00:00:00+03:00'
        },
        {
          concept: 'a8970a26-1350-11df-a1f1-0026b9348838',
          person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
          value: 26.29,
          obsDatetime: '2018-11-16T00:00:00+03:00'
        },
        {
          concept: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
          person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
          value: 432.28,
          obsDatetime: '2018-11-16T00:00:00+03:00'
        },
        {
          concept: 'a89c4914-1350-11df-a1f1-0026b9348838',
          person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
          value: 1644.03,
          obsDatetime: '2018-11-16T00:00:00+03:00'
        }
      ]
    };
    const adapter = new CD4Adapter(testCD4ArrayResult, patientUuId);
    adapter.getLabResults().then((results) => {
      const p = results[0];
      expect(p).to.have.property('concept');
      expect(p).to.have.property('person');
      expect(p).to.have.property('obsDatetime');
      expect(p).to.have.property('groupMembers');
      expect(p.groupMembers).to.be.an('array');
      expect(p).deep.equal(expectedOutput);
      done();
    });
  });

  it('should ensure that convertDNAPCRPayloadTORestConsumableObs receives  the right input and generates the correct payload: negative', function (done) {
    const patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
    const expectedInput = [
      {
        id: 66915,
        order_number: '',
        provider_identifier: '',
        facility_code: 17342,
        AMRs_location: 0,
        full_names: '',
        date_collected: '2018-11-15',
        date_received: '2018-11-15',
        date_tested: '2018-11-15',
        interpretation: null,
        result: 'Negative',
        date_dispatched: '2018-11-15',
        sample_status: 'Complete',
        patient: '17342-2018-0170'
      }
    ];
    const expectedOutput = {
      concept: 'a898fe80-1350-11df-a1f1-0026b9348838',
      person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
      obsDatetime: '2018-11-15T00:00:00+03:00',
      value: 'a896d2cc-1350-11df-a1f1-0026b9348838'
    };
    const adapter = new DNAPCRAdapter(expectedInput, patientUuId);
    adapter.getLabResults().then((results) => {
      const p = results[0];
      expect(p).to.have.property('concept');
      expect(p).to.have.property('person');
      expect(p).to.have.property('obsDatetime');
      expect(p).to.have.property('value');
      expect(p).deep.equal(expectedOutput);
      done();
    });
  });

  it('should ensure that convertDNAPCRPayloadTORestConsumableObs receives  the right input and generates the correct payload: positive', function (done) {
    const patientUuId = 'c6e4e026-3b49-4b64-81de-05cf8bd18594';
    const expectedInput = [
      {
        id: 66915,
        order_number: '',
        provider_identifier: '',
        facility_code: 17342,
        AMRs_location: 0,
        full_names: '',
        date_collected: '2018-11-15',
        date_received: '2018-11-15',
        date_tested: '2018-11-15',
        interpretation: null,
        result: 'Positive',
        date_dispatched: '2018-11-15',
        sample_status: 'Complete',
        patient: '17342-2018-0170'
      }
    ];
    const expectedOutput = {
      concept: 'a898fe80-1350-11df-a1f1-0026b9348838',
      person: 'c6e4e026-3b49-4b64-81de-05cf8bd18594',
      obsDatetime: '2018-11-15T00:00:00+03:00',
      value: 'a896f3a6-1350-11df-a1f1-0026b9348838'
    };
    const adapter = new DNAPCRAdapter(expectedInput, patientUuId);
    adapter.getLabResults().then((results) => {
      const p = results[0];
      expect(p).to.have.property('concept');
      expect(p).to.have.property('person');
      expect(p).to.have.property('obsDatetime');
      expect(p).to.have.property('value');
      expect(p).deep.equal(expectedOutput);
      done();
    });
  });
});
