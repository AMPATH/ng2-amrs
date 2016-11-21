import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router }    from '@angular/router';

import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { UserDefaultPropertiesService } from './user-default-properties.service';


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
  public currentLocation: string = '';
  public selectedIdx: number = -1;

  constructor(private router: Router,
              private propertyLocationService: UserDefaultPropertiesService,
              private userService: UserService
  ) {
    this.user = this.userService.getLoggedInUser();

  }

  ngOnInit() {

    this.isBusy = true;

    this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocation();

    this.propertyLocationService.getLocations().subscribe((response: Response) => {
      this.locations = response.json().results;
      this.isBusy = false;
    });

  }

  goToPatientSearch() {

    this.router.navigate(['patient-dashboard/patient-search']);

  }

  filter(event: any) {

    if (this.query !== '') {
      this.filteredList = this.locations.filter(function (_location) {
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

  select(item) {
    this.query = item.display;

    this.propertyLocationService.setUserProperty('userDefaultLocation', this.query);

    this.filteredList = [];
    this.selectedIdx = -1;
  }

}
