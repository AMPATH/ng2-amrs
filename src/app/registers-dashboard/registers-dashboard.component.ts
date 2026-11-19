import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../utils/local-storage.service';

@Component({
  selector: 'app-registers-dashboard',
  templateUrl: './registers-dashboard.component.html',
  styleUrls: ['./registers-dashboard.component.css']
})
export class RegistersDashboardComponent implements OnInit {
  public selectedDepartment: any;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  public ngOnInit() {
    this.selectedDepartment = this.getUserDepartment();
    const department =
      this.selectedDepartment.length > 0
        ? this.selectedDepartment[0].itemName.toLowerCase()
        : 'general';
    switch (department) {
      case 'general':
        this.router.navigate([
          '/registers-dashboard',
          department,
          'defaulter-tracing-register'
        ]);
        break;
      case 'hiv':
        this.router.navigate([
          '/registers-dashboard',
          department,
          'defaulter-tracing-register'
        ]);
        break;
    }
  }

  public getUserDepartment() {
    let department = this.localStorageService.getItem('userDefaultDepartment');
    if (department === '[""]') {
      department = undefined;
    }

    if (!department) {
      this.router.navigate(['/user-default-properties']);
    }
    return JSON.parse(department);
  }
}
