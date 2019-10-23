import { DQAChartAbstractionDAO } from './dqa-chart-abstraction-report-dao';

export class DQAChartAbstractionService {

    constructor() { }

    getDQAChartAbstractionReport(locations, limit, offset) {
        let dao = this.getDaoClass();
        return new Promise((resolve, reject) => {
            return dao.getDQAChartAbstractionReport(locations, limit, offset)
                .then((results) => {
                    resolve({
                        results: results
                    });
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    getDaoClass() {
        return new DQAChartAbstractionDAO();
    }

}