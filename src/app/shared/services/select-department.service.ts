import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

@Injectable()
export class SelectDepartmentService {
  public selectedDepartmentSource = new BehaviorSubject<string>('');

  public selectedDepartment$ = this.selectedDepartmentSource.asObservable();
  constructor(private localStorageService: LocalStorageService) {}

  public setDepartment(department: string) {
    this.selectedDepartmentSource.next(department);
  }

  public getDepartment() {
    return this.selectedDepartmentSource.asObservable();
  }

  public getUserSetDepartment(): string {
    const userDefaultDepartment: any = JSON.parse(
      this.localStorageService.getItem('userDefaultDepartment')
    );
    // defaults to HIV department
    let department = 'HIV';
    if (typeof userDefaultDepartment !== 'undefined') {
      department = userDefaultDepartment[0].itemName;
    }
    return department;
  }
}
