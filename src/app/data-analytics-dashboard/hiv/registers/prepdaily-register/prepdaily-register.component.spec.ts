import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepdailyRegisterComponent } from './prepdaily-register.component';

describe('PrepdailyRegisterComponent', () => {
  let component: PrepdailyRegisterComponent;
  let fixture: ComponentFixture<PrepdailyRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrepdailyRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepdailyRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
