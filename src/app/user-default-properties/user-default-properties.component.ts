import { Component, OnInit , AfterViewInit , ChangeDetectorRef } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, Params }    from '@angular/router';

import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import * as _ from 'lodash';

@Component({
  selector: 'user-default-properties',
  templateUrl: './user-default-properties.component.html',
  styleUrls: ['./user-default-properties.component.css']
})
export class UserDefaultPropertiesComponent implements OnInit , AfterViewInit {

  public isBusy: boolean = false;
  public query: string = '';
  public user: User;
  public locations: Array<any> = [];
  public filteredList: Array<any> = [];
  public currentLocation: string = '';
  public selectedIdx: number = -1;
  public isLoading: boolean = false;
  public department: any  = [];
  public departments: any  = [];
  public departmentsConfig: any = [];
  public currentDepartment: any = [];
  public currentDepartmentText: string = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private propertyLocationService: UserDefaultPropertiesService,
              private userService: UserService,
              private cd: ChangeDetectorRef
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

    // get departments
    this.getDepartmentConfig();
    this.getDepartmentSaved();


  }

  public getDepartmentConfig() {

    this.departmentsConfig = this.propertyLocationService.getDepartments();

    this.loadDepartments();

  }

  public getDepartmentSaved() {

    let currentDepartments = this.propertyLocationService.getCurrentUserDepartment();
    this.currentDepartment = [];

    _.each(currentDepartments, ( department: any) => {
          let departmentName = department.itemName;
          this.currentDepartment.push(departmentName);
    });

    this.getCurrentDepartmentText(this.currentDepartment);


  }

  public loadDepartments() {


    _.each(this.departmentsConfig, (department: any, index) => {
            let specDepartment = {
                  'label': department.name,
                  'value': index
            };

            this.departments.push(specDepartment);
    });

  }

   public ngAfterViewInit(): void {
      this.cd.detectChanges();
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

 public select(item) {
    this.query = item.display;
    this.currentLocation = item.display;
    let location = JSON.stringify({ uuid: item.uuid, display: item.display });
    this.propertyLocationService.setUserProperty('userDefaultLocation', location);
    this.filteredList = [];
    this.selectedIdx = -1;
  }
  public selectDepartment($event) {

      this.updateDepartment();

  }
  public selectAllDepartments() {

     this.department = [];
     this.currentDepartment = [];

     let selectedDepartments = [];

     _.each(this.departments, (department: any) => {
            let departmentUuid = department.value;
            let departmentName = department.label;
            this.department.push(departmentUuid);
     });

     this.updateDepartment();

  }
  public clearDepartments() {

      this.department = [];

      this.updateDepartment();

      this.propertyLocationService.removeUserDepartment();

  }

  public getCurrentDepartmentText(currentDepartment) {

     this.currentDepartmentText = currentDepartment.join();

     console.log('Current Dept Text' , this.currentDepartmentText);

  }

  public updateDepartment() {

     let departments = this.department;
     let selectedDepartments = [];
     this.currentDepartment = [];

     _.each(departments, (department: any) => {
           // get the department name and uuid
            _.each(this.departmentsConfig, (departConf: any, index) => {

                if (index.toString() === department) {
                     let specificDepartment = {
                         'id': department,
                         'itemName': departConf.name
                     };

                     selectedDepartments.push(specificDepartment);
                     this.currentDepartment.push(departConf.name);
                 }

            });
     });

     this.getCurrentDepartmentText(this.currentDepartment);

     this.propertyLocationService.setUserDepartment(JSON.stringify(selectedDepartments));

  }

  public deselectDepartment($event) {

     console.log('Deslected Department', $event);

     this.updateDepartment();

  }

}
