/* tslint:disable:no-unused-variable */


import { Vital } from './vital.model';



describe('Model: Vital', () => {

  let existingVital: any = {
    'uuid': 'uuid',
    'display': 'display',
    'diastolic': 101,
    'systolic': 19, 'pulse': 29,
    'temperature': 43, 'oxygenSaturation': 32,
    'height': 154, 'weight': 123, 'bmi': 51.9
  };

  it('should wrap openmrs Vital for display correctly', () => {
    let wrappedVital: Vital = new Vital(existingVital);
    expect(wrappedVital.uuid).toEqual(existingVital.uuid);
    expect(wrappedVital.display).toEqual(existingVital.display);
    expect(wrappedVital.diastolic).toEqual(existingVital.diastolic);
    expect(wrappedVital.systolic).toEqual(existingVital.systolic);
    expect(wrappedVital.pulse).toEqual(existingVital.pulse);
    expect(wrappedVital.temperature).toEqual(existingVital.temperature);
    expect(wrappedVital.oxygenSaturation).toEqual(existingVital.oxygenSaturation);
    expect(wrappedVital.height).toEqual(existingVital.height);
    expect(wrappedVital.weight).toEqual(existingVital.weight);
    expect(wrappedVital.bmi).toEqual(existingVital.bmi);

  });

});




