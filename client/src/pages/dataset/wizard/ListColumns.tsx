import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import EditDataset from './EditColumn';
import * as _ from 'lodash';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import AnimateButton from 'components/@extended/AnimateButton';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AlertDialog from 'components/AlertDialog';
import { Alert } from '@mui/material';
import { Chip } from '@mui/material';
import { Divider } from '@mui/material';
import { error } from 'services/toaster';
import { Box } from '@mui/material';
import { areConflictsResolved, checkForCriticalSuggestion, flattenSchema } from 'services/json-schema';

const pageMeta = { pageId: 'columns', title: "Review Columns" };
const alertDialogContext = { title: 'Delete Column', content: 'Are you sure you want to delete this column ?' };

const ListColumns = ({ handleNext, setErrorIndex, handleBack, index }: any) => {
  const apiResponse = useSelector((state: any) => state.jsonSchema);
  const configurations = _.get(apiResponse, 'data.configurations') || [];
  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState<Record<string, any>>({});
  const dispatch = useDispatch()
  const wizardState: IWizard = useSelector((state: any) => state?.wizard);
  const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
  const [flattenedData, setFlattenedData] = useState<Array<Record<string, any>>>([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const globalConfig = useSelector((state: any) => state?.config);

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

  const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: flattenedData } }));

  const gotoNextSection = () => {
    if (areConflictsResolved(flattenedData)) {
      persistState();
      handleNext();
    } else {
      dispatch(error({ message: 'Please resolve conflicts to proceed further' }));
      setErrorIndex(index)
    }
  }

  const gotoPreviousSection = () => {
    persistState();
    handleBack();
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'column',
        Cell: ({ value, cell }: any) => {
          const row = cell?.row?.original || {};
          const suggestions = _.get(row, 'suggestions');
          const hasCriticalConflicts = checkForCriticalSuggestion(suggestions || []);
          const isResolved = _.get(row, 'resolved') || false;
          const PrimaryIcon = isResolved ? CheckOutlined : CloseOutlined;
          const color = isResolved ? "primary" : "error";
          return <Box display="flex" alignItems="center">
            <Typography variant="body1">
              {value}
            </Typography>
            {hasCriticalConflicts && <Tooltip title={isResolved ? "Resolved" : "Unresolved"}>
              <IconButton color={color}>
                <PrimaryIcon />
              </IconButton>
            </Tooltip>
            }
          </Box>;
        }
      },
      {
        Header: 'Data type',
        accessor: 'type'
      },
      {
        Header: 'Suggestions',
        accessor: 'suggestions',
        Cell: ({ value, cell }: any) => {
          const suggestions = value || [];
          const { severityToColorMapping } = globalConfig;
          return <Grid container spacing={2}>
            <Grid item sm zeroMinWidth>
              {suggestions.length == 0 &&
                <Typography variant="body2">
                  N/A
                </Typography>}
              <Stack spacing={1} divider={<Divider orientation='horizontal' flexItem />}>
                {suggestions.length !== 0 && suggestions.map((payload: any, index: number) => {
                  return <div key={index}>
                    <Typography variant="body2">
                      <b>Message</b> - {payload?.message}
                    </Typography>
                    <Typography variant="body2">
                      <b>Advice</b> - {payload?.advice}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {payload?.severity && <Chip size='small' label={payload?.severity} color={_.get(severityToColorMapping, [payload?.severity || "LOW", "color"])} variant='outlined' />}
                      {payload?.resolutionType && <Chip size='small' label={payload?.resolutionType} color="primary" variant='outlined' />}
                    </Stack>
                  </ div>
                })}
              </Stack>
            </Grid>
          </Grid>
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
            <IconButton color="primary" size="large" onClick={e => {
              setOpenAlertDialog(true);
              setSelection({ value: initialValue, ...rest });
            }}>
              <DeleteOutlined />
            </IconButton>
          </Stack>
      }
    ],
    []
  );

  const [skipPageReset, setSkipPageReset] = useState(false);

  const fetchNonDeletedData = (flattenedData: Array<any>) => _.filter(flattenedData, payload => !_.has(payload, 'isDeleted'));
  const sortBySuggestions = (payload: Array<any>) => _.sortBy(payload, value => value?.suggestions);

  const updateMyData = (rowIndex: number, columnId: any, value: any) => {
    setSkipPageReset(true);
  };

  const handleAlertDialogClose = (status: boolean) => {
    if (selection && status) {
      markRowAsDeleted(selection?.cell?.row?.values);
    }
    setOpenAlertDialog(false);
  }

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
          <Alert severity="error">{apiResponse?.error}</Alert>
        </Grid>
      }

      {apiResponse?.status === 'success' &&
        <>
          <Grid item xs={12} sm={12}>
            <MainCard content={false}>
              <ScrollX>
                <ReactTable columns={columns} data={sortBySuggestions(fetchNonDeletedData(flattenedData)) as []} updateMyData={updateMyData} skipPageReset={skipPageReset} />
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
          <AlertDialog open={openAlertDialog} handleClose={handleAlertDialogClose} context={alertDialogContext}></AlertDialog>
        </>
      }
    </Grid>
  </>;
};

export default ListColumns;
