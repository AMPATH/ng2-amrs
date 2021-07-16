import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { SessionService } from "./session.service";
import { LocalStorageService } from "../utils/local-storage.service";
import { SessionStorageService } from "../utils/session-storage.service";
import { Constants } from "../utils/constants";
import { CookieService } from "ngx-cookie";

@Injectable()
export class AuthenticationService {
  constructor(
    private appSettingsService: AppSettingsService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private sessionService: SessionService,
    private _cookieService: CookieService
  ) {}

  public authenticate(username: string, password: string) {
    const credentials = {
      username: username,
      password: password,
    };

    const request = this.sessionService.getSession(credentials);

    request.pipe(take(1)).subscribe((response: any) => {
      const data = response;

      if (data.authenticated) {
        this.setCredentials(username, password);

        // store logged in user details in session storage
        const user = data.user;
        this.storeUser(user);
      }
    });

    return request;
  }

  public logOut() {
    const response = this.sessionService.deleteSession();

    response.pipe(take(1)).subscribe(
      (res: Response) => {
        this.clearSessionCache();
      },
      (error: Error) => {
        this.clearSessionCache();
      }
    );

    return response;
  }

  public clearSessionCache() {
    this.clearLoginAlertCookies();
    this.clearCredentials();
    this.clearUserDetails();
  }
  // This will clear motd alert cookies set  at every log in
  public clearLoginAlertCookies() {
    const cookieKey = "motdLoginCookie";

    this._cookieService.remove(cookieKey);
  }

  private setCredentials(username: string, password: string) {
    const base64 = btoa(username + ":" + password);
    this.sessionStorageService.setItem(Constants.CREDENTIALS_KEY, base64);
  }

  private clearCredentials() {
    this.sessionStorageService.remove(Constants.CREDENTIALS_KEY);
  }

  private storeUser(user: any) {
    this.sessionStorageService.setObject(Constants.USER_KEY, user);
  }

  private clearUserDetails() {
    this.sessionStorageService.remove(Constants.USER_KEY);
  }
}
