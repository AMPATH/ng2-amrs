import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Router } from '@angular/router';
let _ = require('lodash');
@Component({
    selector: 'clinic-flow',
    templateUrl: './clinic-flow.component.html'
})

export class ClinicFlowComponent implements OnInit {
  selectedTab: any = 0;
    constructor(private clinicFlowCacheService: ClinicFlowCacheService,
        private router: Router,
        @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource) { }

    ngOnInit() {


    }
}
