import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocatorMapDetailsComponent } from './locator-map-details.component';

describe('LocatorMapDetailsComponent', () => {
  let component: LocatorMapDetailsComponent;
  let fixture: ComponentFixture<LocatorMapDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocatorMapDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocatorMapDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
