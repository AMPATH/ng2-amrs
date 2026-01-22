import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntdailyRegisterComponent } from './cntdaily-register.component';

describe('CntdailyRegisterComponent', () => {
  let component: CntdailyRegisterComponent;
  let fixture: ComponentFixture<CntdailyRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CntdailyRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntdailyRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
