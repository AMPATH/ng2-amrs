import { Injectable } from "@angular/core";
import { SessionStorageService } from "../utils/session-storage.service";
import { User } from "../models/user.model";

@Injectable()
export class UserMockService {
  constructor(private sessionStorageService: SessionStorageService) {}

  public getLoggedInUser(): User {
    return new User({});
  }
}
