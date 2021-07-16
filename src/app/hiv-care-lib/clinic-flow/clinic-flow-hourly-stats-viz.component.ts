import { Component, OnInit, Input } from "@angular/core";

import * as _ from "lodash";
import * as moment from "moment";

@Component({
  selector: "clinic-flow-hourly-viz",
  templateUrl: "./clinic-flow-hourly-stats-viz.component.html",
  styleUrls: ["./clinic-flow-hourly-stats-viz.component.css"],
})
export class ClinicFlowHourlyStatsVizComponent implements OnInit {
  public graphOptions: any;

  private _data: Array<any>;
  @Input()
  public get data(): Array<any> {
    return this._data;
  }
  public set data(v: Array<any>) {
    this._data = v;
    if (Array.isArray(v)) {
      this.redrawGraph(v);
    }
  }
  constructor() {}

  public ngOnInit() {
    // let testData: Array<any> = [
    //     {
    //         'time': '8',
    //         'triaged': 9,
    //         'registered': 15,
    //         'seen': 3
    //     },
    //     {
    //         'time': '9',
    //         'triaged': 21,
    //         'registered': 21,
    //         'seen': 10
    //     },
    //     {
    //         'time': '10',
    //         'triaged': 17,
    //         'registered': 21,
    //         'seen': 19
    //     },
    //     {
    //         'time': '11',
    //         'triaged': 19,
    //         'registered': 19,
    //         'seen': 14
    //     },
    //     {
    //         'time': '12',
    //         'triaged': 16,
    //         'registered': 15,
    //         'seen': 20
    //     },
    //     {
    //         'time': '13',
    //         'triaged': null,
    //         'registered': 2,
    //         'seen': 13
    //     },
    //     {
    //         'time': '14',
    //         'triaged': 6,
    //         'registered': 8,
    //         'seen': 3
    //     },
    //     {
    //         'time': '15',
    //         'triaged': 10,
    //         'registered': 5,
    //         'seen': 11
    //     },
    //     {
    //         'time': '16',
    //         'triaged': 1,
    //         'registered': 1,
    //         'seen': 3
    //     },
    //     {
    //         'time': '18',
    //         'triaged': 1,
    //         'registered': 1,
    //         'seen': 1
    //     }
    // ];
    // this.redrawGraph(testData);
  }

  public redrawGraph(data: Array<any>) {
    const graphOptions: any = {
      chart: {
        type: "column",
      },
      title: {
        text: "Hourly Statistics",
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      // },
      // plotOptions: {
      //     column: {
      //         pointPadding: 0.2,
      //         borderWidth: 0
      //     }
      // },
    };

    graphOptions.xAxis = this.generateXaxisHighChartObject(data);
    graphOptions.xAxis.crosshair = true;
    graphOptions.xAxis.title = {
      text: "Time",
    };
    graphOptions.yAxis = {
      min: 0,
      title: {
        text: "Number of Patients",
      },
    };

    graphOptions.series = this.generateHighChartBarChartSeries(
      graphOptions.xAxis.categories,
      data
    );

    graphOptions.zoomType = "x";
    this.graphOptions = graphOptions;
    // console.log(this.graphOptions);
  }

  public generateXaxisHighChartObject(data: Array<any>) {
    const xAxis = {
      categories: [],
    };

    let maxTime: any;
    let minTime: any;

    _.each(data, (item) => {
      const time = moment(item.time, "H");

      if (maxTime === undefined) {
        maxTime = time;
      } else {
        if (time.isAfter(maxTime)) {
          maxTime = time;
        }
      }

      if (minTime === undefined) {
        minTime = time;
      } else {
        if (time.isBefore(minTime)) {
          minTime = time;
        }
      }
    });

    if (minTime) {
      xAxis.categories.push(moment(minTime).format("HH:mm"));
      let nextMin = moment(minTime).add(1, "hours");
      while (nextMin.isSameOrBefore(maxTime)) {
        xAxis.categories.push(nextMin.format("HH:mm"));
        nextMin = moment(nextMin).add(1, "hours");
      }
    }

    return xAxis;
  }

  public generateHighChartBarChartSeries(
    categories: Array<string>,
    data: Array<any>
  ): Array<any> {
    const series = [];

    const registered = [];
    const triaged = [];
    const seen = [];

    _.each(categories, (category) => {
      let found = false;
      for (const i of data) {
        if (moment(i.time, "H").isSame(moment(category, "HH:mm"))) {
          found = true;

          if (i.registered && i.registered !== null) {
            registered.push(i.registered);
          } else {
            registered.push(0);
          }

          if (i.triaged && i.triaged !== null) {
            triaged.push(i.triaged);
          } else {
            triaged.push(0);
          }

          if (i.seen && i.seen !== null) {
            seen.push(i.seen);
          } else {
            seen.push(0);
          }
        }
      }

      if (found === false) {
        registered.push(0);
        triaged.push(0);
        seen.push(0);
      }
    });

    series.push({
      name: "Registered",
      data: registered,
    });

    series.push({
      name: "Triaged",
      data: triaged,
    });

    series.push({
      name: "Seen by Clinician",
      data: seen,
    });

    return series;
  }
}
