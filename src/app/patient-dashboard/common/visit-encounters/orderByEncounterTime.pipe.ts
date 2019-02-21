import { Pipe, PipeTransform } from '@angular/core';
import * as Moment from 'moment';

@Pipe(
    {
        name: 'myOrderByTime',
        pure: false
    }
)

export class OrderByEncounterTimeAscPipe implements PipeTransform {

    public transform(array) {
        if (array.length === null) {
            return array;
        } else {

            array.sort((a: any, b: any) => {

                const dateTimeA = Moment(a.encounterDatetime);
                const dateTimeB = Moment(b.encounterDatetime);

                if (dateTimeA < dateTimeB) {
                    return -1;
                } else if (dateTimeA > dateTimeB) {
                    return 1;
                } else {
                    return 0;
                }
            });

            return array;

        }

    }

}
