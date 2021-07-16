import { Injectable } from "@angular/core";
// analytics
import { Angulartics2 } from "angulartics2";

import { UserService } from "../../openmrs-api/user.service";
import { User } from "../../models/user.model";

@Injectable()
export class AppFeatureAnalytics {
  private appUser: User;

  constructor(
    private angulartics2: Angulartics2,
    private userService: UserService
  ) {}

  /**
   *
   *
   * @param {string} category
   * @param {string} action
   * @param {string} [name]
   *
   * @memberOf AppFeatureAnalytics
   */
  public trackEvent(category: string, action: string, name?: string) {
    this.appUser = this.userService.getLoggedInUser();
    this.angulartics2.setUsername.next(this.appUser.display);
    this.angulartics2.setUserProperties.next(this.appUser);
    this.angulartics2.eventTrack.next({
      action: action,
      properties: {
        category: category || "General",
        label: name || "N/A",
      },
    });
  }
}
