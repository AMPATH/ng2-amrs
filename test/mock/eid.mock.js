(function () {
  'use strict';

  module.exports = {
    getDnaPcrMockPayload: getDnaPcrMockPayload,
    getMockResponse: getMockResponse
  };

  function getDnaPcrMockPayload() {
    return {
      type: 'DNAPCR',
      locationUuid: '0900b866-1352-11df-a1f1-0026b9348838',
      orderNumber: 'ORD-1',
      providerIdentifier: 'provi8der id',
      patientName: 'Jtason',
      patientIdentifier: 't45455/34/34g',
      sex: 'm',
      birthDate: '2015-02-04',
      infantProphylaxisUuid: 'a8967656-1350-11df-a1f1-0026b9348838',
      pmtctInterventionUuid: 'mothe pmtct regi uuid',
      feedingTypeUuid: 'infant deeding type uuid',
      entryPointUuid: '3e5ad07b-2ced-4925-8264-cc4d8d1438d4',
      motherHivStatusUuid: 'a896f3a6-1350-11df-a1f1-0026b9348838',
      dateDrawn: '2016-07-14',
      dateReceived: '2016-07-14'
    };
  }

  function getMockResponse() {
    return {
      mflCode: '15204',
      mrsLocation: 84,
      mrsOrderNumber: 'ORD-1',
      providerIdentifier: 'provi8der id',
      patientName: 'Jtason',
      patientId: 't45455/34/34g',
      sex: 'm',
      birthdate: '2015-02-04',
      dateDrawn: '2016-07-14',
      dateReceived: '2016-07-14',
      receivedStatus: 1,
      infantProphylaxis: 1,
      pmtctIntervention: 0,
      feedingType: 0,
      entryPoint: 2,
      motherHivStatus: 2,
      numberOfSpots: 1
    };
  }
})();
