import QueryService from '../../app/database-access/query.service';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  chaiAsPromised = require('chai-as-promised'),
  Mysql = require('mysql'),
  sinon = require('sinon'),
  Promise = require('bluebird');

chai.use(chaiAsPromised);

describe('Query Service', function () {
  const queryService = new QueryService();
  let executeQueryStub;
  beforeEach(() => {
    executeQueryStub = sinon.stub(queryService, 'executeQuery').resolves('');
  });
  afterEach(() => {
    queryService.executeQuery.restore();
  });

  it('executeQuery should resolve with a promise', (done) => {
    queryService
      .executeQuery('select * from etl.flat_hiv_summary limit 100')
      .then((result) => {
        expect(result).to.equal('');
      })
      .then(done, done);
  });
});
