import {
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { DefaulterTracingRegisterResourceService } from 'src/app/etl-api/defaulter-tracing-register-resource.service';
import { DefaulterTracingRegisterCacheService } from '../defaulter-tracing-register-cache.service';

@Component({
  selector: 'app-defaulter-record',
  templateUrl: './defaulter-record.component.html',
  styleUrls: ['./defaulter-record.component.css']
})
export class DefaulterRecordComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('locations') public locationUuids: any;
  // tslint:disable-next-line:no-input-rename
  @Input('date') public selectedDate: any;
  public errors: any[] = [];
  public defaulterTracingRegisterData: any[] = [];
  public loadingDefaulterTracingRegister = false;
  public summarydataLoaded = false;
  public selectedLocation: any;
  // public selectedDate: any;
  public dataLoaded = false;
  private subs: Subscription[] = [];
  public top = [
    'a',
    'b',
    'c',
    'd',
    'e',
    '',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'm',
    'o',
    '',
    '',
    ''
  ];

  constructor(
    private defaulterTracingRegisterCacheService: DefaulterTracingRegisterCacheService,
    private router: Router,
    // @Inject('DefaulterTracingRegisterResource')
    private defaulterTracingRegisterResourceService: DefaulterTracingRegisterResourceService
  ) {}

  public ngOnInit() {
    const sub = this.defaulterTracingRegisterCacheService
      .getSelectedLocation()
      .subscribe((clinic) => {
        this.selectedLocation = clinic;
        const dateSub = this.defaulterTracingRegisterCacheService
          .getSelectedDate()
          .subscribe((date) => {
            this.selectedDate = date;
            if (this.selectedLocation && this.selectedDate) {
              if (this.loadingDefaulterTracingRegister === false) {
                this.initParams();
                this.getDefaulterTracingRegister(
                  this.selectedDate,
                  this.locationUuids
                );
              }
            }
          });
        this.subs.push(dateSub);
      });
    this.subs.push(sub);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public getDefaulterTracingRegister(dateStated, locations) {
    this.initParams();
    this.loadingDefaulterTracingRegister = true;
    this.defaulterTracingRegisterCacheService.setIsLoading(
      this.loadingDefaulterTracingRegister
    );
    const params = {
      month: dateStated,
      locationUuids: locations
    };
    const result = this.defaulterTracingRegisterResourceService.getDefaulterTracingRegisterMonthlyRegister(
      params
    );
    if (result === null) {
      throw new Error('Null Defaulter Tracing Register observable');
    } else {
      console.log('result:', result);
      result.take(1).subscribe(
        (data) => {
          if (data && data.result.length > 0) {
            const formatted = this.defaulterTracingRegisterCacheService.formatData(
              data.result
            );
            this.defaulterTracingRegisterData = this.defaulterTracingRegisterData.concat(
              formatted
            );
            this.summarydataLoaded = true;
          } else {
            this.dataLoaded = true;
          }
          this.loadingDefaulterTracingRegister = false;
          this.defaulterTracingRegisterCacheService.setIsLoading(
            this.loadingDefaulterTracingRegister
          );
        },
        (error) => {
          this.loadingDefaulterTracingRegister = false;
          this.defaulterTracingRegisterCacheService.setIsLoading(
            this.loadingDefaulterTracingRegister
          );
          this.errors.push({
            id: 'Defulter Tracing Register',
            message: 'error fetching defaulter tracing register'
          });
        }
      );
    }
  }

  public initParams() {
    this.loadingDefaulterTracingRegister = false;
    this.dataLoaded = false;
    this.errors = [];
    this.defaulterTracingRegisterData = [];
  }

  @HostListener('scroll', ['$event']) // for window scroll events
  onScroll(event: any) {}
}
