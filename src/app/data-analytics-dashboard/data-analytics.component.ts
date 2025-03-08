import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../utils/local-storage.service';

@Component({
  selector: 'data-analytics-dashboard',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.css']
})
export class DataAnalyticsDashboardComponent implements OnInit {
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
      case 'hiv':
        this.router.navigate([
          '/data-analytics',
          department,
          'hiv-comparative-chart-analytics'
        ]);
        break;

      case 'hemato-oncology':
        this.router.navigate([
          '/data-analytics',
          department,
          'oncology-reports'
        ]);
        break;

      case 'cdm':
        this.router.navigate(['/data-analytics', department, 'clinic-flow']);
        break;

      case 'hts':
        this.router.navigate(['/data-analytics', department, 'clinic-flow']);
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
