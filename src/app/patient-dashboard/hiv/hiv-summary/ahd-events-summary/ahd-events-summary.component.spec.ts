import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhdEventsSummaryComponent } from './ahd-events-summary.component';

describe('AhdEventsSummaryComponent', () => {
  let component: AhdEventsSummaryComponent;
  let fixture: ComponentFixture<AhdEventsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AhdEventsSummaryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhdEventsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
