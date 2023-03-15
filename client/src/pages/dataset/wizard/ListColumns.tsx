import { useEffect, useMemo, useState } from 'react';
import {
    Button, Grid, IconButton,
    Stack, TextField, Tooltip, Typography,
    FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
    FormControlLabel, Chip, Alert, Divider, Box
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import EditDataset from './EditColumn';
import * as _ from 'lodash';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, DeleteFilled } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import AnimateButton from 'components/@extended/AnimateButton';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AlertDialog from 'components/AlertDialog';
import { error } from 'services/toaster';
import { areConflictsResolved, checkForCriticalSuggestion, flattenSchema } from 'services/json-schema';
import RequiredSwitch from 'components/RequiredSwitch';
import { connect } from 'react-redux';

const validDatatypes = ['string', 'number', 'integer', 'object', 'array', 'boolean', 'null'];
const pageMeta = { pageId: 'columns', title: "Review Columns" };
const alertDialogContext = { title: 'Delete Column', content: 'Are you sure you want to delete this column ?' };

interface columnFilter {
    label: string,
    id: string | boolean,
    lookup: string,
    color: "default" | "error" | "warning" | "success" | "primary" | "secondary" | "info"
}

const columnFilters: columnFilter[] = [
    {
        'label': 'Critical',
        'id': 'CRITICAL',
        'lookup': 'severity',
        'color': "error"
    },
    {
        'label': 'High',
        'id': 'HIGH',
        'lookup': 'severity',
        'color': "error"
    },
    {
        'label': 'Medium',
        'id': 'MEDIUM',
        'lookup': 'severity',
        'color': "warning"
    },
    {
        'label': 'Low',
        'id': 'LOW',
        'lookup': 'severity',
        'color': "info"
    },
    {
        'label': 'Resolved',
        'id': true,
        'lookup': 'resolved',
        'color': "success"
    }
];

