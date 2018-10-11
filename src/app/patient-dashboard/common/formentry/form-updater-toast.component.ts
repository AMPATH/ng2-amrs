import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
@Component({
    selector: 'snackbar',
    template: `<div class="text-center">
    <span style="color:black; font-weight:500;"><i class="fa fa-spinner fa-spin fa-fw"></i></span>
    <span style="color:black; font-weight:500;"> {{ message }}</span>
    </div>`
})
export class ToastComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) { }
}
