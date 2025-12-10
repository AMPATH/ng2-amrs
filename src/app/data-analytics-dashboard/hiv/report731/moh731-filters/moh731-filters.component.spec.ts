import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Moh731FiltersComponent } from './moh731-filters.component';

describe('Moh731FiltersComponent', () => {
  let component: Moh731FiltersComponent;
  let fixture: ComponentFixture<Moh731FiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Moh731FiltersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Moh731FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
