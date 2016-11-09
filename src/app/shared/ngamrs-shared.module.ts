import { NgModule } from '@angular/core';

import { BusyModule, BusyConfig } from 'angular2-busy';
import { LaddaModule } from 'angular2-ladda';
import { CommonModule } from '@angular/common';

// Added
import { DisplayErrorComponent } from './display-error/display-error.component';

@NgModule({
    imports: [
        BusyModule.forRoot(
            new BusyConfig({
                message: 'Please Wait...',
                backdrop: true,
                delay: 200,
                minDuration: 600,
                wrapperClass: 'my-class',

            })
        ),
      LaddaModule.forRoot({
        style: 'expand-right',
        spinnerSize: 20,
        spinnerColor: 'white',
        spinnerLines: 12
      }),
        CommonModule
    ],
    exports: [BusyModule, LaddaModule, DisplayErrorComponent],
    declarations: [
        DisplayErrorComponent
    ],
    providers: [],
})
export class NgamrsSharedModule { }
