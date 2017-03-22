/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import { DataCacheService } from './shared/services/data-cache.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class App {

  name = 'Ampath POC';
  routes: any[];

  constructor(public appState: AppState,
              public dataCache: DataCacheService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title) {
  }

  ngOnInit() {
    this.dataCache.setDefaulTime(60 * 15);
    this.dataCache.clearExpired();
    // work around for setting page title dynamically: this is important for analytics
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        let title = event['title'] ? ' | ' + event['title'] : '';
        this.titleService.setTitle('Ampath P.O.C' + title);
      });
  }
}
