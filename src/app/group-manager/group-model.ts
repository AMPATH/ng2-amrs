export interface Group {
    uuid: string;
    attributes: any[];
    cohortLeaders: any[];
    cohortMembers: any[];
    cohortType: any[];
    description: string;
    endDate: Date;
    startDate: Date;
    groupCohort: boolean;
    location: any;
    name: string;
    links: any[];
    resourceVersion: string;
    cohortProgram: string;
}
