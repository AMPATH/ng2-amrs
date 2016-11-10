import { Injectable } from '@angular/core';
import { SessionStorageService } from '../utils/session-storage.service';
import { Constants } from '../utils/constants';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

  constructor(
    private sessionStorageService: SessionStorageService) { }

  public getLoggedInUser(): User {
    let userObject = this.sessionStorageService.getObject(Constants.USER_KEY);
    return new User(userObject);
  }
}
