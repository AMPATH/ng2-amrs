import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouchdbSyncComponent } from './couchdb-sync.component';

describe('CouchdbSyncComponent', () => {
  let component: CouchdbSyncComponent;
  let fixture: ComponentFixture<CouchdbSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouchdbSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouchdbSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
