
export class PatientListColumns {

    public static columns() {

        return [
            {
                headerName: '#',
                field: '#',
                width: 150
            },
            {
                headerName: 'Identifiers',
                field: 'identifiers',
                width: 300,
                cellStyle: {
                    'white-space': 'normal'
                }
            },
            {
                headerName: 'Person Name',
                field: 'person_name',
                cellStyle: {
                    'white-space': 'normal'
                }
            },
            {
                headerName: 'Gender',
                field: 'gender'
            },
            {
                headerName: 'Age',
                field: 'age'
            }
        ];
    }
}
