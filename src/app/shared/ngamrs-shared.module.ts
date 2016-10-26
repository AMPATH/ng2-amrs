import { NgModule } from '@angular/core';

import { BusyModule, BusyConfig } from 'angular2-busy';



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
        )
    ],
    exports: [BusyModule],
    declarations: [],
    providers: [],
})
export class NgamrsSharedModule { }
