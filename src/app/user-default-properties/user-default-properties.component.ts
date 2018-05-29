import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, Params }    from '@angular/router';
import * as _ from 'lodash';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { RetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry.service';

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
  public selectedDepartment: any;
  public selectedIdx: number = -1;
  public location: any;
  public confirming: boolean = false;
  public isLoading: boolean = false;
  public locations: Array<any> = [];
  public currentLocation: any;
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
    this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocationObject();
    // if the user is confirming, prefill the current location
    this.route.params.subscribe((params: Params) => {
      if (params['confirm'] !== undefined) {
        this.location = this.retrospectiveDataEntryService.mappedLocation(this.currentLocation);
        this.propertyLocationService.setUserProperty('retroLocation',
          JSON.stringify(this.location));
      }
    });

    this.propertyLocationService.getLocations().subscribe((response: Response) => {
      this.locations = response.json().results.map((location: any) => {
        if (!_.isNil(location.display)) {
          return this.retrospectiveDataEntryService.mappedLocation(location);
        }
      });
      this.isBusy = false;
    });

    let department = this.localStorageService.getItem('userDefaultDepartment');
    department = JSON.parse(department);
    if (department) {
      this.selectedDepartment = department[0];
    }

    this.getDepartments();
    this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
          this.retroSettings = retroSettings;
    });

  }

  public goToPatientSearch() {
      this.isLoading = true;
      this.router.navigate(['patient-dashboard/patient-search']);

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
    this.selectedDepartment = event;
    this.localStorageService.setItem('userDefaultDepartment', JSON.stringify(department));
  }

 public select(item) {
    let location = JSON.stringify({ uuid: item.value, display: item.label });
    this.propertyLocationService.setUserProperty('userDefaultLocation', location);
    this.propertyLocationService.setUserProperty('retroLocation', JSON.stringify(item));
  }

}
