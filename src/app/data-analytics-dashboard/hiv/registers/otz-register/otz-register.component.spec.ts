import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtzRegisterComponent } from './otz-register.component';

describe('OtzRegisterComponent', () => {
  let component: OtzRegisterComponent;
  let fixture: ComponentFixture<OtzRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtzRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtzRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
