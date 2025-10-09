import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAppointmentSummaryComponent } from './pre-appointment-summary.component';
import { NgModule } from '@angular/core';

describe('PreAppointmentSummaryComponent', () => {
  let component: PreAppointmentSummaryComponent;
  let fixture: ComponentFixture<PreAppointmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreAppointmentSummaryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreAppointmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
