import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as rison from 'rison-node';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { Subscription } from 'rxjs';

import { KibanaVizComponent } from '../../shared/kibana-viz/kibana-viz.component';

@Component({
    selector: 'clinic-kibana-viz',
    templateUrl: '../../shared/kibana-viz/kibana-viz.component.html'
})
export class ClinicKibanaVizComponent extends KibanaVizComponent implements OnInit, OnDestroy {

    public kibanaVizUrl: string;
    public locationUuid: string;
    public height: string = '600';
    public width: string = '99%';
    public lastVizUrl: string;
    public sub: Subscription;
    constructor(route: ActivatedRoute,
        location: Location,
        router: Router
    ) {
        super(route, location, router);
    }

    public ngOnInit() {

        this.sub = this.route.parent.parent.url.subscribe((url) => {
            this.locationUuid = url[0].path;
            // console.log('location uuid', this.locationUuid);
            // this.resolveLocationUuidtoLocation();
            this.filterVizByLocation(this.locationUuid);
        });
        super.ngOnInit();
    }

    public ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public filterVizByLocation(locationUuid: string) {
        if (this.lastVizUrl === undefined ||
            this.lastVizUrl === null ||
            this.lastVizUrl.trim().length === 0) {
            this.lastVizUrl = this.kibanaVizUrl;
        }

        let newUrl = this.lastVizUrl;

        // STEP 1: First decode the kibana viz params
        let aVar = this.getQueryVariable('_a', newUrl);

        if (aVar === undefined) {
            return;
        }
        let passedInAppState = rison.decode(aVar);
        let passedInGlobalState = rison.decode(this.getQueryVariable('_g', newUrl));

        // console.log('decoded stuff', {
        //     passedInAppState: passedInAppState,
        //     passedInGlobalState: passedInGlobalState
        // });

        passedInAppState.filters = this.removeLocationFilters(passedInAppState.filters);
        passedInAppState.filters.push(this.getLocationFilter(locationUuid));
        // console.log('with filter', decoded);

        // STEP 2: Add desired filters
        let encoded = 'filters:!(' + encodeURI(rison.encode_array(passedInAppState.filters)) + ')';
        let replaced = newUrl.replace(newUrl.substring(newUrl.indexOf('filters:'),
            newUrl.indexOf(',fullScreenMode:')), encoded);

        // STEP 3: Inject generated filters
        this.kibanaVizUrl = replaced;
    }

    public getQueryVariable(variable, query) {
        const vars = query.split('&');
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }

    public getGenderFilter(genderInitial: string) {
        let filter: any = {
            '$state': {
                store: 'appState'
            },
            meta: {
                alias: null,
                disabled: false,
                index: 'bf46e7f0-3e49-11e8-a24d-0965e331515b',
                key: 'gender.keyword',
                negate: false,
                params: {
                    query: genderInitial,
                    type: 'phrase'
                },
                type: 'phrase',
                value: genderInitial
            },
            query: {
                match: {
                    'gender.keyword': {
                        query: genderInitial,
                        type: 'phrase'
                    }
                }
            }
        };

        return filter;
    }

    public getLocationFilter(locationUuid: string) {
        let filter: any = {
            '$state': {
                store: 'appState'
            },
            meta: {
                alias: null,
                disabled: false,
                index: '76cd6c40-3e50-11e8-afc7-a71ce40a3740',
                key: 'location_uuid.keyword',
                negate: false,
                params: {
                    query: locationUuid,
                    type: 'phrase'
                },
                type: 'phrase',
                value: locationUuid
            },
            query: {
                match: {
                    'location_uuid.keyword': {
                        query: locationUuid,
                        type: 'phrase'
                    }
                }
            }
        };

        return filter;
    }

    public removeLocationFilters(filtersArray: Array<any>) {
        let withoutLocation = [];
        if (filtersArray.length > 0) {
            filtersArray.forEach((filter) => {
                if (!(filter.query &&
                    filter.query.match &&
                    filter.query.match['location_uuid.keyword'])) {
                    withoutLocation.push(filter);
                }
            });
        }
        return withoutLocation;
    }

}
