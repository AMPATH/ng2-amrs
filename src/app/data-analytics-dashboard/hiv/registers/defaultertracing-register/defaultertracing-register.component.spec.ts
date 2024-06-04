import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultertracingRegisterComponent } from './defaultertracing-register.component';

describe('DefaultertracingRegisterComponent', () => {
  let component: DefaultertracingRegisterComponent;
  let fixture: ComponentFixture<DefaultertracingRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultertracingRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultertracingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
