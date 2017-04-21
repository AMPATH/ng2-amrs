import { Injectable } from '@angular/core';
import { DatalistCellComponent } from './data-list-cell.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';

@Injectable()
export class PatientStatuChangeVisualizationService {

    constructor(private router: Router, private route: ActivatedRoute) { }
    public generateChart(options) {

        let barSeries = this.generateSeries(options.data, options.barIndicators, 'column');
        let lineSeries = this.generateSeries(options.data, options.lineIndicators, 'spline');
        let combinedSeries = barSeries.concat(lineSeries);
        return {
            title: {
                text: 'Patient Status Change Overview'
            },
            zoomType: 'x',
            xAxis: {
                categories: this.generateCategories(options.data),
                title: { text: 'Months' }
            },
            yAxis: {
                title: { text: 'Number of patients' }
            },
            series: combinedSeries
        };
    }

    public generateColumDefinations() {
        let columns = [];
        let columnLabelMap = {
            'reporting_month': {
                columnTitle: 'Reporting Month',
                pinned: true,
                patient_list: false
            },
            'total_patients': {
                columnTitle: 'Total patients',
                pinned: false,
                patient_list: true
            },
            'currently_in_care_total': {
                columnTitle: 'Active Patients',
                pinned: false,
                patient_list: true
            },
            'new_patients': {
                columnTitle: 'New Patients',
                pinned: false,
                patient_list: true
            },
            'transfer_in': {
                columnTitle: 'Transfer In',
                pinned: false,
                patient_list: true
            },
            'transfer_out': {
                columnTitle: 'Transfer Out',
                pinned: false,
                patient_list: true
            },
            'deaths': {
                columnTitle: 'Death',
                pinned: false,
                patient_list: true
            }

        };
        for (let row in columnLabelMap) {
            if (columnLabelMap.hasOwnProperty(row)) {
                let rowData = columnLabelMap[row];
                let column = {
                    headerName: rowData.columnTitle,
                    pinned: rowData.pinned,
                    width: 100,
                    field: row
                };
                if (rowData.patient_list) {
                    column['cellRendererFramework'] = DatalistCellComponent;
                }
                columns.push(column);
            }

        }
        return columns;
    }
    private snakeToTitle(str) {
        return str.split('_').map(function (item) {
            return item.charAt(0).toUpperCase() + item.substring(1);
        }).join(' ');
    }

    private generateCategories(dataSet) {
        let processed = [];
        for (let result of dataSet) {
            processed.push(result.reporting_month);
        }
        return processed;
    }

    private generateSeries(dataSet, indicators, type) {
        let processed = [];
        for (let result of indicators) {
            let data = dataSet.map((data) => {
                return data[result];
            });
            let column = {
                type: type,
                name: this.snakeToTitle(result),
                point: {
                    events: {
                        click: (event) => {
                            let data = dataSet.find((a) => {
                                return a.reporting_month === event.point.category;
                            });
                            let dateMoment = Moment(data.reporting_date);
                            let startOfMonth = dateMoment.startOf('month').format('YYYY-MM-DD');
                            let endOfMonth = dateMoment.endOf('month').format('YYYY-MM-DD');
                            this.router.navigate(['./patient-list']
                                , {
                                    relativeTo: this.route, queryParams: {
                                        startDate: startOfMonth,
                                        endDate: endOfMonth,
                                        indicator: result
                                    }
                                });
                        }
                    }
                }
            };
            column['data'] = data;
            processed.push(column);
        }
        return processed;
    }

}
