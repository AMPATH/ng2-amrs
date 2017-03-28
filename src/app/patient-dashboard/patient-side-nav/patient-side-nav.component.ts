import { Component, OnInit, trigger, transition, style, animate, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouteModel } from '../../shared/dynamic-route/route.model';
import { DynamicRoutesService } from '../../shared/dynamic-route/dynamic-routes.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'patient-side-nav',
    templateUrl: 'patient-side-nav.component.html',
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
    constructor(private dynamicRoutesService: DynamicRoutesService) {
        this.subscribeToRoutesChangeEvents();
    }

    public ngOnInit() { }

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
        setTimeout(() => {
            let body = document.getElementsByTagName('body')[0];
            body.classList.remove('sidebar-collapse');
            body.classList.remove('sidebar-open');
            body.classList.add('sidebar-open');
        }, 200);
    }

    public collapseSideBar() {
        setTimeout(() => {
            let body = document.getElementsByTagName('body')[0];
            body.classList.remove('sidebar-collapse');
            body.classList.remove('sidebar-open');
            body.classList.add('sidebar-collapse');
        }, 200);
    }
}
