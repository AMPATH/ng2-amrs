/* tslint:disable:no-unused-variable */

import { PreAppointmentPatientListComponent } from './pre-appointment-patient-list.component';

describe('Component: PreAppointmentPatientList', () => {
  it('should create an instance', () => {
    const component = new PreAppointmentPatientListComponent();
    expect(component).toBeTruthy();
  });

  it('should have required variables', () => {
    const component = new PreAppointmentPatientListComponent();
    expect(component.gridOptions).toBeUndefined();
    expect(component.columns).toBeUndefined();
    expect(component.data).toBeTruthy();
  });
});
