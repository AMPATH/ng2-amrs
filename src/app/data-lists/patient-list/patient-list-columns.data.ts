export class PatientListColumns {

    public static columns() {
        return [
            {
                headerName: '#',
                width: 60,
                pinned: true,
                cellRenderer: (column) => {
                    return parseInt(column.node.id, 10) + 1;
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
            }
        ];
    }
}
