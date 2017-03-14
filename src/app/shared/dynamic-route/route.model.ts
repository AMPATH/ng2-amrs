export class RouteModel {
    label: string;
    url: string;
    initials: string;
    renderingInfo: any;
    childRoutes: Array<RouteModel> =  [];
    constructor() {

    }
}
