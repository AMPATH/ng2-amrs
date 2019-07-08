import * as jQuery from 'jquery';
import '../styles.css';
import { assetUrl, publicPath } from 'src/single-spa/public-path';

// @ts-ignore
window.$ = window.jQuery = jQuery;

export function loadStaticAssets() {
  return Promise.all([
    loadCss(assetUrl('css/material.font.css')),
    loadCss(assetUrl('css/bootstrap.min.css')),
    loadCss(assetUrl('css/AdminLTE.css')),
    loadCss(assetUrl('skin-black-light.css')),
    loadCss(assetUrl('app.css')),
    loadJs(publicPath + 'scripts.js')
  ]);
}

function loadCss(url) {
  return new Promise((resolve, reject) => {
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = url;
    linkEl.addEventListener('load', () => {
      resolve();
    });
    linkEl.addEventListener('error', err => {
      reject(err);
    });
    document.head.appendChild(linkEl);
  });
}

function loadJs(url) {
  return new Promise((resolve, reject) => {
    const scriptEl = document.createElement('script');
    scriptEl.src = url;
    scriptEl.addEventListener('load', () => {
      resolve();
    });
    scriptEl.addEventListener('error', evt => {
      reject(evt);
    });
    document.head.appendChild(scriptEl);
  });
}