const ListColumns = ({ handleNext, setErrorIndex, handleBack, index, wizardStoreState }: any) => {
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
    const [filterByChip, setFilterByChip] = useState<columnFilter | null>(null);

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
            });
            persistState();
        }
    }

    const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: flattenedData } }));
    const pushStateToStore = (values: Array<Record<string, any>>) => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: values } }));

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
                Header: 'Field',
                accessor: 'column',
                tipText: 'Name of the field.',
                editable: false,
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
                Header: 'Description',
                accessor: 'description',
                tipText: 'Description for the field',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const [edit, setEdit] = useState(false);
                    const editDescription = () => setEdit((prevState) => !prevState);
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, description: e.target.value };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return <Box onClick={editDescription} display="flex" alignItems="center">
                        {edit && <TextField
                            fullWidth
                            onChange={handleChange}
                            autoFocus
                            label='Description'
                            onBlur={editDescription}
                        />}
                        {!edit && <Typography>{value}</Typography>}
                        {!edit && !value && <Typography variant="subtitle2">Click to edit description</Typography>}
                    </Box>;
                }
            },
            {
                Header: 'Data type',
                accessor: 'type',
                tipText: 'Data type of the field',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const [edit, setEdit] = useState(false);
                    const editType = () => setEdit((prevState) => !prevState);
                    const hasConflicts = _.get(row, 'suggestions.length');
                    const handleChange = (e: SelectChangeEvent<string>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, type: e.target.value, ...(hasConflicts && { resolved: true }) };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return <Box onClick={editType} display="flex" alignItems="center">
                        {edit && <FormControl fullWidth>
                            <InputLabel>{'Select data type'}</InputLabel>
                            <Select
                                defaultOpen
                                label={'Select data type'}
                                onChange={handleChange}
                                autoFocus
                                onBlur={editType}
                            >
                                {
                                    validDatatypes.map((option: any) =>
                                        (<MenuItem value={option} key={option}>{option}</MenuItem>))
                                }
                            </Select>
                        </FormControl>}
                        {!edit && <Typography>{value}</Typography>}
                        {!edit && !value && <Typography variant="subtitle2">Click to edit description</Typography>}
                    </Box>;
                }
            },
            {
                Header: 'Suggestions',
                accessor: 'suggestions',
                tipText: 'Suggestions for the field',
                editable: false,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const suggestions = value || [];
                    const { severityToColorMapping } = globalConfig;
                    return <Grid container spacing={2}>
                        <Grid item sm zeroMinWidth>
                            {suggestions.length === 0 &&
                                <Typography variant="body2">
                                    N/A
                                </Typography>}
                            <Stack spacing={1} divider={<Divider orientation='horizontal' flexItem />}>
                                {suggestions.length !== 0 && suggestions.map((payload: any, index: number) => {
                                    return (<div key={index}>
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
                                    </div>);
                                })}
                            </Stack>
                        </Grid>
                    </Grid>
                }
            },
            {
                Header: 'Required',
                accessor: 'required',
                tipText: 'Field is required',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, required: e.target.checked };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return (
                        <Box display="flex" alignItems="center">
                            <FormControl fullWidth sx={{ alignItems: 'center' }}>
                                <FormControlLabel
                                    sx={{ m: 'auto' }}
                                    control={<RequiredSwitch defaultChecked onChange={handleChange} />}
                                    label={''}
                                />
                            </FormControl>
                        </Box>
                    );
                }
            },
            {
                Header: 'Actions',
                tipText: 'Perform actions on the field',
                editable: false,
                disableFilters: true,
                Cell: ({ value: initialValue, updateMyData, ...rest }: any) =>
                    <Stack direction="row">
                        {/* <IconButton color="primary" size="large" onClick={_ => {
              setShowEdit(true)
              setSelection({ value: initialValue, ...rest })
            }}>
              <EditOutlined />
            </IconButton> */}
                        <IconButton color="primary" size="large" sx={{ m: 'auto' }} onClick={e => {
                            setOpenAlertDialog(true);
                            setSelection({ value: initialValue, ...rest });
                        }}>
                            <DeleteOutlined />
                        </IconButton>
                    </Stack>
            },
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

    const handleFilterChange = (filter: columnFilter) => {
        setFilterByChip(filter);
        setFlattenedData(() => {
            const data = wizardStoreState.pages[pageMeta.pageId].state.schema;
            if (filter.lookup === 'severity') {
                let result: any[] = [];
                _.filter(data, function (item) {
                    return item.suggestions?.map((sv_item: any) => {
                        if (sv_item.severity === filter.id) return result.push(item);
                    })
                });
                return result;
            }
            else return _.filter(data, [filter.lookup, filter.id])
        })
    }

    const deleteFilter = () => {
        setFilterByChip(null);
        const data = wizardStoreState.pages[pageMeta.pageId].state.schema;
        setFlattenedData(data);
        setSkipPageReset(false);
    }

    useEffect(() => {
        if (apiResponse?.status === 'success' && apiResponse?.data?.schema) {
            const flattenedSchema = flattenSchema(apiResponse.data.schema) as any;
            const existingState = pageData?.state?.schema;
            setFlattenedData(existingState || flattenedSchema);
            pushStateToStore(existingState || flattenedSchema);
            setSkipPageReset(false);
        }
    }, [apiResponse?.status]);

    return <>
        <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                {pageMeta.title}
            </Typography>
            <Stack direction="row" spacing={1}>
                {columnFilters.map((filter) => <Chip
                    key={filter.label}
                    aria-label='filter-issues'
                    clickable
                    label={filter.label}
                    sx={{ mx: 0.5 }}
                    color={filterByChip?.label === filter.label ? filter.color : undefined}
                    size="small"
                    onClick={() => handleFilterChange(filter)}
                    deleteIcon={filterByChip?.label === filter.label ? <DeleteFilled /> : undefined}
                    onDelete={filterByChip?.label === filter.label ? () => deleteFilter() : undefined}
                />
                )}
            </Stack>
        </Box>
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
                            {/* {selection && showEdit && <EditDataset open={showEdit} setData={setFlattenedData} onSubmit={() => setShowEdit(false)} selection={selection} ></EditDataset>} */}
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

const mapStateToProps = (state: any) => {
    return {
        wizardStoreState: state?.wizard
    }
}

export default connect(mapStateToProps, {})(ListColumns);
