import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeiRegisterComponent } from './hei-register.component';

describe('HeiRegisterComponent', () => {
  let component: HeiRegisterComponent;
  let fixture: ComponentFixture<HeiRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeiRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeiRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
