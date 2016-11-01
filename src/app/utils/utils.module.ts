import { NgModule } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { SessionStorageService } from './session-storage.service';

@NgModule({
  providers: [
    LocalStorageService,
    SessionStorageService
   ]
})
export class UtilsModule {}
