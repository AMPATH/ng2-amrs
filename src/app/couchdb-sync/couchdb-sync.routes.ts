import { Routes } from '@angular/router';
import { CouchdbSyncComponent } from './couchdb-sync.component';

export const COUCHDB_ROUTES: Routes = [
  {
    path: 'app/sync',
    component: CouchdbSyncComponent
  }
];
