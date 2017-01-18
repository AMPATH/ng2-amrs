import { Injectable } from '@angular/core';

@Injectable()
export class FormentryHelperService {

  constructor() {
  }

  public toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

}

