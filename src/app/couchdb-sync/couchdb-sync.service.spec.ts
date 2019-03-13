import { TestBed, inject } from '@angular/core/testing';

import { CouchdbSyncService } from './couchdb-sync.service';

describe('CouchdbSyncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CouchdbSyncService]
    });
  });

  it('should be created', inject([CouchdbSyncService], (service: CouchdbSyncService) => {
    expect(service).toBeTruthy();
  }));
});
