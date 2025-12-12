import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Report731Component } from './report731.component';

describe('Report731Component', () => {
  let component: Report731Component;
  let fixture: ComponentFixture<Report731Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Report731Component]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Report731Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
