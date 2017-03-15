/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { GenericListComponent } from './generic-list.component';

describe('Component: GenericList', () => {

  it('should create an instance', () => {
    let component = new GenericListComponent();
    expect(component).toBeTruthy();
  });

  it('should have required variables', () => {
    let component = new GenericListComponent();
      expect(component.gridOptions).toBeUndefined();
      expect(component.columns).toBeUndefined();
      expect(component.data).toBeTruthy();
    });
});
