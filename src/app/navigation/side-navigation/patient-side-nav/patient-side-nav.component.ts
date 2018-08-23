import { Component, OnInit, trigger, transition, style, animate, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouteModel } from '../../../shared/dynamic-route/route.model';
import { DynamicRoutesService } from '../../../shared/dynamic-route/dynamic-routes.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation.service';

@Component({
    selector: 'patient-side-nav',
    templateUrl: './patient-side-nav.component.html',
    animations: [
        trigger('enterChild', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('400ms', style({ transform: 'translateY(0%)' }))
            ]),
            transition(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate('400ms', style({ transform: 'translateY(100%)' }))
            ])
        ])
    ]

})
export class PatientSideNavComponent implements OnInit, OnDestroy {
    public routes: Array<RouteModel> = [];
    public selectedRoute: RouteModel = null;
    public viewingChildRoutes = false;
    public changingRoutesSub: Subscription;
    public canViewFormsTab = false;


    constructor(private dynamicRoutesService: DynamicRoutesService,
                private navigationService: NavigationService) {
        this.subscribeToRoutesChangeEvents();
    }

    public ngOnInit() {
        this.subscribeToRoutesChangeEvents();
        this.setFormsTabViewingRight();
    }

    public setFormsTabViewingRight() {
        this.canViewFormsTab = this.navigationService.checkFormsTabViewingRight();
    }
    public ngOnDestroy() {
        this.changingRoutesSub.unsubscribe();
    }

    public viewChildRoutes(route: RouteModel) {
        this.viewingChildRoutes = true;
        this.selectedRoute = route;
        this.expandSideBar();
    }

    public viewProgramRoutes() {
        this.viewingChildRoutes = false;
        this.expandSideBar();
    }

    public subscribeToRoutesChangeEvents() {
        this.changingRoutesSub =
            this.dynamicRoutesService.patientRoutes.subscribe((next) => {
                this.routes = next;
                if (this.routes && this.routes.length > 0) {
                    this.selectedRoute = this.routes[0];
                }
            });
    }

    public expandSideBar() {
        this.navigationService.expandSideBar();
    }

    public collapseSideBar() {
        this.navigationService.collapseSideBar();
    }
}
