import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagingReportsComponent } from './imaging-reports.component';

describe('ImagingReportsComponent', () => {
  let component: ImagingReportsComponent;
  let fixture: ComponentFixture<ImagingReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagingReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
