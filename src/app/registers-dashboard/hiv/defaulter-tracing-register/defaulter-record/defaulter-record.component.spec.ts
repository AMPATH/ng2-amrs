import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaulterRecordComponent } from './defaulter-record.component';

describe('DefaulterRecordComponent', () => {
  let component: DefaulterRecordComponent;
  let fixture: ComponentFixture<DefaulterRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaulterRecordComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaulterRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
