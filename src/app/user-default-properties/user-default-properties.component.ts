import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, Params }    from '@angular/router';
import * as _ from 'lodash';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';

@Component({
  selector: 'user-default-properties',
  templateUrl: './user-default-properties.component.html',
  styleUrls: ['./user-default-properties.component.css']
})
export class UserDefaultPropertiesComponent implements OnInit {

  public isBusy: boolean = false;
  public query: string = '';
  public user: User;
  public locations: Array<any> = [];
  public filteredList: Array<any> = [];
  public departments = [];
  public selectedDepartment;
  public currentLocation: string = '';
  public selectedIdx: number = -1;
  public isLoading: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private propertyLocationService: UserDefaultPropertiesService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private departmentProgramService: DepartmentProgramsConfigService
  ) {
    this.user = this.userService.getLoggedInUser();

  }

  public ngOnInit() {

    this.isBusy = true;

    this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocation();
    // if the user is confirming, prefill the current location
    this.route.params.subscribe((params: Params) => {
        if (params['confirm'] !== undefined) {
          this.query = this.currentLocation;
        }
    });

    this.propertyLocationService.getLocations().subscribe((response: Response) => {
      this.locations = response.json().results;
      this.isBusy = false;
    });

    let department = this.localStorageService.getItem('userDefaultDepartment');
    department = JSON.parse(department);
    if (department) {
      this.selectedDepartment = department[0];
    }

    this.getDepartments();

  }

  public goToPatientSearch() {
    this.isLoading = true;
    this.router.navigate(['patient-dashboard/patient-search']);
  }

  public filter(event: any) {

    if (this.query !== '') {
      this.filteredList = this.locations.filter(function(_location) {
        return _location.display.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
      if (event.code === 'ArrowDown' && this.selectedIdx < this.filteredList.length) {
        this.selectedIdx++;
      } else if (event.code === 'ArrowUp' && this.selectedIdx > 0) {
        this.selectedIdx--;
      }
    } else {
      this.filteredList = [];
    }
  }

  public getDepartments() {
    this.departmentProgramService.getDartmentProgramsConfig()
     .subscribe((results) => {
        if (results) {
          _.each(results, (department, key) => {
            if (key !== 'uud4') {
              let dept = {
                'itemName': department.name,
                'id': key
              };
              this.departments.push(dept);
              this.departments = _.remove(this.departments, (dep) => {
                return dep.id !== 'uud5';
              });
            }
          });
        }
     });
  }

  public selectDepartment(event) {
    let department = [event];
    this.localStorageService.setItem('userDefaultDepartment', JSON.stringify(department));
  }

 public select(item) {
    this.query = item.display;
    this.currentLocation = item.display;
    let location = JSON.stringify({ uuid: item.uuid, display: item.display });
    this.propertyLocationService.setUserProperty('userDefaultLocation', location);
    this.filteredList = [];
    this.selectedIdx = -1;
  }

}
