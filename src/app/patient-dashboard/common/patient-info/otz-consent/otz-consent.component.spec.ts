import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtzConsentComponent } from './otz-consent.component';

describe('OtzConsentComponent', () => {
  let component: OtzConsentComponent;
  let fixture: ComponentFixture<OtzConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtzConsentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtzConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
