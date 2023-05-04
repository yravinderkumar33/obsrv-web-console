import { Fragment, useCallback, useEffect, useState } from 'react';
import * as _ from "lodash";
import { alpha, useTheme } from '@mui/material/styles';
import { checkForCriticalSuggestion } from 'services/json-schema';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Typography, Skeleton } from '@mui/material';
import { useTable, useFilters, Column, useExpanded } from 'react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import HtmlTooltip from './HtmlTooltip';

interface Props {
    columns: Column[];
    data: [];
    updateMyData: (rowIndex: number, columnId: any, value: any) => void;
    skipPageReset: boolean;
    limitHeight: boolean;
    tHeadHeight?: number;
    renderRowSubComponent: any;
    styles?: any;
}

function SubRows({ row, rowProps, data, loading }: any) {
    const theme = useTheme();

    if (loading) {
        return (
            <>
                {[0, 1, 2].map((item: number) => (
                    <TableRow key={item}>
                        <TableCell />
                        {[0, 1, 2, 3, 4, 5].map((col: number) => (
                            <TableCell key={col}>
                                <Skeleton animation="wave" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </>
        );
    }

    return (
        <>
            {data.map((x: any, i: number) => (
                <TableRow {...rowProps} key={`${rowProps.key}-expanded-${i}`} sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.35) }}>
                    {row.cells.map((cell: any) => (
                        <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>
                            {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                                value: cell.column.accessor && cell.column.accessor(x, i),
                                row: { ...row, original: x }
                            })}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

function SubRowAsync({ row, rowProps }: any) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            // setData();
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line
    }, []);

    return <SubRows row={row} rowProps={rowProps} data={data} loading={loading} />;
}

function ReactTable({ columns, data, updateMyData, skipPageReset, limitHeight, tHeadHeight, renderRowSubComponent, styles = {} }: Props) {
    const tableSx = limitHeight ? { height: '35.563rem', overflowY: 'scroll' } : {};

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, visibleColumns, } = useTable(
        {
            columns,
            data,
            // @ts-ignore
            autoResetPage: !skipPageReset,
            updateMyData,
        },
        useFilters,
        useExpanded,
    );

    return (
        <TableContainer sx={tableSx}>
            <Table stickyHeader sx={{ borderCollapse: 'collapse' }} size="small" {...getTableProps()}>
                <TableHead sx={tHeadHeight ? { height: tHeadHeight } : {}}>
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
                                    arrow
                                >
                                    <TableCell sx={{ p: 0.5, ...styles }} {...column.getHeaderProps()}>
                                        <Typography variant="h5" textTransform='capitalize'>{column.render('Header')}</Typography>
                                    </TableCell>
                                </HtmlTooltip>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {headerGroups.map((group: any) => (
                        <TableRow {...group.getHeaderGroupProps()}>
                            {group.headers.map((column: any) => (
                                <TableCell sx={{ ...styles }}{...column.getHeaderProps([{ className: column.className }])}>
                                    {column.canFilter ? column.render('Filter') : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {rows.map((row: any, i: number) => {
                        prepareRow(row);
                        const suggestions = _.get(row, 'original.suggestions');
                        const isResolved = _.get(row, 'original.resolved') || false;
                        const isCritical = checkForCriticalSuggestion(suggestions);
                        const bgColor = () => {
                            if (isCritical && !isResolved) return { bgcolor: `#FFEEEE` };
                            else if (isResolved) return { bgcolor: `#EAFBEE` };
                            else return {};
                        }
                        const rowProps = row.getRowProps();

                        return (
                            <Fragment key={i}>
                                <TableRow {...row.getRowProps()}>
                                    {
                                        row.cells.map((cell: any) => (
                                            <TableCell
                                                sx={cell.column.errorBg ? { ...bgColor(), p: 0.5, ...styles } : { p: 0.5, ...styles }}
                                                {...cell.getCellProps()}
                                            >
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )
                                        )
                                    }
                                </TableRow>
                                {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const ExpandingTable = ({ columns, data, updateMyData, skipPageReset, limitHeight, tHeadHeight, styles = {} }: any) => {
    const renderRowSubComponent = useCallback(({ row, rowProps }: any) => <SubRowAsync row={row} rowProps={rowProps} />, []);

    return (
        <MainCard content={false}>
            <ScrollX>
                <ReactTable
                    columns={columns}
                    data={data}
                    updateMyData={updateMyData}
                    renderRowSubComponent={renderRowSubComponent}
                    skipPageReset={skipPageReset}
                    limitHeight={limitHeight}
                    tHeadHeight={tHeadHeight}
                    styles={styles}
                />
            </ScrollX>
        </MainCard>
    );
};

export default ExpandingTable;
