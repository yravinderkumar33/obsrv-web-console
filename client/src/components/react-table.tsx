import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTable, useFilters, Column } from 'react-table';
import * as _ from 'lodash';
import HtmlTooltip from './HtmlTooltip';
import { checkForCriticalSuggestion } from 'services/json-schema';

interface Props {
    columns: Column[];
    data: [];
    updateMyData: (rowIndex: number, columnId: any, value: any) => void;
    skipPageReset: boolean;
    limitHeight: boolean;
}

function ReactTable({ columns, data, updateMyData, skipPageReset, limitHeight }: Props) {
    const tableSx = limitHeight ? { height: 300, overflowY: 'scroll' } : {};

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
        {
            columns,
            data,
            // @ts-ignore
            autoResetPage: !skipPageReset,
            updateMyData,
        },
        useFilters
    );

    return (
        <TableContainer sx={tableSx}>
            <Table stickyHeader sx={{ borderCollapse: 'collapse' }} {...getTableProps()}>
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any) => (
                                <HtmlTooltip
                                    disableFocusListener
                                    disableTouchListener
                                    title={
                                        <>
                                            <Typography color="inherit">{column.render('tipText')}</Typography>
                                            <em>{"Editable - "}</em> <b>{`${column.render('editable')}`}</b>
                                        </>
                                    }
                                    placement="top-start"
                                >
                                    <TableCell {...column.getHeaderProps()}>
                                        {column.render('Header')}{`﹖`}
                                    </TableCell>
                                </HtmlTooltip>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row: any, i: number) => {
                        prepareRow(row);
                        const suggestions = _.get(row, 'original.suggestions');
                        const isResolved = _.get(row, 'original.resolved') || false;
                        const isCritical = checkForCriticalSuggestion(suggestions);
                        const bgColor = () => {
                            if (isCritical && !isResolved) return { border: `2px solid #F04134` }
                            else if (isResolved) return { border: `2px solid #00a854` }
                        }

                        return (
                            <TableRow {...row.getRowProps()} sx={bgColor()}>
                                {
                                    row.cells.map((cell: any) =>
                                        <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    )
                                }
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ReactTable