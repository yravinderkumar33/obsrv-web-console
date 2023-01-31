import { useMemo } from 'react';
import { Box, Chip, Divider, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTable, useFilters, useGlobalFilter, Column } from 'react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
  GlobalFilter,
  DefaultColumnFilter,
  SelectColumnFilter,
  renderFilterTypes,
} from 'utils/react-table';
import { IconButton } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CircularWithLabel from 'components/@extended/Progress/CircularWithLabel';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }: { columns: Column[]; data: [] }) {
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const initialState = useMemo(() => ({ filters: [{ id: 'status', value: '' }] }), []);
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
            <Button variant="contained" onClick={e => navigate('/dashboard/dataset/new')}>Add Dataset</Button>
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
const FilteringTable = () => {
  const data: any = useMemo(() => [
    {
      "name": "cropwise-observations",
      "health": "active",
      "status": "live",
      "color": "success",
      "connectors": [
        "Kafka",
        "S3"
      ],
      "completionPercentage": 60,
      "metrics": [
        {
          key: "Total Events",
          value: "200K"
        },
        {
          key: "Avg Processing Time",
          value: "2 seconds"
        },
        {
          key: "Last Synced",
          value: "2 seconds ago"
        }
      ]
    },
    {
      "name": "cropwise-collections",
      "health": "suspended",
      "status": "live",
      "color": "error",
      "connectors": [
        "Kafka"
      ],
      "completionPercentage": 90,
      "metrics": [
        {
          key: "Total Events",
          value: "100K"
        },
        {
          key: "Avg Processing Time",
          value: "5 seconds"
        },
        {
          key: "Last Synced",
          value: "10 seconds ago"
        }
      ]
    },
    {
      "name": "cropwise",
      "health": "active",
      "status": "live",
      "color": "success",
      "connectors": [
        "Kafka",
        "S3"
      ],
      "completionPercentage": 60,
      "metrics": [
        {
          key: "Total Events",
          value: "200K"
        },
        {
          key: "Avg Processing Time",
          value: "2 seconds"
        },
        {
          key: "Last Synced",
          value: "2 seconds ago"
        }
      ]
    },
  ], []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: (value: any) => {
          const row = value?.cell?.row?.original || {};
          return <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
            <Grid item>
              <CircularWithLabel value={row?.completionPercentage} color="success" />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography align="left" variant="subtitle1">
                {row.name}
              </Typography>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                divider={<Divider orientation="vertical" flexItem />}
              >
                {
                  row?.connectors?.map((connector: string) => {
                    return <Typography align="left" variant="caption" color="secondary">
                      {connector}
                    </Typography>
                  })
                }
              </Stack>

            </Grid>
          </Grid>
        }
      },
      {
        Header: 'Metrics',
        accessor: 'metrics',
        disableFilters: true,
        Cell: ({ value }: any) => {
          return <Grid container spacing={2} alignItems="center">
            {
              Array.isArray(value) && value.map(metric => {
                return <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item sm zeroMinWidth>
                      <Typography variant="body2">{metric?.key}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" align="right">
                        {metric?.value}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              })
            }
          </Grid>
        }
      },
      {
        Header: 'Health',
        accessor: 'health',
        Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: ({ value, cell }: any) => {
          const row = cell?.row?.original || {};
          return <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <Chip color={row?.color} label={typeof value == 'string' && value.toUpperCase()} size="small" variant="light" />
            </Grid>
          </Grid>
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: ({ value, cell }: any) => {
          const row = cell?.row?.original || {};
          return <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <Chip color={'success' || row?.color} label={typeof value == 'string' && value.toUpperCase()} size="small" variant="light" />          </Grid>
          </Grid>
        }
      },
      {
        Header: 'Actions',
        accessor: 'color',
        disableFilters: true,
        Cell: () => <Stack direction="row" justifyContent="center" alignItems="center">
          <IconButton color="primary" size="large">
            <EditOutlined />
          </IconButton>
          <IconButton color="inherit" size="large">
            <DeleteOutlined />
          </IconButton>
        </Stack>
      }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export default FilteringTable;
