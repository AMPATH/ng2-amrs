import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DqaReportsComponent } from './dqa-reports.component';

describe('DqaReportsComponent', () => {
  let component: DqaReportsComponent;
  let fixture: ComponentFixture<DqaReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DqaReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DqaReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
