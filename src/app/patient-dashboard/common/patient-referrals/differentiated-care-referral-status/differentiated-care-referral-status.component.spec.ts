/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DifferentiatedCareReferralStatusComponent } from './differentiated-care-referral-status.component';

describe('DifferentiatedCareReferralStatusComponent', () => {
  let component: DifferentiatedCareReferralStatusComponent;
  let fixture: ComponentFixture<DifferentiatedCareReferralStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifferentiatedCareReferralStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifferentiatedCareReferralStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
