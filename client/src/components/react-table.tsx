import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTable, useFilters, Column } from 'react-table';
import * as _ from 'lodash';
import { checkForCriticalSuggestion } from 'services/json-schema';

interface Props {
    columns: Column[];
    data: [];
    updateMyData: (rowIndex: number, columnId: any, value: any) => void;
    skipPageReset: boolean;
}

function ReactTable({ columns, data, updateMyData, skipPageReset }: Props) {

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
        {
            columns,
            data,
            // @ts-ignore
            autoResetPage: !skipPageReset,
            updateMyData
        },
        useFilters
    );

    return (
        <Table {...getTableProps()}>
            <TableHead>
                {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                            <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
                {rows.map((row: any, i: number) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell: any) => {
                                const suggestions = _.get(cell, 'row.original.suggestions');
                                const isResolved = _.get(cell, 'row.original.resolved') || false;
                                const isCritical = checkForCriticalSuggestion(suggestions);
                                const bgColor = (isCritical && !isResolved) ? '#f58989' : null;
                                return <TableCell {...cell.getCellProps()} style={{ 'backgroundColor': bgColor }} >{cell.render('Cell')}</TableCell>
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default ReactTable