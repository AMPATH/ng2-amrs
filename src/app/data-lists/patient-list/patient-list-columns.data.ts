
export class PatientListColumns {

    public static columns() {

        return [
            {
                headerName: '#',
                field: '#',
                width: 60,
                pinned: true
            },
            {
                headerName: 'Identifiers',
                field: 'identifiers',
                width: 150,
                cellStyle: {
                    'white-space': 'normal'
                },
                pinned: true,
                filter: 'text'
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
            }
        ];
    }
}
