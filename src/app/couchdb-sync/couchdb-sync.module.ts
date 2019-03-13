import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouchdbSyncComponent } from './couchdb-sync.component';
import { CouchdbSyncService } from './couchdb-sync.service';
import { RouterModule } from '@angular/router';
import { COUCHDB_ROUTES } from './couchdb-sync.routes';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';

@NgModule({
    declarations: [
        CouchdbSyncComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(COUCHDB_ROUTES),
        NgamrsSharedModule
    ],
    exports: [
        RouterModule
    ],
    providers: [
        CouchdbSyncService
    ],
})
export class CouchdbSyncModule {}
