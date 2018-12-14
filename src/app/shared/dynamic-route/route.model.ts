export class RouteModel {
  public label: string;
  public url: string;
  public initials: string;
  public renderingInfo: any;
  public isDistinct: boolean;
  public childRoutes: Array<RouteModel> =  [];
    constructor() {

    }
}
