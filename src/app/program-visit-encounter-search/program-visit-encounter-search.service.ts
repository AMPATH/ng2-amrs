import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectDepartmentService {
    public selectedDepartmentSource = new BehaviorSubject<string>('');

    public selectedDepartment$ = this.selectedDepartmentSource.asObservable();
    constructor() { }

    public setDepartment(department: string) {
        this.selectedDepartmentSource.next(department);
    }

    public getDepartment() {
        return this.selectedDepartmentSource.asObservable();
    }
}
