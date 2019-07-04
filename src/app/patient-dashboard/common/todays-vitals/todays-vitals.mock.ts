import { Patient } from '../../../models/patient.model';

export const testVitals1 = [
  {
    color: '',
    compoundValue: {
      color: 'red',
      compoundValue: null,
      isCompoundedWith: 'systolic',
      label: 'Diastolic',
      name: 'diastolic',
      order: 100,
      show: true,
      value: 50
    },
    isCompoundedWith: null,
    label: 'BP:',
    name: 'systolic',
    order: 1,
    show: true,
    value: 123
  },
  {
    color: '',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Pulse:',
    name: 'pulse',
    order: 2,
    show: true,
    value: 55
  },
  {
    color: 'red',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Temperature:',
    name: 'temperature',
    order: 3,
    show: true,
    value: 30
  },
  {
    color: undefined,
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Height:',
    name: 'height:',
    order: 4,
    show: true,
    value: 170
  },
  {
    color: undefined,
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Weight:',
    name: 'weight:',
    order: 5,
    show: true,
    value: 73
  },
  {
    color: '',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'BMI (Kg/M2)',
    name: 'bmi',
    order: 6,
    show: true,
    value: 25.3
  }
];

export const testVitals2 = [
  {
    color: '',
    compoundValue: {
      color: '',
      compoundValue: null,
      isCompoundedWith: 'systolic',
      label: 'Diastolic',
      name: 'diastolic',
      order: 100,
      show: true,
      value: 60
    },
    isCompoundedWith: null,
    label: 'BP:',
    name: 'systolic',
    order: 1,
    show: true,
    value: 120
  },
  {
    color: '',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Pulse:',
    name: 'pulse',
    order: 2,
    show: true,
    value: 41
  },
  {
    color: 'red',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Oxygen Saturation:',
    name: 'oxygenSaturation',
    order: 3,
    show: true,
    value: 5
  },
  {
    color: 'red',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Temperature:',
    name: 'temperature',
    order: 3,
    show: true,
    value: 35
  },
  {
    color: '',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Height:',
    name: 'height',
    order: 4,
    show: true,
    value: 173
  },
  {
    color: undefined,
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Weight:',
    name: 'weight',
    order: 5,
    show: true,
    value: 76
  },
  {
    color: '',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'BMI(Kg/M2):',
    name: 'bmi',
    order: 6,
    show: false,
    value: '25.4'
  },
  {
    color: '',
    compoundValue: null,
    isCompoundedWith: 'systolic',
    label: 'Diastolic',
    name: 'diastolic',
    order: 100,
    show: true,
    value: 60
  },
  {
    color: 'red',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Weight for Height:',
    name: 'weightForHeight',
    order: 100,
    show: false,
    value: -4
  },
  {
    color: '',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'Height for Age:',
    name: 'heightForAge',
    order: 100,
    show: false,
    value: '0'
  },
  {
    color: 'red',
    compoundValue: null,
    isCompoundedWith: null,
    label: 'BMI For Age:',
    name: 'bmiForAge',
    order: 100,
    show: true,
    value: '1'
  }
];

export const testPatient1 = new Patient({
  allIdentifiers: '297400783-9',
  commonIdentifiers: {
    ampathMrsUId: '297400783-9',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '297400783-9 - Test Anticoagulation Treatment',
  encounters: [
    {
      encounterDatetime: new Date(),
      encounterType: {
        display: 'ANTICOAGULATION TRIAGE',
        uuid: '6accd920-6254-4063-bfd1-0e1b70b3f201'
      },
      form: {
        name: 'ONCOLOGY POC Anticoagulation Triage Form',
        uuid: '84539fd3-842c-46a7-a595-fc64919badd6'
      },
      location: {
        display: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
      },
      patient: {
        uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763'
      }
    }
  ]
});

export const testPatient2 = new Patient({
  allIdentifiers: '0000000-0,56665-88884',
  commonIdentifiers: {
    ampathMrsUId: '0000000-0',
    amrsMrn: '',
    cCC: '56665-88884',
    kenyaNationalId: ''
  },
  display: '0000000-0 - Test kaka Test',
  encounters: [
    {
      encounterDatetime: new Date(),
      encounterType: {
        display: 'HIV TRIAGE',
        uuid: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7'
      },
      form: {
        name: 'AMPATH POC Triage Encounter Form v1.2',
        uuid: '0c2088e2-bf82-4ea8-b5f4-1a02de6976ca'
      },
      location: {
        display: 'MTRH Other',
        uuid: '2a901f42-bf51-428c-8be3-a135075abcb2'
      },
      patient: {
        uuid: 'ce1b2ab4-6cb6-4483-a96d-d4b26ef54f0e'
      }
    }
  ]
});
