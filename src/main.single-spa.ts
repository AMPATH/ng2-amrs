import 'core-js/es7/reflect';
import { loadStaticAssets } from './single-spa/load-static-assets';
import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';
import { environment } from './environments/environment';
import singleSpaAngular from 'single-spa-angular';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: () => platformBrowserDynamic().bootstrapModule(AppModule).then(bootstrappedModule => {
    if ('serviceWorker' in navigator && environment.production) {
       navigator.serviceWorker.register('ngsw-worker.js');
    }

    return bootstrappedModule;
  }),
  template: `
    <app-root>
      <div class="app-loader">
        <div class="app-loader-center">
          <div class="app-loader-center-wrapper">
            <div class="app-loader-spinner">
              <div class="double-bounce1"></div>
              <div class="double-bounce2"></div>
              <div class="double-bounce3"></div>
            </div>
            <div class="app-loader-logo-man">&nbsp;</div>
            <div class="app-loader-logo">
              <img [src]="'img/ampath.png' | assetUrl" />
            </div>
          </div>
        </div>
      </div>
    </app-root>
  `,
  Router,
  NgZone: NgZone,
  AnimationEngine: AnimationEngine,
});

export const bootstrap = [
  loadStaticAssets,
  lifecycles.bootstrap,
];
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
