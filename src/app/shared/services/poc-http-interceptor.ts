import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError as observableThrowError } from "rxjs";
import { Constants } from "../../utils/constants";
import { SessionStorageService } from "../../utils/session-storage.service";
import { tap } from "rxjs/operators";

@Injectable()
export class PocHttpInteceptor implements HttpInterceptor {
  constructor(private sessionStorageService: SessionStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const credentials = this.sessionStorageService.getItem(
      Constants.CREDENTIALS_KEY
    );
    let modifiedReq = req;
    if (credentials) {
      const authHeader = { Authorization: "Basic " + credentials };
      modifiedReq = req.clone({ setHeaders: authHeader });
    }
    return next.handle(modifiedReq).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            // do stuff with response here
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            return observableThrowError(err);
          }
        }
      )
    );
  }
}
