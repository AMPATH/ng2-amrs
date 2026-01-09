import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pt4aComponent } from './pt4a.component';

describe('Pt4aComponent', () => {
  let component: Pt4aComponent;
  let fixture: ComponentFixture<Pt4aComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Pt4aComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pt4aComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
