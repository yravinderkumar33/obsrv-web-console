import { useEffect, useMemo, useState, ChangeEvent } from 'react';
import { Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useTable, useFilters, Column } from 'react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { flattenSchema } from 'services/json-schema';
import EditDataset from './EditDataset';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

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
              {row.cells.map((cell: any) => (
                <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

const ListDatasets = (props: { data: any }) => {
  const [data, setData] = useState(props?.data);
  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState<Record<string, any>>({});
  const [flattenedData, setFlattenedData] = useState<[]>([])
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'column'
      },
      {
        Header: 'Data type',
        accessor: 'type'
      },
      {
        Header: 'Comments',
        accessor: 'ref',
        Cell: function (value: any) {
          return <Grid container spacing={2} alignItems="center">
            <Grid item sm zeroMinWidth>
              <Typography variant="body2">
                Multiple types exist for this column
              </Typography>
            </Grid>
          </Grid>
        }
      },
      {
        Header: 'Actions',
        accessor: 'color',
        disableFilters: true,
        Cell: ({ value: initialValue, row: { index }, column: { id }, updateMyData, ...rest }: any) => <Stack direction="row" justifyContent="center" alignItems="center">
          <IconButton color="primary" size="large" onClick={_ => {
            setShowEdit(true)
            setSelection({ value: initialValue, rowIndex: index, columnIndex: id, updateMyData, ...rest })
          }}>
            <EditOutlined />
          </IconButton>
          <IconButton color="primary" size="large">
            <DeleteOutlined />
          </IconButton>
        </Stack>
      }
    ],
    []
  );

  const [skipPageReset, setSkipPageReset] = useState(false);

  const updateMyData = (rowIndex: number, columnId: any, value: any) => {
    setSkipPageReset(true);
    setData((old: any[]) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            // @ts-ignore
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  useEffect(() => {
    const flattenedSchema = flattenSchema(props?.data) as any
    setFlattenedData(flattenedSchema)
    setSkipPageReset(false);
  }, [data]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={flattenedData} updateMyData={updateMyData} skipPageReset={skipPageReset} />
      </ScrollX>
      {selection && showEdit && <EditDataset open={showEdit} onSubmit={() => setShowEdit(false)} selection={selection} ></EditDataset>}
    </MainCard >
  );
};

export default ListDatasets;
