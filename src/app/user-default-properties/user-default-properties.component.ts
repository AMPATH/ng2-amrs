/* tslint:disable:no-inferrable-types */
import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import {
  RetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry.service';
import * as _ from 'lodash';

@Component({
  selector: 'user-default-properties',
  templateUrl: './user-default-properties.component.html',
  styleUrls: ['./user-default-properties.component.css']
})
export class UserDefaultPropertiesComponent implements OnInit {

  public isBusy: boolean = false;
  public query: string = '';
  public user: User;
  public filteredList: Array<any> = [];
  public departments = [];
  public selectedDepartment: string = '';
  public selectedIdx: number = -1;
  public location: any;
  public confirming: boolean = false;
  public isLoading: boolean = false;
  public locations: Array<any> = [];
  public currentLocation: any;
  public disable = false;
  private retroSettings: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private departmentProgramService: DepartmentProgramsConfigService,
              private retrospectiveDataEntryService: RetrospectiveDataEntryService,
              private propertyLocationService: UserDefaultPropertiesService
  ) {

  }

  public ngOnInit() {

    this.isBusy = true;
    // if the user is confirming, prefill the current location
    this.route.params.subscribe((params: Params) => {
      if (params['confirm'] !== undefined) {
        this.location = this.retrospectiveDataEntryService.mappedLocation(this.currentLocation);
        this.propertyLocationService.setUserProperty('retroLocation',
          JSON.stringify(this.location));
      }
      this.getDepartmentsLocations();
    });

  }


  public goToPatientSearch() {
    this.isLoading = true;
    this.router.navigate(['patient-dashboard/patient-search']);

  }

  public selectDepartment(event: any) {
    const deptObject = _.find(this.departments, (el) => {
      return el.itemName === event;
    });

    const department = [deptObject];
    this.selectedDepartment = event;
    this.localStorageService.setItem('userDefaultDepartment', JSON.stringify(department));
  }

  public select(item: any) {
    this.disable = false;
    const location = JSON.stringify({uuid: item.value, display: item.label});
    this.currentLocation = location;
    this.propertyLocationService.setUserProperty('userDefaultLocation', location);
    this.propertyLocationService.setUserProperty('retroLocation', JSON.stringify(item));
  }

  private getDepartmentsLocations() {
    this.departmentProgramService.getDartmentProgramsConfig().pipe(take(1)).subscribe((results) => {
      if (results) {
        this.mapDepartments(results);
        this.setDepartmentLocation();
      }
      this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocationObject();
      if (!this.currentLocation) {
        this.disable = true;
      }
    });
  }

  private setDepartmentLocation() {
    this.propertyLocationService.getLocations().pipe(take(1)).subscribe((response) => {
      this.locations = response.results.map((location: any) => {
        if (location && !_.isNil(location.display)) {
          return this.retrospectiveDataEntryService.mappedLocation(location);
        }
      });
      this.isBusy = false;
      const department = JSON.parse(this.localStorageService.getItem('userDefaultDepartment'));
      if (department !== null) {
        this.selectedDepartment = department[0].itemName;
      } else {
        this.selectedDepartment = 'HIV';
        setTimeout(() => {
          this.selectDepartment(this.selectedDepartment);
        }, 1000);

      }
      this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
        this.retroSettings = retroSettings;
      });
    });
  }

  private mapDepartments(results: any[]) {
    _.each(results, (department, key: string) => {
      const dept = {
        'itemName': department.name,
        'id': key
      };
      this.departments.push(dept);
      this.departments = _.filter(this.departments, (dep) => {
        return !_.includes(['uud4', 'uud5'], dep.id);
      });
    });
  }

}
