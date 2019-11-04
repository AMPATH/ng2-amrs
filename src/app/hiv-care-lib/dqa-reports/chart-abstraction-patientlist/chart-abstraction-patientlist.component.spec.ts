import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAbstractionPatientlistComponent } from './chart-abstraction-patientlist.component';

describe('ChartAbstractionPatientlistComponent', () => {
  let component: ChartAbstractionPatientlistComponent;
  let fixture: ComponentFixture<ChartAbstractionPatientlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartAbstractionPatientlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAbstractionPatientlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
