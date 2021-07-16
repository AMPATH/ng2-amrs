/* tslint:disable:no-unused-variable */
import { Vital } from "./vital.model";

describe("Model: Vital", () => {
  const existingVital: any = {
    uuid: "uuid",
    display: "display",
    diastolic: 101,
    systolic: 19,
    pulse: 29,
    temperature: 43,
    oxygenSaturation: 32,
    height: 154,
    weight: 123,
    bmi: 51.9,
  };

  it("should wrap openmrs Vital for display correctly", () => {
    const wrappedVital: Vital = new Vital(existingVital);
    expect(wrappedVital.uuid).toEqual(existingVital.uuid);
    expect(wrappedVital.display).toEqual(existingVital.display);
  });
});
