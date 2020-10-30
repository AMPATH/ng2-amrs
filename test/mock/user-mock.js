var mocks = {
  getMockedUser: getMockedUser
};

module.exports = mocks;

function getMockedUser() {
  return {
    uuid: 'some-user-uuid',
    display: 'test',
    username: 'test',
    systemId: '4444-4',
    userProperties: {
      loginAttempts: '0'
    },
    person: {
      uuid: 'd6a9190c-f47b-406d-a5e4-155081fc4929',
      display: 'test user'
    },
    privileges: [
      {
        uuid: 'd05118c6-2490-4d78-a41a-390e3596a240',
        display: 'Get Forms'
      },
      {
        uuid: 'd05118c6-2490-4d78-a41a-390e3596a241',
        display: 'Get Orders'
      },
      {
        uuid: '78170500-1359-11df-a1f1-0026b9348838',
        display: 'View Patient Cohorts'
      }
    ],
    roles: [
      {
        uuid: 'ad6ea984-583a-43e9-b9ed-86d74b5658ff',
        display: 'POCProvider'
      },
      {
        uuid: '78d7696c-1359-11df-a1f1-0026b9348838',
        display: 'Data Assistant'
      }
    ],
    retired: false,
    links: [],
    resourceVersion: '1.8'
  };
}
