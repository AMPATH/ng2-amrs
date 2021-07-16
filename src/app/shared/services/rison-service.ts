import { Injectable } from "@angular/core";
import * as Rison from "rison-node";
@Injectable()
export class RisonService {
  constructor() {}
  encode(data: any) {
    return Rison.encode(data);
  }

  decode(data: String) {
    return Rison.decode(data);
  }
}
