import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EPrescriptionComponent } from './e-prescription.component';

describe('EPrescriptionComponent', () => {
  let component: EPrescriptionComponent;
  let fixture: ComponentFixture<EPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EPrescriptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
