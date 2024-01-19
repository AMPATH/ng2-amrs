import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtzSnapshotComponent } from './otz-snapshot.component';

describe('OtzSnapshotComponent', () => {
  let component: OtzSnapshotComponent;
  let fixture: ComponentFixture<OtzSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtzSnapshotComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtzSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
