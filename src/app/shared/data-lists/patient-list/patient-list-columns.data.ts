export class PatientListColumns {

    public static columns() {
        return [
            {
                headerName: '#',
                width: 60,
                pinned: true,
                cellRenderer: (column) => {
                    // initial ordering of patients
                    return parseInt(column.node.rowIndex, 10) + 1;
                },
                field: '#'
            },
            {
                headerName: 'Identifiers',
                field: 'identifiers',
                width: 150,
                cellStyle: {
                    'white-space': 'nowrap',
                    'text-overflow': 'ellipsis'
                },
                pinned: true,
                filter: 'text',
                cellClass: 'identifier-column'
            },
            {
                headerName: 'Person Name',
                width: 120,
                field: 'person_name',
                cellStyle: {
                    'white-space': 'normal'
                },
                pinned: true,
                filter: 'text'
            },
            {
                headerName: 'Gender',
                width: 75,
                field: 'gender'
            },
            {
                headerName: 'Age',
                width: 60,
                field: 'age'
            },
        ];
    }

    public static hivColumns() {
        return [
            {
                headerName: 'Phone Number',
                width: 150,
                field: 'phone_number'
            },
            {
                headerName: 'Latest Appointment',
                width: 200,
                field: 'last_appointment'
            },
            {
                headerName: 'Visit Type',
                width: 200,
                field: 'visit_type'
            },
            {
                headerName: 'Latest RTC Date',
                width: 150,
                field: 'latest_rtc_date'
            },
            {
                headerName: 'Current Regimen',
                width: 200,
                field: 'cur_meds'
            },
            {
                headerName: 'Latest VL',
                width: 75,
                field: 'latest_vl'
            },
            {
                headerName: 'Latest VL Date',
                width: 150,
                field: 'latest_vl_date'
            },
            {
              headerName: 'Previous VL',
              width: 75,
              field: 'previous_vl'
            },
            {
              headerName: 'Previous VL Date',
              width: 150,
              field: 'previous_vl_date'
            },
            {
              headerName: 'Nearest Center',
              width: 150,
              field: 'nearest_center'
            }
        ];
    }
}
