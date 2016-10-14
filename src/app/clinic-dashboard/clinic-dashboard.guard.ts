import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
@Injectable()
export class ClinicDashboardGuard implements CanActivate {

    constructor() { }
    canActivate() {
        console.log('Do Route stuff');
        return true;
    }
}