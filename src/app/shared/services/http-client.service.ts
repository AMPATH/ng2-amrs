import { Injectable, Inject } from '@angular/core';
import {
    Http, Request, RequestOptionsArgs, Response, XHRBackend,
    RequestOptions, ConnectionBackend, Headers
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class HttpClient extends Http {
    constructor(
        @Inject(ConnectionBackend) backend: ConnectionBackend,
        @Inject(RequestOptions) defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, options));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.patch(url, body, options));
    }

    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.head(url, options));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        observable.subscribe(null, (err) => {
            console.error(err);
        }, () => {
            console.log('complete');
        });
        return observable;
    }
}
