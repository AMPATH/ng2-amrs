/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ClinicDashboardComponent } from './clinic-dashboard.component';

describe('Component: ClinicDashboard', () => {
  it('should create an instance', () => {
    let component = new ClinicDashboardComponent(null, null, null, null);
    expect(component).toBeTruthy();
  });

  it('should set the currently selected location ', () => {
    let component = new ClinicDashboardComponent(null, null, null, null);
    component.locations = [
      {
        value: 'uuid',
        label: 'label'
      },
      {
        value: 'uuid2',
        label: 'label 2'
      }
    ];

    component.resolveSelectedLocationByUuid('uuid2');

    expect(component.selectedLocation).toBe(component.locations[1]);
  });
});
