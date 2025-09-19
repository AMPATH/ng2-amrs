import { NgModule } from '@angular/core';
import { HieToAmrsPersonSyncComponent } from './hie-amrs-person-sync.component';
import { CommonModule } from '@angular/common';
import { HieAmrsDependantComponent } from './hie-amrs-dependant/hie-amrs-dependant.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule],
  declarations: [HieToAmrsPersonSyncComponent, HieAmrsDependantComponent],
  exports: [HieToAmrsPersonSyncComponent, HieAmrsDependantComponent],
  providers: []
})
export class HieToAmrsPersonSyncModule {}
