import { NgModule } from '@angular/core';

import { BusyModule, BusyConfig } from 'angular2-busy';
import { CommonModule } from '@angular/common';

//Added
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
        CommonModule
    ],
    exports: [BusyModule, DisplayErrorComponent],
    declarations: [
        DisplayErrorComponent
    ],
    providers: [],
})
export class NgamrsSharedModule { }
