import { useMemo } from 'react';
import { Box, Chip, Divider, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTable, useFilters, useGlobalFilter, Column } from 'react-table';
import {
    GlobalFilter,
    DefaultColumnFilter,
    renderFilterTypes
} from 'utils/react-table';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

function FilteringTable({ columns, data }: any) {
    const filterTypes = useMemo(() => renderFilterTypes, []);
    const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
    const initialState = useMemo(() => ({ filters: [] }), []);
    const navigate = useNavigate();

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        // @ts-ignore
        preGlobalFilteredRows,
        // @ts-ignore
        setGlobalFilter
    } = useTable(
        {
            columns,
            data,
            // @ts-ignore
            defaultColumn,
            // @ts-ignore
            initialState,
            filterTypes
        },
        useGlobalFilter,
        useFilters
    );

    const sortingRow = rows.slice(0, 10);

    return (
        <Stack spacing={2}>
            <Box sx={{ p: 2, pb: 0 }} textAlign='end'>
                <Grid container spacing={2} direction="row"
                    justifyContent="flex-end"
                    alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                    <Grid item>
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            // @ts-ignore
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </Grid>

                    <Grid item>
                        <Button variant="contained" onClick={e => navigate('/dataset/new')}>Add Dataset</Button>
                    </Grid>
                </Grid>
            </Box>

            <Table {...getTableProps()}>
                <TableHead sx={{ borderTopWidth: 2 }}>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any) => (
                                <TableCell {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {headerGroups.map((group: any) => (
                        <TableRow {...group.getHeaderGroupProps()}>
                            {group.headers.map((column: any) => (
                                <TableCell {...column.getHeaderProps([{ className: column.className }])}>
                                    {column.canFilter ? column.render('Filter') : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {sortingRow.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map((cell: any) => (
                                    <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Stack >
    );
}

export default FilteringTable;