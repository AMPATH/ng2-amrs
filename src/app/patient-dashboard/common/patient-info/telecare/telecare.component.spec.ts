import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelecareComponent } from './telecare.component';

describe('TelecareComponent', () => {
  let component: TelecareComponent;
  let fixture: ComponentFixture<TelecareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelecareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
