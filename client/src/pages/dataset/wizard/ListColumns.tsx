import { useEffect, useMemo, useState } from 'react';
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { flattenSchema } from 'services/json-schema';
import EditDataset from './EditDataset';
import * as _ from 'lodash';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import AnimateButton from 'components/@extended/AnimateButton';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';


const pageMeta = { pageId: 'columns', title: "Review Columns" };

const ListColumns = ({ handleNext, setErrorIndex, handleBack }: any) => {
  const apiResponse = useSelector((state: any) => state.jsonSchema);
  const suggestions = _.get(apiResponse, 'data.suggestions') || [];
  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState<Record<string, any>>({});
  const dispatch = useDispatch()
  const wizardState: IWizard = useSelector((state: any) => state?.wizard);
  const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
  const [flattenedData, setFlattenedData] = useState<Array<Record<string, any>>>([]);

  const markRowAsDeleted = (cellValue: Record<string, any>) => {
    const column = cellValue?.column
    if (column) {
      setFlattenedData((preState: Array<Record<string, any>>) => {
        return _.map(preState, payload => {
          return {
            ...payload,
            ...(_.get(payload, 'column') === column && {
              isModified: true,
              isDeleted: true
            })
          }
        })
      })
    }
  }

  const persistState = () => {
    dispatch(
      addState({
        id: pageMeta.pageId,
        index: 2,
        state: { schema: flattenedData }
      }));
  }

  const gotoNextSection = () => {
    persistState();
    handleNext();
  }

  const gotoPreviousSection = () => {
    persistState();
    handleBack();
  }

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
        Cell: ({ value, cell }: any) => {
          const { column } = cell?.row?.values || {};
          const propertySuggestions = _.find(suggestions, ['property', column]);
          if (propertySuggestions) {
            const suggestion: Array<{ message: string, advice: string }> = propertySuggestions?.suggestion || [];
            return <Grid container spacing={2}>
              <Grid item sm zeroMinWidth>
                {suggestion.map((payload, index) => {
                  return <div key={index}>
                    <Typography variant="body2">
                      {payload?.message}
                    </Typography>
                    <Typography variant="body2">
                      {payload?.advice}
                    </Typography>
                  </div>
                })}
              </Grid>
            </Grid>
          } else {
            return <Grid container spacing={2}>
              <Grid item sm zeroMinWidth>
                <Typography variant="body2">
                  N/A
                </Typography>
              </Grid>
            </Grid>
          }
        }
      },
      {
        Header: 'Actions',
        disableFilters: true,
        Cell: ({ value: initialValue, updateMyData, ...rest }: any) =>
          <Stack direction="row">
            <IconButton color="primary" size="large" onClick={_ => {
              setShowEdit(true)
              setSelection({ value: initialValue, ...rest })
            }}>
              <EditOutlined />
            </IconButton>
            <IconButton color="primary" size="large" onClick={e => markRowAsDeleted(rest?.cell?.row?.values)}>
              <DeleteOutlined />
            </IconButton>
          </Stack>
      }
    ],
    []
  );

  const [skipPageReset, setSkipPageReset] = useState(false);

  const fetchNonDeletedData = (flattenedData: Array<any>) => _.filter(flattenedData, payload => !_.has(payload, 'isDeleted'));

  const updateMyData = (rowIndex: number, columnId: any, value: any) => {
    setSkipPageReset(true);
  };

  useEffect(() => {
    if (apiResponse?.status === 'success' && apiResponse?.data?.schema) {
      const flattenedSchema = flattenSchema(apiResponse.data.schema) as any;
      const existingState = pageData?.state?.schema;
      setFlattenedData(existingState || flattenedSchema)
      setSkipPageReset(false);
    }
  }, [apiResponse?.status]);

  return <>

    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
      {pageMeta.title}
    </Typography>

    <Grid container spacing={2}>
      {apiResponse?.status !== 'success' &&
        <Grid item xs={12} sm={12}>
          <Loader />
        </Grid>
      }

      {apiResponse?.status === 'error' &&
        <Grid item xs={12} sm={12}>
          <div>Error</div>
        </Grid>
      }

      {apiResponse?.status === 'success' &&
        <>
          <Grid item xs={12} sm={12}>
            <MainCard content={false}>
              <ScrollX>
                <ReactTable columns={columns} data={fetchNonDeletedData(flattenedData) as []} updateMyData={updateMyData} skipPageReset={skipPageReset} />
              </ScrollX>
              {selection && showEdit && <EditDataset open={showEdit} setData={setFlattenedData} onSubmit={() => setShowEdit(false)} selection={selection} ></EditDataset>}
            </MainCard >
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                  Previous
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={gotoNextSection}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </>
      }
    </Grid>
  </>;
};

export default ListColumns;
