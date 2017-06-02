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

    private activeLinkIndex = 0;
    private tabLinks = [
        { label: 'Summary', link: 'summary' },
        { label: 'Visits', link: 'visits' },
        { label: 'Location Statistics', link: 'location' }

    ];

    constructor(private clinicFlowCacheService: ClinicFlowCacheService,
        private router: Router,
        @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource) { }

    ngOnInit() {
        this.setActiveTab();
    }

    setActiveTab() {
        if (this.router.url) {
            let path = this.router.url;
            let n = this.router.url.indexOf('?');
            path = this.router.url.substring(0, n !== -1 ? n : path.length);
            path = path.substr(this.router.url.lastIndexOf('/') + 1);
            this.activeLinkIndex = this.tabLinks.findIndex(x => x.link === path);

        }
    }




}
